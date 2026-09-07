from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.api.students import assessment_results
from app.api.skills import BASE_SKILLS
from app.db.session import SessionLocal
from app.models.user import PortfolioEvidence

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"],
)


# ---------------------------------------------------------
# Student competency profile
# ---------------------------------------------------------

def get_student_skills(student_id: int = 1):
    """
    Build the student's current competency profile.

    Assessment scores override the baseline skill scores.
    """

    skills = [
        skill.copy()
        for skill in BASE_SKILLS
    ]

    latest_assessment = assessment_results.get(
        student_id
    )

    if latest_assessment:

        assessment_scores = {
            item["competency"]: item["score"]
            for item in latest_assessment.get(
                "competencies",
                [],
            )
        }

        for skill in skills:

            if skill["name"] in assessment_scores:

                skill["score"] = assessment_scores[
                    skill["name"]
                ]

    return {
        skill["name"]: skill["score"]
        for skill in skills
    }


# ---------------------------------------------------------
# Student evidence intelligence
# ---------------------------------------------------------

def get_student_evidence(student_id: int = 1):

    db: Session = SessionLocal()

    try:

        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.student_id
                == student_id
            )
            .all()
        )

        evidence_map = {}

        for item in evidence:

            current_level = evidence_map.get(
                item.skill,
                0,
            )

            if item.evidence_level == "Industry Verified":

                evidence_score = 100

            elif item.verification_status == "Verified":

                evidence_score = 90

            elif item.evidence_level == "Self Declared":

                evidence_score = 50

            else:

                evidence_score = 25

            evidence_map[item.skill] = max(
                current_level,
                evidence_score,
            )

        return evidence_map

    finally:
        db.close()


# ---------------------------------------------------------
# Individual skill calculation
# ---------------------------------------------------------

def calculate_skill_match(
    skill: str,
    student_score: int,
    evidence_score: int,
):
    """
    Calculate an explainable competency score.

    70% = demonstrated competency
    20% = evidence strength
    10% = readiness confidence
    """

    competency_component = (
        student_score * 0.70
    )

    evidence_component = (
        evidence_score * 0.20
    )

    readiness_component = (
        min(student_score, evidence_score)
        * 0.10
    )

    final_score = round(
        competency_component
        + evidence_component
        + readiness_component
    )

    if final_score >= 80:

        strength = "Strong"

    elif final_score >= 60:

        strength = "Moderate"

    else:

        strength = "Gap"

    return {
        "skill": skill,
        "student_score": student_score,
        "evidence_score": evidence_score,
        "competency_component": round(
            competency_component
        ),
        "evidence_component": round(
            evidence_component
        ),
        "readiness_component": round(
            readiness_component
        ),
        "final_score": final_score,
        "strength": strength,
    }


# ---------------------------------------------------------
# Complete opportunity matching engine
# ---------------------------------------------------------

def calculate_match(
    required_skills,
    student_skills,
    student_evidence,
):
    """
    Calculate an explainable opportunity match.
    """

    skill_analysis = []

    matched_skills = []

    skill_gaps = []

    verified_evidence = []

    for skill in required_skills:

        student_score = student_skills.get(
            skill,
            0,
        )

        evidence_score = student_evidence.get(
            skill,
            0,
        )

        analysis = calculate_skill_match(
            skill=skill,
            student_score=student_score,
            evidence_score=evidence_score,
        )

        skill_analysis.append(
            analysis
        )

        if analysis["final_score"] >= 60:

            matched_skills.append(skill)

        else:

            skill_gaps.append(skill)

        if evidence_score >= 90:

            verified_evidence.append(
                skill
            )

    if skill_analysis:

        competency_scores = [
            item["student_score"]
            for item in skill_analysis
        ]

        evidence_scores = [
            item["evidence_score"]
            for item in skill_analysis
        ]

        competency_match = round(
            sum(competency_scores)
            / len(competency_scores)
        )

        evidence_strength = round(
            sum(evidence_scores)
            / len(evidence_scores)
        )

    else:

        competency_match = 0

        evidence_strength = 0

    # -----------------------------------------------------
    # Eligibility
    # -----------------------------------------------------

    eligibility = 100

    if not required_skills:

        eligibility = 100

    elif len(matched_skills) == 0:

        eligibility = 40

    elif len(matched_skills) < len(required_skills):

        eligibility = 75

    else:

        eligibility = 100

    # -----------------------------------------------------
    # Final match score
    # -----------------------------------------------------

    match_score = round(
        (
            competency_match * 0.60
        )
        + (
            evidence_strength * 0.20
        )
        + (
            eligibility * 0.20
        )
    )

    # -----------------------------------------------------
    # Overall recommendation
    # -----------------------------------------------------

    if match_score >= 85:

        recommendation = (
            "Excellent fit. "
            "The student demonstrates strong "
            "alignment with the opportunity."
        )

    elif match_score >= 70:

        recommendation = (
            "Good fit. "
            "The student can strengthen the "
            "identified skill gaps before or "
            "during the opportunity."
        )

    elif match_score >= 50:

        recommendation = (
            "Developing fit. "
            "Targeted learning is recommended "
            "before applying."
        )

    else:

        recommendation = (
            "Low current fit. "
            "Complete the identified learning "
            "requirements before applying."
        )

    # -----------------------------------------------------
    # Priority gap
    # -----------------------------------------------------

    priority_gap = None

    if skill_analysis:

        gaps = [
            item
            for item in skill_analysis
            if item["final_score"] < 60
        ]

        if gaps:

            priority_gap = min(
                gaps,
                key=lambda item: item["final_score"],
            )

    return {
        "match_score": match_score,
        "competency_match": competency_match,
        "evidence_strength": evidence_strength,
        "eligibility": eligibility,
        "matched_skills": matched_skills,
        "skill_gaps": skill_gaps,
        "priority_gap": (
            priority_gap["skill"]
            if priority_gap
            else None
        ),
        "skill_analysis": skill_analysis,
        "verified_evidence": verified_evidence,
        "recommendation": recommendation,
    }


# ---------------------------------------------------------
# Opportunity catalogue
# ---------------------------------------------------------

def get_opportunity_catalogue():

    return [

        {
            "id": 1,
            "title": "Clinical Research Intern",
            "organization": "Ayurveda Research Institute",
            "type": "Internship",
            "mode": "Hybrid",
            "duration": "6 months",
            "skills": [
                "Research Methodology",
                "Clinical Research",
                "Scientific Writing",
                "Biostatistics",
            ],
        },

        {
            "id": 2,
            "title": "Ayurveda Research Assistant",
            "organization": "Herbal Research Labs",
            "type": "Project",
            "mode": "On-site",
            "duration": "4 months",
            "skills": [
                "Research Methodology",
                "Literature Review",
                "Scientific Writing",
                "Clinical Data Management",
            ],
        },

        {
            "id": 3,
            "title": "Healthcare Data Analyst Intern",
            "organization": "Digital Health Solutions",
            "type": "Internship",
            "mode": "Remote",
            "duration": "3 months",
            "skills": [
                "Biostatistics",
                "Clinical Data Management",
                "Research Methodology",
            ],
        },
    ]


# ---------------------------------------------------------
# Opportunity listing with intelligence
# ---------------------------------------------------------

@router.get("/")
def get_opportunities():

    student_id = 1

    student_skills = get_student_skills(
        student_id
    )

    student_evidence = get_student_evidence(
        student_id
    )

    opportunities = (
        get_opportunity_catalogue()
    )

    results = []

    for opportunity in opportunities:

        matching = calculate_match(
            required_skills=opportunity["skills"],
            student_skills=student_skills,
            student_evidence=student_evidence,
        )

        results.append(
            {
                **opportunity,

                "match_score":
                    matching["match_score"],

                "competency_match":
                    matching["competency_match"],

                "evidence_strength":
                    matching["evidence_strength"],

                "eligibility":
                    matching["eligibility"],

                "matched_skills":
                    matching["matched_skills"],

                "skill_gaps":
                    matching["skill_gaps"],

                "skill_gap":
                    matching["priority_gap"],

                "priority_gap":
                    matching["priority_gap"],

                "skill_analysis":
                    matching["skill_analysis"],

                "verified_evidence":
                    matching["verified_evidence"],

                "recommendation":
                    matching["recommendation"],

                "explanation": {

                    "method":
                        "60% competency + "
                        "20% evidence + "
                        "20% eligibility",

                    "competency_match":
                        matching[
                            "competency_match"
                        ],

                    "evidence_strength":
                        matching[
                            "evidence_strength"
                        ],

                    "eligibility":
                        matching[
                            "eligibility"
                        ],

                    "matched_skill_count":
                        len(
                            matching[
                                "matched_skills"
                            ]
                        ),

                    "skill_gap_count":
                        len(
                            matching[
                                "skill_gaps"
                            ]
                        ),

                    "verified_evidence_count":
                        len(
                            matching[
                                "verified_evidence"
                            ]
                        ),

                },
            }
        )

    # Highest-fit opportunities first.

    results.sort(
        key=lambda item:
            item["match_score"],
        reverse=True,
    )

    return results


# ---------------------------------------------------------
# Single opportunity intelligence
# ---------------------------------------------------------

@router.get("/{opportunity_id}")
def get_opportunity(
    opportunity_id: int,
):

    opportunities = (
        get_opportunity_catalogue()
    )

    opportunity = next(
        (
            item
            for item in opportunities
            if item["id"]
            == opportunity_id
        ),
        None,
    )

    if opportunity is None:

        return {
            "success": False,
            "message": "Opportunity not found.",
        }

    student_id = 1

    student_skills = get_student_skills(
        student_id
    )

    student_evidence = get_student_evidence(
        student_id
    )

    matching = calculate_match(
        required_skills=opportunity["skills"],
        student_skills=student_skills,
        student_evidence=student_evidence,
    )

    return {
        **opportunity,
        **matching,
        "student_id": student_id,
        "explanation": {
            "method":
                "60% competency + "
                "20% evidence + "
                "20% eligibility",

            "competency_match":
                matching[
                    "competency_match"
                ],

            "evidence_strength":
                matching[
                    "evidence_strength"
                ],

            "eligibility":
                matching[
                    "eligibility"
                ],
        },
    }