from fastapi import APIRouter

from app.api.students import assessment_results

router = APIRouter(prefix="/skills", tags=["Skills"])


BASE_SKILLS = [
    {
        "name": "Research Methodology",
        "category": "Research",
        "level": "Advanced",
        "score": 88,
    },
    {
        "name": "Clinical Research",
        "category": "Research",
        "level": "Advanced",
        "score": 84,
    },
    {
        "name": "Literature Review",
        "category": "Research",
        "level": "Advanced",
        "score": 82,
    },
    {
        "name": "Scientific Writing",
        "category": "Research",
        "level": "Intermediate",
        "score": 76,
    },
    {
        "name": "Biostatistics",
        "category": "Data",
        "level": "Beginner",
        "score": 48,
    },
    {
        "name": "Clinical Data Management",
        "category": "Data",
        "level": "Beginner",
        "score": 42,
    },
]


LEARNING_RESOURCES = {
    "Biostatistics": [
        {
            "title": "Biostatistics Fundamentals",
            "type": "Course",
            "provider": "AyushBridge Learning Hub",
            "duration": "6 weeks",
            "level": "Beginner",
            "focus": "Descriptive statistics, probability, hypothesis testing and clinical data interpretation.",
        },
        {
            "title": "Statistics for Clinical Research",
            "type": "Learning Program",
            "provider": "Research Skills Academy",
            "duration": "4 weeks",
            "level": "Beginner",
            "focus": "Statistical methods used in clinical research and evidence-based healthcare.",
        },
    ],
    "Clinical Data Management": [
        {
            "title": "Clinical Data Management Essentials",
            "type": "Course",
            "provider": "AyushBridge Learning Hub",
            "duration": "5 weeks",
            "level": "Beginner",
            "focus": "Clinical datasets, data quality, documentation and data validation.",
        },
        {
            "title": "Healthcare Data Operations",
            "type": "Learning Program",
            "provider": "Digital Health Academy",
            "duration": "6 weeks",
            "level": "Beginner",
            "focus": "Patient data workflows, data standards and healthcare information management.",
        },
    ],
    "Research Methodology": [
        {
            "title": "Advanced Research Methodology",
            "type": "Course",
            "provider": "AyushBridge Learning Hub",
            "duration": "5 weeks",
            "level": "Intermediate",
            "focus": "Research design, study protocols, sampling and evidence generation.",
        },
    ],
    "Scientific Writing": [
        {
            "title": "Scientific Writing for Researchers",
            "type": "Course",
            "provider": "AyushBridge Learning Hub",
            "duration": "4 weeks",
            "level": "Intermediate",
            "focus": "Research papers, abstracts, reports and scientific communication.",
        },
    ],
}


def get_skill_level(score: int) -> str:
    if score >= 80:
        return "Advanced"

    if score >= 60:
        return "Intermediate"

    return "Beginner"


def get_current_skills(student_id: int = 1):
    skills = [skill.copy() for skill in BASE_SKILLS]

    latest_assessment = assessment_results.get(student_id)

    if latest_assessment:
        assessment_scores = {
            item["competency"]: item["score"]
            for item in latest_assessment.get("competencies", [])
        }

        for skill in skills:
            competency = skill["name"]

            if competency in assessment_scores:
                score = assessment_scores[competency]

                skill["score"] = score
                skill["level"] = get_skill_level(score)

    return skills


@router.get("/")
def get_skills():
    return get_current_skills(1)


@router.get("/learning")
def get_learning_recommendations(student_id: int = 1):
    skills = get_current_skills(student_id)

    gaps = [
        skill
        for skill in skills
        if skill["score"] < 60
    ]

    recommendations = []

    for gap in gaps:
        resources = LEARNING_RESOURCES.get(gap["name"], [])

        for resource in resources:
            recommendations.append(
                {
                    "skill": gap["name"],
                    "current_score": gap["score"],
                    "priority": (
                        "High"
                        if gap["score"] < 50
                        else "Medium"
                    ),
                    "reason": (
                        f"Your current {gap['name']} score is "
                        f"{gap['score']}%. Improving this competency "
                        "can increase your readiness for matched opportunities."
                    ),
                    **resource,
                }
            )

    return {
        "student_id": student_id,
        "gap_count": len(gaps),
        "skill_gaps": [
            {
                "name": gap["name"],
                "score": gap["score"],
                "level": gap["level"],
            }
            for gap in gaps
        ],
        "recommendations": recommendations,
    }