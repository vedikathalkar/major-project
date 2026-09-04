from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class JobRole(Base):
    __tablename__ = "job_roles"

    job_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    team = Column(String(100))
    location = Column(String(150))
    description = Column(Text)
    requirements = Column(Text)  # comma separated skills, e.g. "Python, FastAPI, SQL"
    min_experience = Column(Float, default=0)
    open_positions = Column(Integer, default=1)
    weight_skill = Column(Integer, default=40)
    weight_experience = Column(Integer, default=20)
    weight_test = Column(Integer, default=40)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="job")


class Candidate(Base):
    __tablename__ = "candidates"

    candidate_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30))
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="candidate", uselist=False)
    applications = relationship("Application", back_populates="candidate")


class Resume(Base):
    __tablename__ = "resumes"

    resume_id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.candidate_id"), nullable=False)
    file_name = Column(String(255))
    file_path = Column(String(500))
    skills = Column(Text)       # extracted, comma separated
    experience = Column(Text)   # extracted summary
    education = Column(Text)    # extracted summary
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="resume")


class Application(Base):
    """Links a candidate to a job role. Not in the original ER diagram by name,
    but needed to represent the many-to-many 'applies for' relationship and
    track per-job status shown on the dashboard."""
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.candidate_id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_roles.job_id"), nullable=False)
    status = Column(String(50), default="submitted")
    # submitted -> assessed -> shortlisted -> scheduled -> selected / rejected
    applied_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="applications")
    job = relationship("JobRole", back_populates="applications")
    assessment = relationship("Assessment", back_populates="application", uselist=False)
    final_score = relationship("FinalScore", back_populates="application", uselist=False)
    interview = relationship("InterviewSchedule", back_populates="application", uselist=False)


class Assessment(Base):
    __tablename__ = "assessments"

    assessment_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id"), nullable=False)
    questions = Column(Text)   # JSON string of generated questions
    answers = Column(Text)     # JSON string of candidate answers
    score = Column(Float)
    completed_at = Column(DateTime)

    application = relationship("Application", back_populates="assessment")


class FinalScore(Base):
    __tablename__ = "final_scores"

    score_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id"), nullable=False)
    skill_score = Column(Float, default=0)
    experience_score = Column(Float, default=0)
    test_score = Column(Float, default=0)
    final_score = Column(Float, default=0)
    explanation = Column(Text)

    application = relationship("Application", back_populates="final_score")


class InterviewSchedule(Base):
    __tablename__ = "interview_schedules"

    schedule_id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.application_id"), nullable=False)
    date = Column(String(20))
    time = Column(String(20))
    mode = Column(String(50), default="Google Meet")
    status = Column(String(50), default="scheduled")

    application = relationship("Application", back_populates="interview")
