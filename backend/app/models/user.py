from sqlalchemy import JSON, Column, Integer, String, Text

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, default="active")


class AuthCredential(Base):
    __tablename__ = "auth_credentials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, nullable=False, index=True)
    opportunity_id = Column(Integer, nullable=False, index=True)

    opportunity_title = Column(String, nullable=False)
    organization = Column(String, nullable=False)

    match_score = Column(Integer, default=0)

    status = Column(String, default="Submitted")
    stage = Column(String, default="Application Submitted")


class PortfolioEvidence(Base):
    __tablename__ = "portfolio_evidence"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, nullable=False, index=True)

    title = Column(String, nullable=False)
    evidence_type = Column(String, nullable=False)

    skill = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    verification_status = Column(String, default="Pending")
    verified_by = Column(String, default="")

    evidence_level = Column(String, default="Self Declared")


class IndustryOpportunity(Base):
    __tablename__ = "industry_opportunities"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    opportunity_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    duration = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    competencies = Column(JSON, nullable=False)

    status = Column(String, default="Pending Verification")
    created_by = Column(
        String,
        default="Ayurveda Research Institute",
    )