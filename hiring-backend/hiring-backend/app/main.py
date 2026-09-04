from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes import jobs, candidates, resumes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic Hiring System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(resumes.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "Agentic Hiring System API"}
