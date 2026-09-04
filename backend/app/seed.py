"""
Run once to populate the database with the same dummy data the frontend
previously had hardcoded, so the dashboard/job listings look identical
once wired to the real API.

Usage: python -m app.seed
"""
from .database import SessionLocal, Base, engine
from . import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# wipe existing data for a clean reseed
for table in [models.InterviewSchedule, models.FinalScore, models.Assessment,
              models.Application, models.Resume, models.Candidate, models.JobRole]:
    db.query(table).delete()
db.commit()

jobs = [
    models.JobRole(title="Backend engineer, associate", team="Platform", location="Mumbai · Hybrid",
                    requirements="Python, FastAPI, PostgreSQL", min_experience=1, open_positions=2,
                    description="Own core API services for the platform team."),
    models.JobRole(title="Frontend engineer, intern", team="Product", location="Remote",
                    requirements="React, TypeScript", min_experience=0, open_positions=3,
                    description="Build candidate and HR-facing interfaces."),
    models.JobRole(title="Data analyst, associate", team="Insights", location="Mumbai · On-site",
                    requirements="SQL, Python, Tableau", min_experience=1, open_positions=1,
                    description="Turn hiring pipeline data into reporting."),
    models.JobRole(title="ML engineer, associate", team="AI Platform", location="Bengaluru · Hybrid",
                    requirements="PyTorch, NLP", min_experience=2, open_positions=1,
                    description="Build and tune the agent scoring models."),
]
db.add_all(jobs)
db.commit()
for j in jobs:
    db.refresh(j)

candidates_data = [
    ("Ananya Rao", "ananya.rao@example.com", jobs[0].job_id, "shortlisted", 92, 81, 88, 89),
    ("Rohan Mehta", "rohan.mehta@example.com", jobs[0].job_id, "shortlisted", 89, 85, 84, 86),
    ("Sara Khan", "sara.khan@example.com", jobs[0].job_id, "in_review", 85, 70, 79, 79),
    ("Devansh Iyer", "devansh.iyer@example.com", jobs[0].job_id, "in_review", 78, 74, 71, 75),
    ("Priya Nair", "priya.nair@example.com", jobs[0].job_id, "rejected", 61, 55, 58, 58),
]

for name, email, job_id, status, skill, exp, test, final in candidates_data:
    candidate = models.Candidate(name=name, email=email, phone="+91 90000 00000")
    db.add(candidate)
    db.flush()

    resume = models.Resume(
        candidate_id=candidate.candidate_id,
        file_name=f"{name.replace(' ', '_').lower()}_resume.pdf",
        skills="Python, FastAPI, PostgreSQL, Docker, REST APIs",
        experience="2.3 years, 1 backend internship + 1 full-time role",
        education="B.E. Information Technology",
    )
    db.add(resume)

    application = models.Application(candidate_id=candidate.candidate_id, job_id=job_id, status=status)
    db.add(application)
    db.flush()

    score = models.FinalScore(
        application_id=application.application_id,
        skill_score=skill, experience_score=exp, test_score=test, final_score=final,
        explanation=(
            f"{name.split()[0]} ranked based on a match between listed skills and the "
            f"required stack, plus assessment performance. No sensitive attributes were used in scoring."
        ),
    )
    db.add(score)

db.commit()
db.close()
print("Seed complete.")
