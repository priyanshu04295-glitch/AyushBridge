from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.api.opportunities import get_opportunities
from app.db.session import SessionLocal
from app.models.user import Application

router = APIRouter(prefix="/applications", tags=["Applications"])


def application_to_dict(application: Application):
    return {
        "id": application.id,
        "student_id": application.student_id,
        "opportunity_id": application.opportunity_id,
        "opportunity_title": application.opportunity_title,
        "organization": application.organization,
        "match_score": application.match_score,
        "status": application.status,
        "stage": application.stage,
    }


@router.get("/")
def get_applications():
    db: Session = SessionLocal()

    try:
        applications = (
            db.query(Application)
            .order_by(Application.id.asc())
            .all()
        )

        return [
            application_to_dict(application)
            for application in applications
        ]

    finally:
        db.close()


@router.post("/")
def submit_application(payload: dict):

    student_id = payload.get("student_id", 1)
    opportunity_id = payload.get("opportunity_id")

    if opportunity_id is None:
        return {
            "success": False,
            "message": "Opportunity ID is required.",
        }

    try:
        opportunity_id = int(opportunity_id)
        student_id = int(student_id)
    except (TypeError, ValueError):
        return {
            "success": False,
            "message": "Invalid student or opportunity ID.",
        }

    opportunities = get_opportunities()

    opportunity = next(
        (
            item
            for item in opportunities
            if item["id"] == opportunity_id
        ),
        None,
    )

    if opportunity is None:
        return {
            "success": False,
            "message": "Opportunity not found.",
        }

    db: Session = SessionLocal()

    try:
        existing_application = (
            db.query(Application)
            .filter(
                Application.student_id == student_id,
                Application.opportunity_id == opportunity_id,
            )
            .first()
        )

        if existing_application:
            return {
                "success": False,
                "message": "You have already applied for this opportunity.",
                "application": application_to_dict(
                    existing_application
                ),
            }

        new_application = Application(
            student_id=student_id,
            opportunity_id=opportunity["id"],
            opportunity_title=opportunity["title"],
            organization=opportunity["organization"],
            match_score=opportunity["match_score"],
            status="Submitted",
            stage="Application Submitted",
        )

        db.add(new_application)
        db.commit()
        db.refresh(new_application)

        return {
            "success": True,
            "message": "Application submitted successfully.",
            "application": application_to_dict(new_application),
        }

    finally:
        db.close()