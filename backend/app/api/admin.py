from datetime import datetime, timezone

from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.api.opportunities import get_opportunities
from app.api.skills import BASE_SKILLS
from app.db.session import SessionLocal
from app.models.user import PortfolioEvidence, User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def now_iso():
    return datetime.now(
        timezone.utc
    ).isoformat()


def get_users():
    db: Session = SessionLocal()

    try:
        return (
            db.query(User)
            .order_by(User.id.asc())
            .all()
        )

    finally:
        db.close()


def get_evidence():
    db: Session = SessionLocal()

    try:
        return (
            db.query(PortfolioEvidence)
            .order_by(
                PortfolioEvidence.id.desc()
            )
            .all()
        )

    finally:
        db.close()


# ---------------------------------------------------------
# Admin dashboard
# ---------------------------------------------------------

@router.get("/dashboard")
def get_admin_dashboard():

    users = get_users()
    opportunities = get_opportunities()
    evidence = get_evidence()

    total_users = len(users)

    students_count = sum(
        1
        for user in users
        if user.role.lower() == "student"
    )

    faculty_count = sum(
        1
        for user in users
        if user.role.lower() == "faculty"
    )

    industry_count = sum(
        1
        for user in users
        if user.role.lower() == "industry"
    )

    institution_count = sum(
        1
        for user in users
        if user.role.lower() == "institution"
    )

    pending_evidence = sum(
        1
        for item in evidence
        if item.verification_status.lower()
        == "pending"
    )

    verified_evidence = sum(
        1
        for item in evidence
        if item.verification_status.lower()
        == "verified"
    )

    rejected_evidence = sum(
        1
        for item in evidence
        if item.verification_status.lower()
        == "rejected"
    )

    pending_opportunities = sum(
        1
        for opportunity in opportunities
        if str(
            opportunity.get(
                "status",
                "",
            )
        ).lower()
        in {
            "pending",
            "pending review",
            "pending verification",
        }
    )

    active_opportunities = len(
        opportunities
    )

    pending_verifications = (
        pending_evidence
        + pending_opportunities
    )

    recent_activity = []

    for item in evidence[:3]:
        recent_activity.append(
            {
                "action": (
                    "Student evidence submitted"
                ),
                "entity": item.title,
                "actor": (
                    f"Student {item.student_id}"
                ),
                "status": item.verification_status,
            }
        )

    for opportunity in opportunities[:3]:
        recent_activity.append(
            {
                "action": (
                    "Opportunity submitted"
                ),
                "entity": opportunity.get(
                    "title",
                    "Opportunity",
                ),
                "actor": opportunity.get(
                    "created_by",
                    "Industry Partner",
                ),
                "status": opportunity.get(
                    "status",
                    "Published",
                ),
            }
        )

    recent_activity = recent_activity[:6]

    if pending_verifications > 10:

        insight_title = (
            "Verification workload requires attention"
        )

        insight_description = (
            f"There are currently "
            f"{pending_verifications} items "
            "awaiting verification across "
            "student evidence and opportunities."
        )

        recommendation = (
            "Prioritize high-value evidence and "
            "opportunity verification to maintain "
            "trusted matching results."
        )

    else:

        insight_title = (
            "Verification workload is manageable"
        )

        insight_description = (
            f"The platform currently has "
            f"{pending_verifications} pending "
            "verification items."
        )

        recommendation = (
            "Continue regular evidence and "
            "opportunity verification to maintain "
            "platform trust."
        )

    return {
        "total_users": total_users,
        "students": students_count,
        "faculty": faculty_count,
        "industry_partners": industry_count,
        "institutions": institution_count,
        "pending_verifications": (
            pending_verifications
        ),
        "active_opportunities": (
            active_opportunities
        ),
        "flagged_opportunities": 0,
        "skill_taxonomy": len(
            BASE_SKILLS
        ),
        "verified_evidence": verified_evidence,
        "rejected_evidence": rejected_evidence,
        "pending_evidence": pending_evidence,
        "recent_activity": recent_activity,
        "ai_insight": {
            "title": insight_title,
            "description": (
                insight_description
            ),
            "recommendation": recommendation,
        },
    }


# ---------------------------------------------------------
# Users
# ---------------------------------------------------------

@router.get("/users")
def get_admin_users():

    users = get_users()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.title(),
            "status": user.status.title(),
            "verification": (
                "Verified"
                if user.status.lower()
                == "active"
                else "Pending"
            ),
        }
        for user in users
    ]


# ---------------------------------------------------------
# Opportunities
# ---------------------------------------------------------

@router.get("/opportunities")
def get_admin_opportunities():

    opportunities = get_opportunities()

    results = []

    for opportunity in opportunities:

        status = opportunity.get(
            "status",
            "Published",
        )

        status_lower = str(
            status
        ).lower()

        if status_lower in {
            "pending",
            "pending review",
            "pending verification",
        }:

            verification = "Pending"

        elif status_lower == "flagged":

            verification = "Needs Review"

        else:

            verification = "Verified"

        results.append(
            {
                "id": opportunity.get(
                    "id",
                    0,
                ),
                "title": opportunity.get(
                    "title",
                    "Opportunity",
                ),
                "organization": opportunity.get(
                    "organization",
                    opportunity.get(
                        "created_by",
                        "Industry Partner",
                    ),
                ),
                "type": opportunity.get(
                    "type",
                    opportunity.get(
                        "opportunity_type",
                        "Opportunity",
                    ),
                ),
                "status": status,
                "verification": verification,
                "applications": opportunity.get(
                    "applications",
                    0,
                ),
            }
        )

    return results


# ---------------------------------------------------------
# Skills
# ---------------------------------------------------------

@router.get("/skills")
def get_admin_skills():

    return [
        {
            "id": index + 1,
            "name": skill["name"],
            "category": skill.get(
                "category",
                "General",
            ),
            "competency": skill.get(
                "competency",
                skill["name"],
            ),
            "status": "Published",
            "usage": skill.get(
                "usage",
                0,
            ),
        }
        for index, skill in enumerate(
            BASE_SKILLS
        )
    ]


# ---------------------------------------------------------
# Verification queue
# ---------------------------------------------------------

@router.get("/verification")
def get_admin_verification():

    evidence = get_evidence()
    opportunities = get_opportunities()

    verification_items = []

    # Student evidence

    for item in evidence:

        if (
            item.verification_status.lower()
            != "pending"
        ):
            continue

        priority = (
            "High"
            if item.evidence_level
            in {
                "Certificate",
                "Project",
                "Industry Verified",
            }
            else "Medium"
        )

        verification_items.append(
            {
                "id": item.id,
                "type": "Student Evidence",
                "item": item.title,
                "skill": item.skill,
                "submitted_by": (
                    f"Student {item.student_id}"
                ),
                "status": "Pending",
                "priority": priority,
            }
        )

    # Opportunities

    for opportunity in opportunities:

        status = str(
            opportunity.get(
                "status",
                "",
            )
        ).lower()

        if status not in {
            "pending",
            "pending review",
            "pending verification",
        }:
            continue

        verification_items.append(
            {
                "id": opportunity.get(
                    "id",
                    0,
                ),
                "type": "Opportunity",
                "item": opportunity.get(
                    "title",
                    "Opportunity",
                ),
                "submitted_by": opportunity.get(
                    "created_by",
                    "Industry Partner",
                ),
                "status": "Pending",
                "priority": "High",
            }
        )

    return verification_items


# ---------------------------------------------------------
# Admin verify evidence
# ---------------------------------------------------------

@router.post("/verification/{evidence_id}/approve")
def approve_evidence(
    evidence_id: int,
    payload: dict,
):

    verifier = payload.get(
        "verified_by",
        "Admin",
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
            "Institution Verified"
        )

        db.commit()
        db.refresh(evidence)

        return {
            "success": True,
            "message": (
                "Evidence approved successfully."
            ),
            "approved_at": now_iso(),
            "evidence": {
                "id": evidence.id,
                "student_id": evidence.student_id,
                "title": evidence.title,
                "skill": evidence.skill,
                "verification_status": (
                    evidence.verification_status
                ),
                "verified_by": (
                    evidence.verified_by
                ),
                "evidence_level": (
                    evidence.evidence_level
                ),
            },
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Admin reject evidence
# ---------------------------------------------------------

@router.post("/verification/{evidence_id}/reject")
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
        "Evidence requires additional verification.",
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

        original_description = (
            evidence.description or ""
        )

        if (
            "Verification rejection reason:"
            not in original_description
        ):

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
            "evidence": {
                "id": evidence.id,
                "student_id": evidence.student_id,
                "title": evidence.title,
                "skill": evidence.skill,
                "verification_status": (
                    evidence.verification_status
                ),
                "verified_by": (
                    evidence.verified_by
                ),
                "evidence_level": (
                    evidence.evidence_level
                ),
            },
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Verification statistics
# ---------------------------------------------------------

@router.get("/verification/statistics")
def get_admin_verification_statistics():

    evidence = get_evidence()

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
        "total": total,
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