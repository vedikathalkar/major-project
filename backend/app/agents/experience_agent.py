"""
Experience Agent (Phase 4).

Compares a candidate's extracted years of experience (from the Resume
Parsing Agent) against a job's minimum required experience, and produces
a 0-100 score.

Scoring logic, kept simple and explainable on purpose:
  - meets or exceeds the requirement -> full score
  - below the requirement -> scaled linearly (e.g. 1 of 2 required years = 50)
  - role has no minimum -> reward any experience, but don't punish having none
"""


def score_experience(candidate_years: float, min_experience: float) -> dict:
    candidate_years = candidate_years or 0.0
    min_experience = min_experience or 0.0

    if min_experience <= 0:
        score = 100.0 if candidate_years > 0 else 60.0
        note = (
            f"Role has no minimum experience requirement; candidate has {candidate_years} years."
            if candidate_years > 0
            else "Role has no minimum experience requirement; no experience detected on resume."
        )
    elif candidate_years >= min_experience:
        score = 100.0
        note = f"Meets the {min_experience}-year requirement with {candidate_years} years."
    else:
        score = round((candidate_years / min_experience) * 100, 1)
        note = f"Below the {min_experience}-year requirement — candidate has {candidate_years} years."

    return {"score": score, "note": note}
