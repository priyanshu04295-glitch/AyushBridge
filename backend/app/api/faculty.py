from collections import Counter, defaultdict

from fastapi import APIRouter

from app.api.opportunities import get_opportunities
from app.api.students import (
    assessment_results,
    students,
)

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"],
)


FACULTY = {
    "name": "Dr. Meera Sharma",
    "department": "Ayurveda Research",
    "expertise": [
        "Clinical Research",
        "Ayurvedic Pharmacology",
        "Research Methodology",
    ],
}


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


MENTORSHIP = [
    {
        "id": 1,
        "student": "Aarav Sharma",
        "area": "Clinical Research",
        "type": "Student Mentorship",
        "status": "Active",
    },
    {
        "id": 2,
        "student": "Ananya Patel",
        "area": "Research Methodology",
        "type": "Research Mentorship",
        "status": "Active",
    },
    {
        "id": 3,
        "student": "Riya Menon",
        "area": "Scientific Writing",
        "type": "Project Mentorship",
        "status": "Pending",
    },
]


RESEARCH_PROJECTS = [
    {
        "id": 1,
        "title": (
            "Evidence-Based Evaluation of "
            "Ayurvedic Interventions"
        ),
        "type": "Research Project",
        "status": "Active",
        "industry_partner": "AYUSH Research Network",
    },
    {
        "id": 2,
        "title": (
            "Clinical Data Analytics for "
            "AYUSH Research"
        ),
        "type": "Industry Project",
        "status": "Active",
        "industry_partner": (
            "Healthcare Analytics India"
        ),
    },
    {
        "id": 3,
        "title": (
            "Ayurvedic Pharmacology Validation Study"
        ),
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


def get_industry_skill_demand():
    opportunities = get_opportunities()

    skill_frequency = Counter()

    for opportunity in opportunities:
        for skill in opportunity.get(
            "skills",
            [],
        ):
            skill_frequency[skill] += 1

    return skill_frequency


def get_student_competency_intelligence():
    """
    Aggregate actual student assessment results.

    This allows faculty intelligence to identify areas
    where faculty expertise can support student
    competency development.
    """

    competency_stats = defaultdict(
        lambda: {
            "score_total": 0,
            "attempts": 0,
        }
    )

    for assessment in assessment_results.values():

        for competency in assessment.get(
            "competencies",
            [],
        ):

            skill = competency.get(
                "competency"
            )

            score = competency.get(
                "score",
                0,
            )

            if not skill:
                continue

            competency_stats[skill][
                "score_total"
            ] += score

            competency_stats[skill][
                "attempts"
            ] += 1

    intelligence = []

    for skill, stats in competency_stats.items():

        average_score = round(
            stats["score_total"]
            / stats["attempts"]
        )

        intelligence.append(
            {
                "skill": skill,
                "average_student_score": (
                    average_score
                ),
                "students_assessed": (
                    stats["attempts"]
                ),
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


@router.get("/dashboard")
def get_faculty_dashboard():

    opportunities = get_opportunities()

    skill_frequency = (
        get_industry_skill_demand()
    )

    student_intelligence = (
        get_student_competency_intelligence()
    )

    relevant_demand = [
        skill
        for skill in FACULTY["expertise"]
        if skill in skill_frequency
    ]

    additional_demand = [
        skill
        for skill, count
        in skill_frequency.most_common()
        if skill not in FACULTY["expertise"]
        and count > 0
    ]

    industry_engagements = (
        len(COLLABORATIONS)
        + len(RESEARCH_PROJECTS)
    )

    active_collaborations = sum(
        1
        for item in COLLABORATIONS
        if item["status"] == "Active"
    )

    active_research = sum(
        1
        for item in RESEARCH_PROJECTS
        if item["status"] == "Active"
    )

    mentorship_requests = len(
        MENTORSHIP
    )

    if relevant_demand:
        primary_area = relevant_demand[0]
    else:
        primary_area = (
            FACULTY["expertise"][0]
        )

    if additional_demand:
        emerging_area = additional_demand[0]
    else:
        emerging_area = (
            "Healthcare Data Analysis"
        )

    if student_intelligence:

        priority_student_gap = (
            student_intelligence[0]
        )

        student_insight = (
            f"{priority_student_gap['skill']} "
            f"currently has an average student "
            f"assessment score of "
            f"{priority_student_gap['average_student_score']}%. "
            f"Faculty expertise can be used to "
            f"support targeted competency development."
        )

    else:

        student_insight = (
            "Student assessment intelligence "
            "will appear here as assessments "
            "are completed."
        )

    return {
        "name": FACULTY["name"],
        "department": FACULTY["department"],
        "expertise": FACULTY["expertise"],

        "active_collaborations": (
            active_collaborations
        ),

        "research_projects": (
            active_research
        ),

        "mentorship_requests": (
            mentorship_requests
        ),

        "industry_engagements": (
            industry_engagements
        ),

        "upcoming_events": EVENTS,

        "ai_insight": (
            f"{primary_area} is strongly represented "
            f"in the current industry opportunity "
            f"landscape. There is an opportunity to "
            f"expand faculty-industry collaboration "
            f"around {emerging_area} and related "
            f"competency development."
        ),

        "student_insight": student_insight,

        "student_population": len(
            students
        ),

        "students_assessed": len(
            assessment_results
        ),

        "industry_opportunities_tracked": (
            len(opportunities)
        ),
    }


@router.get("/collaborations")
def get_faculty_collaborations():
    return COLLABORATIONS


@router.get("/mentorship")
def get_faculty_mentorship():
    return MENTORSHIP


@router.get("/research")
def get_faculty_research():
    return RESEARCH_PROJECTS


@router.get("/intelligence")
def get_faculty_intelligence():

    opportunities = get_opportunities()

    skill_frequency = (
        get_industry_skill_demand()
    )

    student_intelligence = (
        get_student_competency_intelligence()
    )

    expertise_intelligence = []

    for skill in FACULTY["expertise"]:

        demand_count = skill_frequency.get(
            skill,
            0,
        )

        student_record = next(
            (
                item
                for item
                in student_intelligence
                if item["skill"] == skill
            ),
            None,
        )

        if student_record:

            average_score = (
                student_record[
                    "average_student_score"
                ]
            )

            development_need = (
                student_record[
                    "development_need"
                ]
            )

        else:

            average_score = None
            development_need = (
                "Not Assessed"
            )

        if demand_count >= 2:
            alignment = "High"
        elif demand_count == 1:
            alignment = "Emerging"
        else:
            alignment = "Low"

        expertise_intelligence.append(
            {
                "skill": skill,

                "industry_opportunity_count": (
                    demand_count
                ),

                "alignment": alignment,

                "student_average_score": (
                    average_score
                ),

                "student_development_need": (
                    development_need
                ),
            }
        )

    emerging_skills = [
        {
            "skill": skill,
            "opportunity_count": count,
        }
        for skill, count
        in skill_frequency.most_common()
        if skill not in FACULTY["expertise"]
    ][:5]

    priority_student_gaps = [
        item
        for item in student_intelligence
        if item["development_need"]
        in {
            "High",
            "Medium",
        }
    ][:5]

    return {
        "faculty": FACULTY["name"],

        "expertise_alignment": (
            expertise_intelligence
        ),

        "emerging_industry_skills": (
            emerging_skills
        ),

        "student_competency_gaps": (
            priority_student_gaps
        ),

        "recommended_focus": (
            emerging_skills[0]["skill"]
            if emerging_skills
            else "Healthcare Data Analysis"
        ),

        "industry_opportunities_tracked": (
            len(opportunities)
        ),

        "students_assessed": len(
            assessment_results
        ),
    }