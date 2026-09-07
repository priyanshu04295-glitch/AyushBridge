from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.api.health import router as health_router
from app.api.users import router as users_router
from app.api.students import router as students_router
from app.api.skills import router as skills_router
from app.api.opportunities import router as opportunities_router
from app.api.applications import router as applications_router
from app.api.portfolio import router as portfolio_router
from app.api.industry import router as industry_router
from app.api.industry_opportunities import router as industry_opportunities_router
from app.api.industry_create import router as industry_create_router
from app.api.industry_candidates import router as industry_candidates_router
from app.api.shortlist import router as shortlist_router
from app.api.industry_applications import router as industry_applications_router
from app.api.faculty import router as faculty_router
from app.api.institution import router as institution_router
from app.api.admin import router as admin_router
from app.api.industry_verification import router as industry_verification_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="AyushBridge API",
    description="Academia–Industry Competency Intelligence Platform",
    version="1.0.0",
)

# Initialize the MVP schema at startup so a fresh checkout supports the
# persisted application, portfolio, and opportunity workflows.
init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(users_router)
app.include_router(students_router)
app.include_router(skills_router)
app.include_router(opportunities_router)
app.include_router(applications_router)
app.include_router(portfolio_router)
app.include_router(industry_router)
app.include_router(industry_opportunities_router)
app.include_router(industry_create_router)
app.include_router(industry_candidates_router)
app.include_router(shortlist_router)
app.include_router(industry_applications_router)
app.include_router(faculty_router)
app.include_router(institution_router)
app.include_router(admin_router)
app.include_router(industry_verification_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "AyushBridge API is running",
        "status": "success",
    }
