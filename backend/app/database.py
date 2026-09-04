from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite for local development — zero setup required.
# To switch to MySQL later, change this to something like:
#   "mysql+pymysql://user:password@localhost/hiring_db"
# and add `pymysql` to requirements.txt.
SQLALCHEMY_DATABASE_URL = "sqlite:///./hiring.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
