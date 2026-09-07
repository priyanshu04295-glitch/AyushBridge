from datetime import datetime, timezone

from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import PortfolioEvidence

router = APIRouter(
    prefix="/industry/verification",
    tags=["Industry Verification"],
)


def now_iso():
    return datetime.now(
        timezone.utc
    ).isoformat()


def evidence_to_dict(
    evidence: PortfolioEvidence,
):
    return {
        "id": evidence.id,
        "student_id": evidence.student_id,
        "title": evidence.title,
        "evidence_type": evidence.evidence_type,
        "skill": evidence.skill,
        "description": evidence.description,
        "verification_status": (
            evidence.verification_status
        ),
        "verified_by": evidence.verified_by,
        "evidence_level": (
            evidence.evidence_level
        ),
    }


# ---------------------------------------------------------
# Platform-wide verification summary
# IMPORTANT: Keep this BEFORE /{student_id}
# ---------------------------------------------------------

@router.get("/summary/all")
def get_verification_summary():
    """
    Platform-wide evidence verification summary.
    """

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .all()
        )

        total = len(evidence)

        pending = sum(
            1
            for item in evidence
            if item.verification_status.lower()
            == "pending"
        )

        verified = sum(
            1
            for item in evidence
            if item.verification_status.lower()
            == "verified"
        )

        rejected = sum(
            1
            for item in evidence
            if item.verification_status.lower()
            == "rejected"
        )

        return {
            "total_evidence": total,
            "pending": pending,
            "verified": verified,
            "rejected": rejected,
            "verification_rate": (
                round(
                    verified / total * 100
                )
                if total
                else 0
            ),
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Candidate evidence
# ---------------------------------------------------------

@router.get("/{student_id}")
def get_candidate_evidence(
    student_id: int,
):
    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.student_id
                == student_id
            )
            .order_by(
                PortfolioEvidence.id.desc()
            )
            .all()
        )

        return [
            evidence_to_dict(item)
            for item in evidence
        ]

    finally:
        db.close()


# ---------------------------------------------------------
# Verify evidence
# ---------------------------------------------------------

@router.post("/{evidence_id}/verify")
def verify_evidence(
    evidence_id: int,
    payload: dict,
):
    verifier = payload.get(
        "verified_by",
        "Industry Partner",
    )

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.id
                == evidence_id
            )
            .first()
        )

        if evidence is None:
            return {
                "success": False,
                "message": (
                    "Evidence not found."
                ),
            }

        evidence.verification_status = (
            "Verified"
        )

        evidence.verified_by = verifier

        evidence.evidence_level = (
            "Industry Verified"
        )

        db.commit()
        db.refresh(evidence)

        return {
            "success": True,
            "message": (
                "Evidence verified successfully."
            ),
            "verified_at": now_iso(),
            "evidence": evidence_to_dict(
                evidence
            ),
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Reject evidence
# ---------------------------------------------------------

@router.post("/{evidence_id}/reject")
def reject_evidence(
    evidence_id: int,
    payload: dict,
):
    verifier = payload.get(
        "verified_by",
        "Admin",
    )

    reason = payload.get(
        "reason",
        "Evidence did not meet verification requirements.",
    )

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.id
                == evidence_id
            )
            .first()
        )

        if evidence is None:
            return {
                "success": False,
                "message": (
                    "Evidence not found."
                ),
            }

        evidence.verification_status = (
            "Rejected"
        )

        evidence.verified_by = verifier

        evidence.evidence_level = (
            "Rejected"
        )

        # Preserve the rejection reason
        # inside the existing description field
        # without changing the database schema.
        original_description = (
            evidence.description or ""
        )

        if "Verification rejection reason:" not in original_description:
            evidence.description = (
                f"{original_description}\n\n"
                f"Verification rejection reason: "
                f"{reason}"
            )

        db.commit()
        db.refresh(evidence)

        return {
            "success": True,
            "message": (
                "Evidence rejected successfully."
            ),
            "rejected_at": now_iso(),
            "reason": reason,
            "evidence": evidence_to_dict(
                evidence
            ),
        }

    finally:
        db.close()