from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import Application

router = APIRouter(
    prefix="/industry/applications",
    tags=["Industry Applications"],
)


@router.get("/")
def get_industry_applications():
    db: Session = SessionLocal()

    try:
        applications = (
            db.query(Application)
            .order_by(Application.id.desc())
            .all()
        )

        return [
            {
                "id": application.id,
                "candidate_id": application.student_id,
                "candidate": (
                    "Aarav Sharma"
                    if application.student_id == 1
                    else f"Student {application.student_id}"
                ),
                "opportunity": application.opportunity_title,
                "match_score": application.match_score,
                "status": application.status,
                "stage": application.stage,
            }
            for application in applications
        ]

    finally:
        db.close()