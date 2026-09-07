from app.db.session import Base, engine
from app.models.user import (
    Application,
    AuthCredential,
    IndustryOpportunity,
    PortfolioEvidence,
    User,
)


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("AyushBridge database initialized successfully.")