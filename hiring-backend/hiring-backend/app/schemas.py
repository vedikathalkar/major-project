from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ---- Job Role ----
class JobRoleCreate(BaseModel):
    title: str
    team: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    min_experience: Optional[float] = 0
    open_positions: Optional[int] = 1
    weight_skill: Optional[int] = 40
    weight_experience: Optional[int] = 20
    weight_test: Optional[int] = 40


class JobRoleOut(JobRoleCreate):
    job_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Candidate ----
class CandidateCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    job_id: int  # which job they're applying for


class CandidateOut(BaseModel):
    candidate_id: int
    name: str
    email: str
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Application (candidate x job, with scores/status) ----
class ApplicationOut(BaseModel):
    application_id: int
    candidate_id: int
    job_id: int
    status: str
    applied_at: datetime
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None
    skill_score: Optional[float] = None
    experience_score: Optional[float] = None
    test_score: Optional[float] = None
    final_score: Optional[float] = None

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: str
