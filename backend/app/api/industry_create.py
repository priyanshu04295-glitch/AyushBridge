from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import IndustryOpportunity

router = APIRouter(
    prefix="/industry/create-opportunity",
    tags=["Industry Opportunity Creation"],
)


class OpportunityCreate(BaseModel):
    title: str
    opportunity_type: str
    description: str
    duration: str
    mode: str
    competencies: list[str]


@router.post("/")
def create_opportunity(opportunity: OpportunityCreate):
    db: Session = SessionLocal()

    try:
        latest_id = db.query(func.max(IndustryOpportunity.id)).scalar()
        opportunity_id = max(latest_id or 100, 100) + 1

        created_opportunity = IndustryOpportunity(
            id=opportunity_id,
            title=opportunity.title,
            opportunity_type=opportunity.opportunity_type,
            description=opportunity.description,
            duration=opportunity.duration,
            mode=opportunity.mode,
            competencies=opportunity.competencies,
            status="Pending Verification",
            created_by="Ayurveda Research Institute",
        )

        db.add(created_opportunity)
        db.commit()

        return {
            "success": True,
            "message": (
                "Opportunity saved and queued for verification."
            ),
            "opportunity": {
                "id": created_opportunity.id,
                "title": created_opportunity.title,
                "type": created_opportunity.opportunity_type,
                "description": created_opportunity.description,
                "duration": created_opportunity.duration,
                "mode": created_opportunity.mode,
                "competencies": created_opportunity.competencies,
                "status": created_opportunity.status,
                "created_by": created_opportunity.created_by,
            },
            "competency_mapping": {
                "competency_count": len(
                    created_opportunity.competencies
                ),
                "recommendation": (
                    "Opportunity requirements have been mapped to "
                    "competencies and are ready for verification."
                ),
            },
        }
    finally:
        db.close()
