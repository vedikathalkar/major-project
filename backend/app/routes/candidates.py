from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/candidates", tags=["candidates"])


def _to_application_out(app: models.Application) -> dict:
    fs = app.final_score
    return {
        "application_id": app.application_id,
        "candidate_id": app.candidate_id,
        "job_id": app.job_id,
        "status": app.status,
        "applied_at": app.applied_at,
        "candidate_name": app.candidate.name if app.candidate else None,
        "job_title": app.job.title if app.job else None,
        "skill_score": fs.skill_score if fs else None,
        "experience_score": fs.experience_score if fs else None,
        "test_score": fs.test_score if fs else None,
        "final_score": fs.final_score if fs else None,
    }


@router.post("", response_model=schemas.ApplicationOut)
def create_candidate(payload: schemas.CandidateCreate, db: Session = Depends(get_db)):
    job = db.query(models.JobRole).filter(models.JobRole.job_id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidate = models.Candidate(name=payload.name, email=payload.email, phone=payload.phone)
    db.add(candidate)
    db.flush()  # get candidate_id before commit

    application = models.Application(candidate_id=candidate.candidate_id, job_id=payload.job_id, status="submitted")
    db.add(application)
    db.commit()
    db.refresh(application)

    return _to_application_out(application)


@router.get("", response_model=List[schemas.ApplicationOut])
def list_candidates(job_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(models.Application)
    if job_id is not None:
        query = query.filter(models.Application.job_id == job_id)
    applications = query.order_by(models.Application.applied_at.desc()).all()
    return [_to_application_out(a) for a in applications]


@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    resume = candidate.resume
    applications = [_to_application_out(a) for a in candidate.applications]

    return {
        "candidate_id": candidate.candidate_id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "resume": {
            "skills": resume.skills if resume else None,
            "experience": resume.experience if resume else None,
            "education": resume.education if resume else None,
        } if resume else None,
        "applications": applications,
    }


@router.patch("/applications/{application_id}/status")
def update_status(application_id: int, payload: schemas.StatusUpdate, db: Session = Depends(get_db)):
    app = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = payload.status
    db.commit()
    return {"application_id": application_id, "status": app.status}
