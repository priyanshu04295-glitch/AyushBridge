from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import Application

router = APIRouter(
    prefix="/industry/shortlist",
    tags=["Industry Shortlisting"],
)


@router.post("/{application_id}")
def shortlist_application(application_id: int):
    db: Session = SessionLocal()

    try:
        application = (
            db.query(Application)
            .filter(Application.id == application_id)
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        application.status = "Shortlisted"
        application.stage = "Shortlisted"

        db.commit()
        db.refresh(application)

        return {
            "success": True,
            "application_id": application.id,
            "candidate_id": application.student_id,
            "status": "Shortlisted",
            "message": "Application has been shortlisted successfully.",
            "next_stage": "Shortlisted",
        }

    finally:
        db.close()