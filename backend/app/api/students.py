from collections import defaultdict

from fastapi import APIRouter

router = APIRouter(
    prefix="/students",
    tags=["Students"],
)


# Assessment results for the current SIH prototype.
# This can later be replaced by a database table.
assessment_results = {}


# Demo student records.
# Additional students can be added later through the database.
students = {
    1: {
        "student_id": 1,
        "name": "Aarav Sharma",
        "program": "BAMS",
        "target_role": "Clinical Research Intern",
    },
    2: {
        "student_id": 2,
        "name": "Demo Student",
        "program": "BAMS",
        "target_role": "Clinical Research Intern",
    },
}


@router.get("/")
def get_students():
    """
    Return all students currently known to the student intelligence layer.
    """

    results = []

    for student in students.values():
        student_id = student["student_id"]

        assessment = assessment_results.get(
            student_id
        )

        if assessment:
            readiness_score = assessment["score"]
            skills_assessed = assessment[
                "total_questions"
            ]
            skill_gaps = len(
                assessment["gaps"]
            )
        else:
            readiness_score = 0
            skills_assessed = 0
            skill_gaps = 0

        results.append(
            {
                **student,
                "readiness_score": readiness_score,
                "skills_assessed": skills_assessed,
                "skill_gaps": skill_gaps,
            }
        )

    return results


@router.get("/{student_id}")
def get_student(student_id: int):
    student = students.get(
        student_id,
        {
            "student_id": student_id,
            "name": "Aarav Sharma",
            "program": "BAMS",
            "target_role": "Clinical Research Intern",
        },
    )

    assessment = assessment_results.get(
        student_id
    )

    if assessment:
        readiness_score = assessment["score"]
        skills_assessed = assessment[
            "total_questions"
        ]
        skill_gaps = len(
            assessment["gaps"]
        )
    else:
        readiness_score = 0
        skills_assessed = 0
        skill_gaps = 0

    return {
        **student,
        "readiness_score": readiness_score,
        "skills_assessed": skills_assessed,
        "skill_gaps": skill_gaps,
    }


@router.post("/{student_id}/assessment")
def submit_assessment(
    student_id: int,
    payload: dict,
):
    correct_answers = {
        "Research Methodology": (
            "Randomized controlled trial"
        ),
        "Biostatistics": "Mean",
        "Clinical Research": (
            "Protect participant autonomy"
        ),
    }

    competencies = []
    correct_count = 0

    for answer in payload.get(
        "answers",
        [],
    ):
        competency = answer.get(
            "competency"
        )

        selected_answer = answer.get(
            "selected_answer"
        )

        correct_answer = correct_answers.get(
            competency
        )

        is_correct = (
            selected_answer == correct_answer
        )

        if is_correct:
            correct_count += 1

        competencies.append(
            {
                "competency": competency,
                "selected_answer": selected_answer,
                "correct_answer": correct_answer,
                "score": (
                    100
                    if is_correct
                    else 0
                ),
                "status": (
                    "Strong"
                    if is_correct
                    else "Needs Development"
                ),
            }
        )

    total_questions = len(
        payload.get("answers", [])
    )

    overall_score = (
        round(
            (
                correct_count
                / total_questions
            )
            * 100
        )
        if total_questions > 0
        else 0
    )

    gaps = [
        item["competency"]
        for item in competencies
        if item["status"]
        == "Needs Development"
    ]

    result = {
        "student_id": student_id,
        "score": overall_score,
        "total_questions": total_questions,
        "correct_answers": correct_count,
        "competencies": competencies,
        "gaps": gaps,
    }

    assessment_results[
        student_id
    ] = result

    # Automatically register a student if an
    # assessment is submitted for a new ID.
    if student_id not in students:
        students[student_id] = {
            "student_id": student_id,
            "name": f"Student {student_id}",
            "program": "BAMS",
            "target_role": (
                "Clinical Research Intern"
            ),
        }

    return result


@router.get(
    "/{student_id}/assessment/result"
)
def get_assessment_result(
    student_id: int,
):
    result = assessment_results.get(
        student_id
    )

    if result is None:
        return {
            "student_id": student_id,
            "score": 0,
            "total_questions": 0,
            "correct_answers": 0,
            "competencies": [],
            "gaps": [],
            "message": (
                "No assessment has been "
                "submitted yet."
            ),
        }

    return result


@router.get(
    "/intelligence/summary"
)
def get_student_intelligence_summary():
    """
    Institution-level student competency summary.

    This endpoint aggregates actual submitted assessments
    and exposes the data needed by the institution
    intelligence layer.
    """

    total_students = len(students)

    assessed_students = [
        student_id
        for student_id in students
        if student_id in assessment_results
    ]

    readiness_scores = [
        assessment_results[
            student_id
        ]["score"]
        for student_id in assessed_students
    ]

    total_assessed = len(
        assessed_students
    )

    average_readiness = (
        round(
            sum(readiness_scores)
            / total_assessed
        )
        if total_assessed
        else 0
    )

    competency_stats = defaultdict(
        lambda: {
            "attempts": 0,
            "strong": 0,
            "needs_development": 0,
            "score_total": 0,
        }
    )

    for assessment in assessment_results.values():
        for competency in assessment[
            "competencies"
        ]:
            name = competency[
                "competency"
            ]

            stats = competency_stats[
                name
            ]

            stats["attempts"] += 1
            stats["score_total"] += (
                competency["score"]
            )

            if competency["status"] == "Strong":
                stats["strong"] += 1
            else:
                stats[
                    "needs_development"
                ] += 1

    competencies = []

    for skill, stats in competency_stats.items():
        average_score = (
            round(
                stats["score_total"]
                / stats["attempts"]
            )
            if stats["attempts"]
            else 0
        )

        competencies.append(
            {
                "skill": skill,
                "students_assessed": stats[
                    "attempts"
                ],
                "average_score": average_score,
                "strong_count": stats[
                    "strong"
                ],
                "needs_development_count": stats[
                    "needs_development"
                ],
            }
        )

    competencies.sort(
        key=lambda item: (
            item[
                "needs_development_count"
            ],
            -item["average_score"],
        ),
        reverse=True,
    )

    return {
        "total_students": total_students,
        "students_assessed": total_assessed,
        "average_readiness": average_readiness,
        "competencies": competencies,
    }