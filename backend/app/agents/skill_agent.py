"""
Skill Agent (Phase 4).

Compares a candidate's extracted skills (from the Resume Parsing Agent)
against a job's required skills, and produces a 0-100 match score plus
the matched/missing lists — which the Explainability Agent (Phase 7)
will eventually turn into a human-readable justification.

Rule-based on purpose: a straightforward overlap ratio is deterministic,
easy to explain in a report, and doesn't need an extra model or embedding
dependency. The natural upgrade path — if exact string matching feels too
strict (e.g. "Next.js" should count partway toward a "React" requirement)
— is swapping this for sentence-embedding similarity between candidate
skills and required skills. That's a drop-in replacement: only the
scoring function's internals change, the return shape stays the same.
"""


def _normalize(skills_str: str) -> set[str]:
    if not skills_str or skills_str.strip().lower() == "none detected":
        return set()
    return {s.strip().lower() for s in skills_str.split(",") if s.strip()}


def score_skills(candidate_skills: str, job_requirements: str) -> dict:
    """
    candidate_skills: comma-separated string from Resume.skills
    job_requirements: comma-separated string from JobRole.requirements

    Returns: {score, matched, missing, extra}
    """
    candidate_set = _normalize(candidate_skills)
    required_list = [s.strip() for s in (job_requirements or "").split(",") if s.strip()]
    required_set_lower = {s.lower() for s in required_list}

    if not required_list:
        return {"score": 0.0, "matched": [], "missing": [], "extra": sorted(candidate_set)}

    matched = [req for req in required_list if req.lower() in candidate_set]
    missing = [req for req in required_list if req.lower() not in candidate_set]
    extra = sorted(candidate_set - required_set_lower)

    score = round((len(matched) / len(required_list)) * 100, 1)

    return {
        "score": score,
        "matched": matched,
        "missing": missing,
        "extra": extra,
    }
