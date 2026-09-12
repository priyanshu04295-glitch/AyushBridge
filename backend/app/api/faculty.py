from collections import Counter, defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import Session

from app.api.opportunities import get_opportunities
from app.api.students import assessment_results, students
from app.db.session import Base, get_db


router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"],
)


# =========================================================
# FACULTY
# =========================================================

FACULTY = {
    "id": 1,
    "name": "Dr. Meera Sharma",
    "department": "Ayurveda Research",
    "expertise": [
        "Clinical Research",
        "Ayurvedic Pharmacology",
        "Research Methodology",
        "Biostatistics",
        "Scientific Writing",
    ],
}


# =========================================================
# MENTORSHIP MODEL
# =========================================================

class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    student_name = Column(String, nullable=False)
    faculty_id = Column(Integer, nullable=False)
    faculty_name = Column(String, nullable=False)
    area = Column(String, nullable=False)
    message = Column(Text, default="")
    status = Column(String, default="Pending")


# =========================================================
# STATIC DATA
# =========================================================

COLLABORATIONS = [
    {
        "id": 1,
        "title": "Clinical Research Methodology Program",
        "organization": "AYUSH Research Network",
        "type": "Faculty Training",
        "status": "Active",
        "participants": 18,
    },
    {
        "id": 2,
        "title": "Ayurvedic Drug Research Project",
        "organization": "AyurHealth Labs",
        "type": "Research Collaboration",
        "status": "Active",
        "participants": 7,
    },
    {
        "id": 3,
        "title": "Healthcare Analytics Workshop",
        "organization": "Healthcare Analytics India",
        "type": "Workshop",
        "status": "Upcoming",
        "participants": 32,
    },
    {
        "id": 4,
        "title": "Clinical Research Mentorship",
        "organization": "Research Innovation Centre",
        "type": "Mentorship",
        "status": "Active",
        "participants": 12,
    },
]


RESEARCH_PROJECTS = [
    {
        "id": 1,
        "title": "Evidence-Based Evaluation of Ayurvedic Interventions",
        "type": "Research Project",
        "status": "Active",
        "industry_partner": "AYUSH Research Network",
    },
    {
        "id": 2,
        "title": "Clinical Data Analytics for AYUSH Research",
        "type": "Industry Project",
        "status": "Active",
        "industry_partner": "Healthcare Analytics India",
    },
    {
        "id": 3,
        "title": "Ayurvedic Pharmacology Validation Study",
        "type": "Consultancy",
        "status": "Completed",
        "industry_partner": "AyurHealth Labs",
    },
]


EVENTS = [
    {
        "title": "Industry Research Workshop",
        "organization": "AYUSH Research Network",
        "date": "12 September 2026",
        "type": "Workshop",
    },
    {
        "title": "Clinical Research Guest Lecture",
        "organization": "AyurHealth Labs",
        "date": "18 September 2026",
        "type": "Guest Lecture",
    },
    {
        "title": "Faculty Industry Training",
        "organization": "Healthcare Analytics India",
        "date": "24 September 2026",
        "type": "Industrial Training",
    },
]


# =========================================================
# EXISTING INTELLIGENCE
# =========================================================

def get_industry_skill_demand():
    opportunities = get_opportunities()

    skill_frequency = Counter()

    for opportunity in opportunities:
        for skill in opportunity.get("skills", []):
            skill_frequency[skill] += 1

    return skill_frequency


def get_student_competency_intelligence():

    competency_stats = defaultdict(
        lambda: {
            "score_total": 0,
            "attempts": 0,
        }
    )

    for assessment in assessment_results.values():

        for competency in assessment.get("competencies", []):

            skill = competency.get("competency")
            score = competency.get("score", 0)

            if not skill:
                continue

            competency_stats[skill]["score_total"] += score
            competency_stats[skill]["attempts"] += 1

    intelligence = []

    for skill, stats in competency_stats.items():

        average_score = round(
            stats["score_total"] / stats["attempts"]
        )

        intelligence.append(
            {
                "skill": skill,
                "average_student_score": average_score,
                "students_assessed": stats["attempts"],
                "development_need": (
                    "High"
                    if average_score < 50
                    else (
                        "Medium"
                        if average_score < 75
                        else "Low"
                    )
                ),
            }
        )

    intelligence.sort(
        key=lambda item: (
            item["development_need"] != "High",
            item["average_student_score"],
        )
    )

    return intelligence


# =========================================================
# DASHBOARD
# =========================================================

@router.get("/dashboard")
def get_faculty_dashboard(db: Session = Depends(get_db)):

    opportunities = get_opportunities()
    skill_frequency = get_industry_skill_demand()
    student_intelligence = get_student_competency_intelligence()

    active_collaborations = sum(
        1 for item in COLLABORATIONS
        if item["status"] == "Active"
    )

    active_research = sum(
        1 for item in RESEARCH_PROJECTS
        if item["status"] == "Active"
    )

    mentorship_count = db.query(
        MentorshipRequest
    ).count()

    relevant_demand = [
        skill
        for skill in FACULTY["expertise"]
        if skill in skill_frequency
    ]

    additional_demand = [
        skill
        for skill, count in skill_frequency.most_common()
        if skill not in FACULTY["expertise"]
        and count > 0
    ]

    primary_area = (
        relevant_demand[0]
        if relevant_demand
        else FACULTY["expertise"][0]
    )

    emerging_area = (
        additional_demand[0]
        if additional_demand
        else "Healthcare Data Analysis"
    )

    if student_intelligence:

        gap = student_intelligence[0]

        student_insight = (
            f"{gap['skill']} currently has an average "
            f"student assessment score of "
            f"{gap['average_student_score']}%. "
            f"Faculty expertise can support targeted "
            f"competency development."
        )

    else:

        student_insight = (
            "Student assessment intelligence will "
            "appear as assessments are completed."
        )

    return {
        "name": FACULTY["name"],
        "department": FACULTY["department"],
        "expertise": FACULTY["expertise"],
        "active_collaborations": active_collaborations,
        "research_projects": active_research,
        "mentorship_requests": mentorship_count,
        "industry_engagements": (
            len(COLLABORATIONS) + len(RESEARCH_PROJECTS)
        ),
        "upcoming_events": EVENTS,
        "ai_insight": (
            f"{primary_area} is strongly represented "
            f"in the current industry opportunity landscape. "
            f"There is an opportunity to expand collaboration "
            f"around {emerging_area}."
        ),
        "student_insight": student_insight,
        "student_population": len(students),
        "students_assessed": len(assessment_results),
        "industry_opportunities_tracked": len(opportunities),
    }


# =========================================================
# COLLABORATIONS
# =========================================================

@router.get("/collaborations")
def get_faculty_collaborations():
    return COLLABORATIONS


# =========================================================
# MENTORSHIP
# =========================================================

@router.get("/mentorship")
def get_faculty_mentorship(
    db: Session = Depends(get_db),
):

    requests = db.query(
        MentorshipRequest
    ).all()

    return [
        {
            "id": item.id,
            "student_id": item.student_id,
            "student": item.student_name,
            "faculty_id": item.faculty_id,
            "faculty": item.faculty_name,
            "area": item.area,
            "type": "Student Mentorship",
            "message": item.message,
            "status": item.status,
        }
        for item in requests
    ]


@router.post("/mentorship/request")
def request_mentorship(
    student_id: int,
    student_name: str,
    area: str,
    message: str = "",
    db: Session = Depends(get_db),
):

    existing = db.query(
        MentorshipRequest
    ).filter(
        MentorshipRequest.student_id == student_id,
        MentorshipRequest.faculty_id == FACULTY["id"],
        MentorshipRequest.status == "Pending",
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Mentorship request already exists.",
        )

    request = MentorshipRequest(
        student_id=student_id,
        student_name=student_name,
        faculty_id=FACULTY["id"],
        faculty_name=FACULTY["name"],
        area=area,
        message=message,
        status="Pending",
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    return {
        "message": "Mentorship request sent successfully.",
        "request": {
            "id": request.id,
            "student": request.student_name,
            "faculty": request.faculty_name,
            "area": request.area,
            "status": request.status,
        },
    }


@router.put("/mentorship/{request_id}")
def update_mentorship(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
):

    if status not in {
        "Pending",
        "Accepted",
        "Rejected",
        "Completed",
    }:
        raise HTTPException(
            status_code=400,
            detail="Invalid mentorship status.",
        )

    request = db.query(
        MentorshipRequest
    ).filter(
        MentorshipRequest.id == request_id
    ).first()

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Mentorship request not found.",
        )

    request.status = status

    db.commit()
    db.refresh(request)

    return {
        "message": "Mentorship status updated.",
        "id": request.id,
        "status": request.status,
    }


# =========================================================
# RESEARCH
# =========================================================

@router.get("/research")
def get_faculty_research():
    return RESEARCH_PROJECTS


# =========================================================
# INTELLIGENCE
# =========================================================

@router.get("/intelligence")
def get_faculty_intelligence():

    opportunities = get_opportunities()
    skill_frequency = get_industry_skill_demand()
    student_intelligence = get_student_competency_intelligence()

    expertise_intelligence = []

    for skill in FACULTY["expertise"]:

        demand_count = skill_frequency.get(skill, 0)

        student_record = next(
            (
                item
                for item in student_intelligence
                if item["skill"] == skill
            ),
            None,
        )

        average_score = (
            student_record["average_student_score"]
            if student_record
            else None
        )

        development_need = (
            student_record["development_need"]
            if student_record
            else "Not Assessed"
        )

        alignment = (
            "High"
            if demand_count >= 2
            else "Emerging"
            if demand_count == 1
            else "Low"
        )

        expertise_intelligence.append(
            {
                "skill": skill,
                "industry_opportunity_count": demand_count,
                "alignment": alignment,
                "student_average_score": average_score,
                "student_development_need": development_need,
            }
        )

    emerging_skills = [
        {
            "skill": skill,
            "opportunity_count": count,
        }
        for skill, count in skill_frequency.most_common()
        if skill not in FACULTY["expertise"]
    ][:5]

    priority_student_gaps = [
        item
        for item in student_intelligence
        if item["development_need"] in {"High", "Medium"}
    ][:5]

    return {
        "faculty": FACULTY["name"],
        "expertise_alignment": expertise_intelligence,
        "emerging_industry_skills": emerging_skills,
        "student_competency_gaps": priority_student_gaps,
        "recommended_focus": (
            emerging_skills[0]["skill"]
            if emerging_skills
            else "Healthcare Data Analysis"
        ),
        "industry_opportunities_tracked": len(opportunities),
        "students_assessed": len(assessment_results),
    }