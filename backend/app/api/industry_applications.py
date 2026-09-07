from fastapi import APIRouter

router = APIRouter(
    prefix="/industry/applications",
    tags=["Industry Applications"],
)


@router.get("/")
def get_industry_applications():
    return [
        {
            "id": 1,
            "candidate_id": 1,
            "candidate": "Aarav Sharma",
            "opportunity": "Clinical Research Intern",
            "match_score": 92,
            "status": "Industry Review",
            "stage": "Review",
        },
        {
            "id": 2,
            "candidate_id": 2,
            "candidate": "Ananya Patel",
            "opportunity": "AYUSH Evidence Research Project",
            "match_score": 88,
            "status": "Shortlisted",
            "stage": "Interview",
        },
        {
            "id": 3,
            "candidate_id": 3,
            "candidate": "Riya Menon",
            "opportunity": "Clinical Research Intern",
            "match_score": 84,
            "status": "Assessment",
            "stage": "Skill Assessment",
        },
        {
            "id": 4,
            "candidate_id": 4,
            "candidate": "Kabir Singh",
            "opportunity": "Healthcare Data Analyst Intern",
            "match_score": 79,
            "status": "Applied",
            "stage": "Initial Review",
        },
    ]
