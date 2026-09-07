from fastapi import APIRouter

router = APIRouter(
    prefix="/industry/shortlist",
    tags=["Industry Shortlisting"],
)


@router.post("/{candidate_id}")
def shortlist_candidate(candidate_id: int):
    return {
        "success": True,
        "candidate_id": candidate_id,
        "status": "Shortlisted",
        "message": "Candidate has been shortlisted successfully.",
        "next_stage": "Industry Review",
    }