from fastapi import APIRouter

router = APIRouter(prefix="/industry", tags=["Industry"])


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