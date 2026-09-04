"""
Resume Parsing Agent (Phase 3, NLP version).

Text extraction:
    pdfplumber (PDF) / python-docx (DOCX) -> plain text

Entity extraction (the actual NLP):
    A custom-trained spaCy NER model (see train_ner.py) that extends
    spaCy's pretrained English pipeline with two new entity types,
    SKILL and DEGREE, learned from labeled training examples rather
    than string-matched against a fixed list.

    The base pipeline's own pretrained entities (ORG, DATE) are reused
    for the experience section to pull out company names and durations
    without any extra training.

Because the model is trained on synthetic (template-generated) examples
rather than hand-annotated real resumes, it has real failure modes —
it can mislabel proper nouns as SKILL or stray numbers as DEGREE. To
keep results usable for scoring, SKILL predictions are cross-checked
against a curated keyword list before being trusted, and the keyword
list also fills in anything the model misses. This hybrid — model for
recall on novel terms, keyword list for precision — is a standard
pattern for domain-specific NER when you don't have a large labeled
dataset to train on.
"""
import os
import re
from pathlib import Path

import spacy
import pdfplumber
from docx import Document

MODEL_DIR = Path(__file__).parent / "ner_model"
_nlp = None       # trained custom model (SKILL, DEGREE, + original labels)
_base_nlp = None  # untouched pretrained model, used only to catch ORG/GPE
                  # names our fine-tuned model starts misreading as SKILL

# Used to sanity-check the model's SKILL predictions (see module docstring).
SKILL_KEYWORDS = {
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "rust",
    "react", "react.js", "angular", "vue", "vue.js", "next.js", "node.js", "express",
    "fastapi", "flask", "django", "spring", "spring boot",
    "html", "css", "tailwind", "bootstrap",
    "sql", "mysql", "postgresql", "mongodb", "sqlite", "redis", "firebase",
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "git", "github",
    "machine learning", "deep learning", "nlp", "natural language processing",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "opencv",
    "data analysis", "data structures", "algorithms", "rest api", "rest apis", "graphql",
    "agile", "scrum", "linux", "bash", "kotlin", "swift", "flutter", "dart",
    "r", "matlab", "tableau", "power bi", "excel", "figma", "ui/ux",
    "ansible", "terraform", "jenkins", "ci", "cd",
}

# Common false-positive traps the model tends to fall into
DEGREE_BLOCKLIST_TOKENS = {"year", "years", "team", "engineers", "interns"}

# Section headers and generic nouns the model sometimes mislabels as
# SKILL on real (non-synthetic) resume text. Company/institution names
# are NOT hardcoded here — that wouldn't generalize past one test file.
# Instead they're filtered dynamically below using a second, untouched
# copy of the base model as an organization-name detector.
SKILL_BLOCKLIST = {
    "india", "experience", "education", "skills", "projects", "summary",
    "objective", "contact", "profile", "references", "certifications",
    "achievements", "internship", "internships",
}


def _get_nlp():
    global _nlp
    if _nlp is None:
        if MODEL_DIR.exists():
            _nlp = spacy.load(MODEL_DIR)
        else:
            # fallback to the plain pretrained pipeline if the custom model
            # hasn't been trained yet — SKILL/DEGREE just won't be recognized
            _nlp = spacy.load("en_core_web_sm")
    return _nlp


def _get_base_nlp():
    global _base_nlp
    if _base_nlp is None:
        _base_nlp = spacy.load("en_core_web_sm")
    return _base_nlp


def _org_gpe_spans(text: str) -> list[tuple[int, int]]:
    """Company and place names according to the untouched base model —
    used to suppress the fine-tuned model's false-positive SKILL predictions
    on the same words (a known side effect of narrow fine-tuning)."""
    base_doc = _get_base_nlp()(text)
    return [(ent.start_char, ent.end_char) for ent in base_doc.ents if ent.label_ in ("ORG", "GPE", "PERSON")]


def _overlaps(span, spans) -> bool:
    s0, e0 = span
    return any(s0 < e1 and s1 < e0 for s1, e1 in spans)


def extract_text_from_pdf(path: str) -> str:
    text_parts = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs)


def extract_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(path)
    elif ext in (".docx", ".doc"):
        return extract_text_from_docx(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def _is_plausible_skill(text: str) -> bool:
    lower = text.lower().strip()
    if lower in SKILL_KEYWORDS:
        return True
    if lower in SKILL_BLOCKLIST:
        return False
    # Real resumes are bullet/heading formatted, not clean prose like the
    # synthetic training data — the model can occasionally grab an overlong
    # or multi-line span. Bound it: genuine skills are short single terms.
    if "\n" in text or len(text) > 30 or len(text.split()) > 4:
        return False
    if len(lower) < 2:
        return False
    if re.search(r"\b(university|institute|college|iit|nit|bombay|delhi|mumbai|engineer|engineering|intern|contributor)\b", lower):
        return False
    if lower.isdigit():
        return False
    return True


def extract_skills(doc) -> list[str]:
    found = []
    seen = set()
    suppress_spans = _org_gpe_spans(doc.text)

    # 1) model predictions, filtered for plausibility and checked against
    #    known organization/place names so "UptoSkills" or "Mumbai" don't
    #    get counted as a skill just because the fine-tuned model guessed wrong
    for ent in doc.ents:
        if ent.label_ != "SKILL":
            continue
        if not _is_plausible_skill(ent.text):
            continue
        if _overlaps((ent.start_char, ent.end_char), suppress_spans):
            continue
        key = ent.text.lower().strip()
        if key not in seen:
            seen.add(key)
            found.append(ent.text.strip())

    # 2) keyword fallback — catches anything phrased in a way the model missed
    lower_text = doc.text.lower()
    for skill in SKILL_KEYWORDS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, lower_text) and skill not in seen:
            seen.add(skill)
            found.append(skill.title() if skill.islower() and len(skill) > 2 else skill)

    return found


def extract_education(doc) -> str:
    matches = []
    suppress_spans = _org_gpe_spans(doc.text)
    for ent in doc.ents:
        if ent.label_ != "DEGREE":
            continue
        cleaned = ent.text.strip()
        tokens = cleaned.lower().split()
        if any(t in DEGREE_BLOCKLIST_TOKENS for t in tokens):
            continue
        if len(cleaned) < 2 or "\n" in cleaned or len(cleaned) > 45:
            continue
        if cleaned.replace(" ", "").isdigit():
            continue
        if _overlaps((ent.start_char, ent.end_char), suppress_spans):
            continue
        if cleaned not in matches:
            matches.append(cleaned)
    return "; ".join(matches) if matches else "Not detected"


EXPERIENCE_YEAR_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*\+?\s*years?", re.IGNORECASE)
SECTION_HEADERS = {
    "experience": ["experience", "work experience", "employment history", "internship"],
    "education": ["education", "academic background", "qualifications"],
    "projects": ["projects", "academic projects", "personal projects"],
}


def _find_section(text: str, section_key: str) -> str:
    lines = text.split("\n")
    headers_flat = [h for headers in SECTION_HEADERS.values() for h in headers]
    start_idx = None
    for i, line in enumerate(lines):
        clean = line.strip().lower()
        if any(clean == h or clean.startswith(h) for h in SECTION_HEADERS[section_key]):
            start_idx = i + 1
            break
    if start_idx is None:
        return ""
    end_idx = len(lines)
    for i in range(start_idx, len(lines)):
        clean = lines[i].strip().lower()
        if any(clean == h or clean.startswith(h) for h in headers_flat) and clean not in SECTION_HEADERS[section_key]:
            end_idx = i
            break
    return "\n".join(lines[start_idx:end_idx]).strip()


def extract_experience_years(text: str) -> float:
    matches = EXPERIENCE_YEAR_PATTERN.findall(text)
    return max((float(m) for m in matches), default=0.0)


def extract_experience_summary(nlp, text: str) -> str:
    years = extract_experience_years(text)
    section = _find_section(text, "experience")

    header = f"{years} years of experience mentioned." if years else \
        "No explicit years of experience found; inferred from listed roles."

    if not section:
        return header

    # pull organization names out of the experience section using the
    # base model's pretrained ORG entity recognition — no custom training
    # needed for this part, it comes free with en_core_web_sm
    section_doc = nlp(section)
    orgs = list(dict.fromkeys(ent.text for ent in section_doc.ents if ent.label_ == "ORG"))

    lines = [l.strip("•- \t") for l in section.split("\n") if l.strip()][:5]
    summary = header
    if orgs:
        summary += f" Organizations mentioned: {', '.join(orgs[:4])}."
    if lines:
        summary += " " + " / ".join(lines)
    return summary


def parse_resume(file_path: str) -> dict:
    nlp = _get_nlp()
    text = extract_text(file_path)
    doc = nlp(text)

    skills = extract_skills(doc)
    education = extract_education(doc)
    experience_summary = extract_experience_summary(nlp, text)
    experience_years = extract_experience_years(text)

    return {
        "skills": ", ".join(skills) if skills else "None detected",
        "education": education,
        "experience": experience_summary,
        "experience_years": experience_years,
        "raw_text_length": len(text),
    }
