from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import IndustryOpportunity

router = APIRouter(
    prefix="/industry/opportunities",
    tags=["Industry Opportunities"],
)


@router.get("/")
def get_industry_opportunities():
    opportunities = [
        {
            "id": 1,
            "title": "Clinical Research Intern",
            "type": "Internship",
            "status": "Active",
            "applicants": 42,
            "shortlisted": 8,
            "verified_matches": 15,
            "top_competencies": [
                "Clinical Research",
                "Research Methodology",
                "Biostatistics",
            ],
        },
        {
            "id": 2,
            "title": "AYUSH Evidence Research Project",
            "type": "Research Project",
            "status": "Active",
            "applicants": 18,
            "shortlisted": 5,
            "verified_matches": 9,
            "top_competencies": [
                "Research Methodology",
                "Healthcare Data Analysis",
                "Scientific Writing",
            ],
        },
        {
            "id": 3,
            "title": "Ayurvedic Pharmacology Validation",
            "type": "Consultancy",
            "status": "Active",
            "applicants": 9,
            "shortlisted": 3,
            "verified_matches": 6,
            "top_competencies": [
                "Ayurvedic Pharmacology",
                "Clinical Research",
                "Quality Control",
            ],
        },
        {
            "id": 4,
            "title": "Healthcare Data Analyst Intern",
            "type": "Internship",
            "status": "Active",
            "applicants": 34,
            "shortlisted": 7,
            "verified_matches": 12,
            "top_competencies": [
                "Healthcare Data Analysis",
                "Biostatistics",
                "Clinical Data Management",
            ],
        },
    ]

    db: Session = SessionLocal()

    try:
        saved_opportunities = (
            db.query(IndustryOpportunity)
            .order_by(IndustryOpportunity.id.desc())
            .all()
        )

        opportunities.extend(
            {
                "id": opportunity.id,
                "title": opportunity.title,
                "type": opportunity.opportunity_type,
                "status": opportunity.status,
                "applicants": 0,
                "shortlisted": 0,
                "verified_matches": 0,
                "top_competencies": opportunity.competencies,
            }
            for opportunity in saved_opportunities
        )

        return opportunities
    finally:
        db.close()
