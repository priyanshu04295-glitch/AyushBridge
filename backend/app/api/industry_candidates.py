from fastapi import APIRouter

router = APIRouter(
    prefix="/industry/candidates",
    tags=["Industry Candidates"],
)


@router.get("/")
def get_candidates():
    return [
        {
            "id": 1,
            "name": "Aarav Sharma",
            "program": "BAMS",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Clinical Research Intern",
            "match_score": 92,
            "verified_skills": 4,
            "skill_gap": "Biostatistics",
            "verification": "Institution + Mentor Verified",
            "status": "Available",
        },
        {
            "id": 2,
            "name": "Ananya Patel",
            "program": "BAMS",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Research Assistant",
            "match_score": 88,
            "verified_skills": 5,
            "skill_gap": "Clinical Data Management",
            "verification": "Assessment Verified",
            "status": "Available",
        },
        {
            "id": 3,
            "name": "Riya Menon",
            "program": "MSc Clinical Research",
            "institution": "AIIA",
            "target_role": "Clinical Research Intern",
            "match_score": 84,
            "verified_skills": 6,
            "skill_gap": "Scientific Writing",
            "verification": "Mentor Verified",
            "status": "Available",
        },
        {
            "id": 4,
            "name": "Kabir Singh",
            "program": "BAMS",
            "institution": "AIIA",
            "target_role": "Healthcare Data Analyst",
            "match_score": 79,
            "verified_skills": 5,
            "skill_gap": "Healthcare Analytics",
            "verification": "Certificate Verified",
            "status": "Available",
        },
    ]


@router.get("/{candidate_id}")
def get_candidate(candidate_id: int):
    candidates = {
        1: {
            "id": 1,
            "name": "Aarav Sharma",
            "program": "BAMS",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Clinical Research Intern",
            "match_score": 92,
            "readiness_score": 82,
            "verified_skills": 4,
            "projects": 3,
            "certifications": 5,
            "skills": [
                {
                    "name": "Research Methodology",
                    "score": 88,
                    "level": "Advanced",
                    "verification": "Institution Verified",
                },
                {
                    "name": "Clinical Research",
                    "score": 84,
                    "level": "Advanced",
                    "verification": "Mentor Verified",
                },
                {
                    "name": "Literature Review",
                    "score": 82,
                    "level": "Advanced",
                    "verification": "Assessment Verified",
                },
                {
                    "name": "Scientific Writing",
                    "score": 76,
                    "level": "Intermediate",
                    "verification": "Certificate Verified",
                },
            ],
            "skill_gaps": [
                "Biostatistics",
                "Clinical Data Management",
            ],
            "evidence": [
                "Institution verified academic profile",
                "Mentor verified clinical research project",
                "Assessment verified research skills",
                "Certificate verified scientific writing",
            ],
            "match_explanation": (
                "Strong alignment with Clinical Research and Research "
                "Methodology requirements. The main development areas are "
                "Biostatistics and Clinical Data Management."
            ),
        },
        2: {
            "id": 2,
            "name": "Ananya Patel",
            "program": "BAMS",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Research Assistant",
            "match_score": 88,
            "readiness_score": 79,
            "verified_skills": 5,
            "projects": 2,
            "certifications": 4,
            "skills": [
                {
                    "name": "Research Methodology",
                    "score": 86,
                    "level": "Advanced",
                    "verification": "Assessment Verified",
                },
                {
                    "name": "Literature Review",
                    "score": 84,
                    "level": "Advanced",
                    "verification": "Certificate Verified",
                },
                {
                    "name": "Scientific Writing",
                    "score": 81,
                    "level": "Advanced",
                    "verification": "Mentor Verified",
                },
            ],
            "skill_gaps": [
                "Clinical Data Management",
            ],
            "evidence": [
                "Assessment verified research skills",
                "Mentor verified academic project",
                "Certificate verified scientific writing",
            ],
            "match_explanation": (
                "Strong research foundation with good alignment to "
                "Research Assistant requirements."
            ),
        },
        3: {
            "id": 3,
            "name": "Riya Menon",
            "program": "MSc Clinical Research",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Clinical Research Intern",
            "match_score": 84,
            "readiness_score": 81,
            "skills": [
                {
                    "name": "Clinical Research",
                    "score": 86,
                    "level": "Advanced",
                    "verification": "Mentor Verified",
                },
                {
                    "name": "Scientific Writing",
                    "score": 78,
                    "level": "Intermediate",
                    "verification": "Assessment Verified",
                },
            ],
        },
        4: {
            "id": 4,
            "name": "Kabir Singh",
            "program": "BAMS",
            "institution": "All India Institute of Ayurveda",
            "target_role": "Healthcare Data Analyst",
            "match_score": 79,
            "readiness_score": 76,
            "skills": [
                {
                    "name": "Healthcare Data Analysis",
                    "score": 80,
                    "level": "Advanced",
                    "verification": "Certificate Verified",
                },
                {
                    "name": "Clinical Data Management",
                    "score": 72,
                    "level": "Intermediate",
                    "verification": "Assessment Verified",
                },
            ],
        },
    }

    return candidates.get(
        candidate_id,
        {
            "id": candidate_id,
            "name": "Candidate",
            "message": "Candidate profile not found",
        },
    )
