from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=schemas.JobRoleOut)
def create_job(job: schemas.JobRoleCreate, db: Session = Depends(get_db)):
    db_job = models.JobRole(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@router.get("", response_model=List[schemas.JobRoleOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(models.JobRole).order_by(models.JobRole.created_at.desc()).all()


@router.get("/{job_id}", response_model=schemas.JobRoleOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.JobRole).filter(models.JobRole.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
