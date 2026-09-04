import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from ..agents.resume_parser import parse_resume

router = APIRouter(prefix="/resumes", tags=["resumes"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/{candidate_id}")
async def upload_resume(candidate_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".pdf", ".docx", ".doc"):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX resumes are supported")

    file_path = os.path.join(UPLOAD_DIR, f"{candidate_id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Resume Parsing Agent: extract skills, education, experience from the file
    try:
        parsed = parse_resume(file_path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse resume: {e}")

    resume = models.Resume(
        candidate_id=candidate_id,
        file_name=file.filename,
        file_path=file_path,
        skills=parsed["skills"],
        experience=parsed["experience"],
        education=parsed["education"],
    )
    db.add(resume)

    # move the application forward in the pipeline now that parsing is done
    application = candidate.applications[-1] if candidate.applications else None
    if application:
        application.status = "parsed"

    db.commit()
    db.refresh(resume)

    return {
        "resume_id": resume.resume_id,
        "candidate_id": candidate_id,
        "file_name": resume.file_name,
        "skills": resume.skills,
        "education": resume.education,
        "experience": resume.experience,
        "experience_years": parsed["experience_years"],
    }
