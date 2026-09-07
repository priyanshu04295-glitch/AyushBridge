from datetime import datetime, timezone

from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.session import Base, SessionLocal, engine
from app.models.user import PortfolioEvidence
from sqlalchemy import Column, Integer, String, Text


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


# ---------------------------------------------------------
# Document metadata table
# ---------------------------------------------------------

class EvidenceDocument(Base):
    __tablename__ = "evidence_documents"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, nullable=False, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    file_name = Column(String, nullable=False)
    file_type = Column(String, default="Unknown")
    file_size = Column(Integer, default=0)
    document_status = Column(String, default="Submitted")
    uploaded_at = Column(String, nullable=False)


# ---------------------------------------------------------
# Audit log table
# ---------------------------------------------------------

class PortfolioAuditLog(Base):
    __tablename__ = "portfolio_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, nullable=False, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    action = Column(String, nullable=False)
    actor = Column(String, nullable=False)
    details = Column(Text, default="")
    created_at = Column(String, nullable=False)


# Create only new tables.
# Existing data and tables remain untouched.
Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def evidence_to_dict(evidence: PortfolioEvidence):
    return {
        "id": evidence.id,
        "student_id": evidence.student_id,
        "title": evidence.title,
        "evidence_type": evidence.evidence_type,
        "skill": evidence.skill,
        "description": evidence.description,
        "verification_status": evidence.verification_status,
        "verified_by": evidence.verified_by,
        "evidence_level": evidence.evidence_level,
    }


def document_to_dict(document: EvidenceDocument):
    return {
        "id": document.id,
        "evidence_id": document.evidence_id,
        "student_id": document.student_id,
        "file_name": document.file_name,
        "file_type": document.file_type,
        "file_size": document.file_size,
        "document_status": document.document_status,
        "uploaded_at": document.uploaded_at,
    }


def audit_to_dict(log: PortfolioAuditLog):
    return {
        "id": log.id,
        "evidence_id": log.evidence_id,
        "student_id": log.student_id,
        "action": log.action,
        "actor": log.actor,
        "details": log.details,
        "created_at": log.created_at,
    }


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def create_audit_log(
    db: Session,
    evidence_id: int,
    student_id: int,
    action: str,
    actor: str,
    details: str = "",
):
    log = PortfolioAuditLog(
        evidence_id=evidence_id,
        student_id=student_id,
        action=action,
        actor=actor,
        details=details,
        created_at=now_iso(),
    )

    db.add(log)


# ---------------------------------------------------------
# Get portfolio
# ---------------------------------------------------------

@router.get("/{student_id}")
def get_portfolio(student_id: int):

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.student_id == student_id
            )
            .order_by(PortfolioEvidence.id.desc())
            .all()
        )

        result = []

        for item in evidence:
            evidence_data = evidence_to_dict(item)

            documents = (
                db.query(EvidenceDocument)
                .filter(
                    EvidenceDocument.evidence_id == item.id
                )
                .order_by(EvidenceDocument.id.desc())
                .all()
            )

            evidence_data["documents"] = [
                document_to_dict(document)
                for document in documents
            ]

            result.append(evidence_data)

        return result

    finally:
        db.close()


# ---------------------------------------------------------
# Add portfolio evidence
# ---------------------------------------------------------

@router.post("/")
def add_portfolio_evidence(payload: dict):

    student_id = int(
        payload.get("student_id", 1)
    )

    title = payload.get("title")
    evidence_type = payload.get("evidence_type")
    skill = payload.get("skill")
    description = payload.get("description")

    if not title or not evidence_type or not skill or not description:
        return {
            "success": False,
            "message": (
                "Title, evidence type, skill and "
                "description are required."
            ),
        }

    db: Session = SessionLocal()

    try:
        evidence = PortfolioEvidence(
            student_id=student_id,
            title=title,
            evidence_type=evidence_type,
            skill=skill,
            description=description,
            verification_status="Pending",
            verified_by="",
            evidence_level="Self Declared",
        )

        db.add(evidence)
        db.flush()

        # Optional document metadata.
        file_name = payload.get("file_name")

        if file_name:

            document = EvidenceDocument(
                evidence_id=evidence.id,
                student_id=student_id,
                file_name=file_name,
                file_type=payload.get(
                    "file_type",
                    "Unknown",
                ),
                file_size=int(
                    payload.get(
                        "file_size",
                        0,
                    )
                    or 0
                ),
                document_status="Submitted",
                uploaded_at=now_iso(),
            )

            db.add(document)

        create_audit_log(
            db=db,
            evidence_id=evidence.id,
            student_id=student_id,
            action="Evidence Submitted",
            actor=payload.get(
                "actor",
                f"Student {student_id}",
            ),
            details=(
                f"Submitted evidence '{title}' "
                f"for skill '{skill}'."
            ),
        )

        db.commit()
        db.refresh(evidence)

        return {
            "success": True,
            "message": (
                "Portfolio evidence added successfully."
            ),
            "evidence": evidence_to_dict(evidence),
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Add document metadata to existing evidence
# ---------------------------------------------------------

@router.post("/{evidence_id}/document")
def add_evidence_document(
    evidence_id: int,
    payload: dict,
):

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.id == evidence_id
            )
            .first()
        )

        if evidence is None:
            return {
                "success": False,
                "message": "Evidence not found.",
            }

        file_name = payload.get("file_name")

        if not file_name:
            return {
                "success": False,
                "message": "File name is required.",
            }

        document = EvidenceDocument(
            evidence_id=evidence.id,
            student_id=evidence.student_id,
            file_name=file_name,
            file_type=payload.get(
                "file_type",
                "Unknown",
            ),
            file_size=int(
                payload.get(
                    "file_size",
                    0,
                )
                or 0
            ),
            document_status="Submitted",
            uploaded_at=now_iso(),
        )

        db.add(document)

        create_audit_log(
            db=db,
            evidence_id=evidence.id,
            student_id=evidence.student_id,
            action="Document Added",
            actor=payload.get(
                "actor",
                f"Student {evidence.student_id}",
            ),
            details=(
                f"Document '{file_name}' "
                f"attached to evidence '{evidence.title}'."
            ),
        )

        db.commit()
        db.refresh(document)

        return {
            "success": True,
            "message": "Evidence document metadata added.",
            "document": document_to_dict(document),
        }

    finally:
        db.close()


# ---------------------------------------------------------
# Get evidence documents
# ---------------------------------------------------------

@router.get("/{evidence_id}/documents")
def get_evidence_documents(
    evidence_id: int,
):

    db: Session = SessionLocal()

    try:
        documents = (
            db.query(EvidenceDocument)
            .filter(
                EvidenceDocument.evidence_id == evidence_id
            )
            .order_by(EvidenceDocument.id.desc())
            .all()
        )

        return [
            document_to_dict(document)
            for document in documents
        ]

    finally:
        db.close()


# ---------------------------------------------------------
# Get portfolio audit history
# ---------------------------------------------------------

@router.get("/{student_id}/audit")
def get_portfolio_audit(
    student_id: int,
):

    db: Session = SessionLocal()

    try:
        logs = (
            db.query(PortfolioAuditLog)
            .filter(
                PortfolioAuditLog.student_id == student_id
            )
            .order_by(
                PortfolioAuditLog.id.desc()
            )
            .all()
        )

        return [
            audit_to_dict(log)
            for log in logs
        ]

    finally:
        db.close()


# ---------------------------------------------------------
# Portfolio verification summary
# ---------------------------------------------------------

@router.get("/{student_id}/verification-summary")
def get_verification_summary(
    student_id: int,
):

    db: Session = SessionLocal()

    try:
        evidence = (
            db.query(PortfolioEvidence)
            .filter(
                PortfolioEvidence.student_id == student_id
            )
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

        verification_rate = (
            round((verified / total) * 100)
            if total
            else 0
        )

        return {
            "student_id": student_id,
            "total_evidence": total,
            "pending": pending,
            "verified": verified,
            "rejected": rejected,
            "verification_rate": verification_rate,
        }

    finally:
        db.close()