from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import Session

from app.db.session import Base, get_db


router = APIRouter(
    prefix="/industry",
    tags=["Industry"],
)


# =========================================================
# INDUSTRY-FACULTY COLLABORATION MODEL
# =========================================================

class IndustryFacultyCollaboration(Base):
    __tablename__ = "industry_faculty_collaborations"

    id = Column(Integer, primary_key=True, index=True)
    industry_name = Column(String, nullable=False)
    faculty_id = Column(Integer, nullable=False)
    faculty_name = Column(String, nullable=False)
    collaboration_type = Column(String, nullable=False)
    competencies = Column(Text, default="")
    message = Column(Text, default="")
    status = Column(String, default="Pending")


# =========================================================
# INDUSTRY DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_industry_dashboard():

    return {
        "name": "Ayurveda Research Institute",

        "active_opportunities": 8,

        "applications": 124,

        "shortlisted": 18,

        "verified_candidates": 42,

        "top_demand": [
            {
                "skill": "Clinical Research",
                "demand": 92,
            },
            {
                "skill": "Research Methodology",
                "demand": 86,
            },
            {
                "skill": "Biostatistics",
                "demand": 74,
            },
            {
                "skill": "Pharmacology",
                "demand": 68,
            },
            {
                "skill": "Healthcare Data Analysis",
                "demand": 61,
            },
        ],

        "ai_insight": (
            "Biostatistics is the largest emerging competency gap among "
            "available candidates. Industry partners can improve hiring "
            "readiness by creating opportunities that include structured "
            "Biostatistics and Clinical Data Management pathways."
        ),
    }


# =========================================================
# INDUSTRY → FACULTY
# =========================================================

@router.get("/faculty-collaborations")
def get_industry_faculty_collaborations(
    db: Session = Depends(get_db),
):

    collaborations = db.query(
        IndustryFacultyCollaboration
    ).all()

    return [
        {
            "id": item.id,
            "industry_name": item.industry_name,
            "faculty_id": item.faculty_id,
            "faculty_name": item.faculty_name,
            "collaboration_type": item.collaboration_type,
            "competencies": item.competencies,
            "message": item.message,
            "status": item.status,
        }
        for item in collaborations
    ]


@router.post("/faculty-collaboration")
def request_faculty_collaboration(
    collaboration_type: str,
    competencies: str = "",
    message: str = "",
    db: Session = Depends(get_db),
):

    collaboration = IndustryFacultyCollaboration(
        industry_name="Ayurveda Research Institute",
        faculty_id=1,
        faculty_name="Dr. Meera Sharma",
        collaboration_type=collaboration_type,
        competencies=competencies,
        message=message,
        status="Pending",
    )

    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)

    return {
        "message": "Faculty collaboration request sent successfully.",
        "collaboration": {
            "id": collaboration.id,
            "industry_name": collaboration.industry_name,
            "faculty_name": collaboration.faculty_name,
            "collaboration_type": collaboration.collaboration_type,
            "competencies": collaboration.competencies,
            "status": collaboration.status,
        },
    }


@router.put("/faculty-collaboration/{collaboration_id}")
def update_faculty_collaboration(
    collaboration_id: int,
    status: str,
    db: Session = Depends(get_db),
):

    allowed_statuses = {
        "Pending",
        "Accepted",
        "Rejected",
        "Active",
        "Completed",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid collaboration status.",
        )

    collaboration = db.query(
        IndustryFacultyCollaboration
    ).filter(
        IndustryFacultyCollaboration.id
        == collaboration_id
    ).first()

    if not collaboration:
        raise HTTPException(
            status_code=404,
            detail="Collaboration request not found.",
        )

    collaboration.status = status

    db.commit()
    db.refresh(collaboration)

    return {
        "message": "Collaboration status updated.",
        "id": collaboration.id,
        "status": collaboration.status,
    }