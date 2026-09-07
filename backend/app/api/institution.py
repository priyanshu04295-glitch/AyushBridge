from collections import defaultdict

from fastapi import APIRouter

from app.api.opportunities import get_opportunities
from app.api.skills import BASE_SKILLS
from app.api.students import (
    assessment_results,
    students,
)

router = APIRouter(
    prefix="/institution",
    tags=["Institution"],
)

INSTITUTION_NAME = "All India Institute of Ayurveda"

STUDENTS_ASSESSED_BASELINE = 1248
PROFILE_COMPLETION = 82
INDUSTRY_PARTNERSHIPS = 38
NEW_PARTNERSHIPS = 7

DEMAND_SCORES = {
    "Clinical Research": 92,
    "Research Methodology": 88,
    "Biostatistics": 81,
    "Scientific Writing": 74,
    "Clinical Data Management": 75,
    "Literature Review": 62,
    "Healthcare Data Analysis": 69,
    "Ayurveda Pharmacology": 67,
    "Quality Control": 64,
    "Data Analysis": 72,
}


def calculate_real_student_competencies():
    """
    Aggregate actual submitted student assessments.

    Only competencies that students have actually
    been assessed on are treated as measured readiness.
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

    if not competency_stats:
        return {
            skill["name"]: skill["score"]
            for skill in BASE_SKILLS
        }

    return {
        skill: round(
            stats["score_total"]
            / stats["attempts"]
        )
        for skill, stats in competency_stats.items()
    }


def calculate_assessed_student_count():
    """
    Count students who have actually submitted
    an assessment.
    """

    return len(assessment_results)


def calculate_student_population():
    """
    Keep the institutional prototype baseline while
    allowing the actual student registry to contribute.
    """

    if students:
        return max(
            len(students),
            STUDENTS_ASSESSED_BASELINE,
        )

    return STUDENTS_ASSESSED_BASELINE


def calculate_skill_intelligence():
    """
    Combine:
        Student Assessment
        +
        Industry Demand
        +
        Opportunity Frequency

    into institutional competency intelligence.
    """

    student_competencies = (
        calculate_real_student_competencies()
    )

    opportunities = get_opportunities()

    opportunity_counts = defaultdict(int)

    for opportunity in opportunities:
        for skill in opportunity.get(
            "skills",
            [],
        ):
            opportunity_counts[skill] += 1

    all_skills = set(
        student_competencies.keys()
    )

    all_skills.update(
        opportunity_counts.keys()
    )

    all_skills.update(
        DEMAND_SCORES.keys()
    )

    intelligence = []

    has_real_assessments = bool(
        assessment_results
    )

    for skill in all_skills:

        if (
            has_real_assessments
            and skill not in student_competencies
        ):
            # Do not treat an unassessed competency
            # as 0% readiness.
            continue

        student_readiness = (
            student_competencies.get(
                skill,
                0,
            )
        )

        industry_demand = DEMAND_SCORES.get(
            skill,
            50,
        )

        skill_gap = max(
            0,
            industry_demand
            - student_readiness,
        )

        if skill_gap >= 30:
            priority = "High"
            action = (
                "Launch targeted training"
            )
        elif skill_gap >= 15:
            priority = "Medium"
            action = (
                "Add practical workshop"
            )
        else:
            priority = "Low"
            action = (
                "Monitor competency trend"
            )

        intelligence.append(
            {
                "skill": skill,
                "student_readiness": (
                    student_readiness
                ),
                "industry_demand": (
                    industry_demand
                ),
                "skill_gap": skill_gap,
                "opportunity_count": (
                    opportunity_counts.get(
                        skill,
                        0,
                    )
                ),
                "priority": priority,
                "recommended_action": action,
            }
        )

    intelligence.sort(
        key=lambda item: (
            item["skill_gap"],
            item["industry_demand"],
        ),
        reverse=True,
    )

    return intelligence


def get_opportunity_statistics():
    opportunities = get_opportunities()

    total = len(opportunities)

    active = sum(
        1
        for opportunity in opportunities
        if str(
            opportunity.get(
                "status",
                "",
            )
        ).lower()
        in {
            "active",
            "open",
            "published",
            "approved",
        }
    )

    if active == 0:
        active = total

    return {
        "total": total,
        "active": active,
    }


def get_training_needs(intelligence):
    training_needs = []

    population = calculate_student_population()

    for item in intelligence:

        if item["skill_gap"] < 15:
            continue

        estimated_students = round(
            population
            * item["skill_gap"]
            / 100
            * 0.08
        )

        if estimated_students < 10:
            estimated_students = 10

        training_needs.append(
            {
                "title": item["skill"],
                "students": estimated_students,
                "priority": item["priority"],
                "action": item[
                    "recommended_action"
                ],
            }
        )

        if len(training_needs) == 3:
            break

    return training_needs


@router.get("/dashboard")
def get_institution_dashboard():

    intelligence = (
        calculate_skill_intelligence()
    )

    opportunities = (
        get_opportunity_statistics()
    )

    high_priority = [
        item
        for item in intelligence
        if item["priority"] == "High"
    ]

    training_needs = get_training_needs(
        intelligence
    )

    top_gap = (
        intelligence[0]
        if intelligence
        else None
    )

    population = (
        calculate_student_population()
    )

    assessed_students = (
        calculate_assessed_student_count()
    )

    potential_students = sum(
        item["students"]
        for item in training_needs
    )

    if top_gap:

        ai_title = (
            f"{top_gap['skill']} is the largest "
            "identified competency gap."
        )

        ai_description = (
            f"Student competency intelligence "
            f"shows {top_gap['student_readiness']}% "
            f"readiness against "
            f"{top_gap['industry_demand']}% "
            f"estimated industry demand."
        )

        ai_recommendation = (
            f"{top_gap['recommended_action']} "
            f"for {top_gap['skill']} and connect "
            "the resulting skills to relevant "
            "industry opportunities."
        )

    else:

        ai_title = (
            "No major competency gaps detected."
        )

        ai_description = (
            "Current competency levels are broadly "
            "aligned with tracked industry demand."
        )

        ai_recommendation = (
            "Continue monitoring competency and "
            "industry-demand trends."
        )

    return {
        "institution": INSTITUTION_NAME,

        "students_assessed": population,

        "actual_assessed_students": (
            assessed_students
        ),

        "profile_completion": (
            PROFILE_COMPLETION
        ),

        "industry_partnerships": (
            INDUSTRY_PARTNERSHIPS
        ),

        "new_partnerships": (
            NEW_PARTNERSHIPS
        ),

        "internship_opportunities": (
            opportunities["total"]
        ),

        "active_internships": (
            opportunities["active"]
        ),

        "critical_skill_gaps": len(
            [
                item
                for item in intelligence
                if item["skill_gap"] > 0
            ]
        ),

        "critical_gaps_immediate_action": len(
            high_priority
        ),

        "skill_demand": [
            {
                "skill": item["skill"],
                "students": item[
                    "student_readiness"
                ],
                "demand": item[
                    "industry_demand"
                ],
            }
            for item in intelligence[:6]
        ],

        "training_needs": training_needs,

        "ai_insight": {
            "title": ai_title,
            "description": ai_description,
            "recommendation": (
                ai_recommendation
            ),
            "potential_students": (
                potential_students
            ),
        },
    }


@router.get("/analytics")
def get_institution_analytics():

    intelligence = (
        calculate_skill_intelligence()
    )

    skill_gap_trend = [
        {
            "skill": item["skill"],
            "gap": item["skill_gap"],
        }
        for item in intelligence[:8]
        if item["skill_gap"] > 0
    ]

    industry_demand = [
        {
            "skill": item["skill"],
            "demand": item[
                "industry_demand"
            ],
        }
        for item in sorted(
            intelligence,
            key=lambda item: item[
                "industry_demand"
            ],
            reverse=True,
        )[:8]
    ]

    high_gap_count = len(
        [
            item
            for item in intelligence
            if item["skill_gap"] >= 30
        ]
    )

    medium_gap_count = len(
        [
            item
            for item in intelligence
            if 15 <= item["skill_gap"] < 30
        ]
    )

    low_gap_count = len(
        [
            item
            for item in intelligence
            if item["skill_gap"] < 15
        ]
    )

    total_categories = (
        high_gap_count
        + medium_gap_count
        + low_gap_count
    )

    if total_categories:

        needs_intervention = round(
            (
                high_gap_count
                / total_categories
            )
            * 100
        )

        developing = round(
            (
                medium_gap_count
                / total_categories
            )
            * 100
        )

        ready = 100 - (
            needs_intervention
            + developing
        )

    else:

        ready = 0
        developing = 0
        needs_intervention = 0

    training_impact = []

    population = (
        calculate_student_population()
    )

    for item in intelligence:

        if item["skill_gap"] < 15:
            continue

        estimated_students = round(
            population
            * item["skill_gap"]
            / 100
            * 0.08
        )

        if estimated_students < 10:
            estimated_students = 10

        training_impact.append(
            {
                "program": item["skill"],
                "students": estimated_students,
            }
        )

        if len(training_impact) == 5:
            break

    top_gap = (
        intelligence[0]
        if intelligence
        else None
    )

    if top_gap:

        ai_insight = (
            f"Institutional competency "
            f"intelligence identifies "
            f"{top_gap['skill']} as the "
            f"highest-priority development "
            f"area, with a "
            f"{top_gap['skill_gap']}% gap "
            f"between student readiness and "
            f"estimated industry demand."
        )

    else:

        ai_insight = (
            "Institutional competency data "
            "currently shows no significant "
            "development gaps."
        )

    return {
        "skill_gap_trend": (
            skill_gap_trend
        ),

        "industry_demand": (
            industry_demand
        ),

        "placement_readiness": {
            "ready": ready,
            "developing": developing,
            "needs_intervention": (
                needs_intervention
            ),
        },

        "training_impact": (
            training_impact
        ),

        "ai_insight": ai_insight,

        "actual_assessed_students": (
            calculate_assessed_student_count()
        ),
    }


@router.get(
    "/skill-intelligence"
)
def get_skill_intelligence():

    intelligence = (
        calculate_skill_intelligence()
    )

    high_priority = [
        item
        for item in intelligence
        if item["priority"] == "High"
    ]

    top_gap = (
        intelligence[0]
        if intelligence
        else None
    )

    if top_gap:

        recommendation = (
            f"Prioritize "
            f"{top_gap['skill']} training. "
            f"Current student readiness is "
            f"{top_gap['student_readiness']}% "
            f"against estimated industry "
            f"demand of "
            f"{top_gap['industry_demand']}%."
        )

    else:

        recommendation = (
            "No significant competency "
            "gaps detected."
        )

    return {
        "institution": INSTITUTION_NAME,

        "students_analysed": (
            calculate_student_population()
        ),

        "actual_assessed_students": (
            calculate_assessed_student_count()
        ),

        "skills_analysed": len(
            intelligence
        ),

        "high_priority_gaps": len(
            high_priority
        ),

        "skill_intelligence": (
            intelligence
        ),

        "top_gap": top_gap,

        "institutional_recommendation": (
            recommendation
        ),
    }