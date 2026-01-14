"""API router configuration."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, career, user, mentorship, gamification, learning, community, upload

api_router = APIRouter()

# Authentication routes
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# User management routes
api_router.include_router(
    user.router,
    prefix="/user",
    tags=["User"]
)

# Career routes
api_router.include_router(
    career.router,
    prefix="/career",
    tags=["Career"]
)

# Mentorship routes
api_router.include_router(
    mentorship.router,
    prefix="/mentorship",
    tags=["Mentorship"]
)

# Gamification routes
api_router.include_router(
    gamification.router,
    prefix="/gamification",
    tags=["Gamification"]
)

# Learning routes
api_router.include_router(
    learning.router,
    prefix="/learning",
    tags=["Learning"]
)

# Community routes
api_router.include_router(
    community.router,
    prefix="/community",
    tags=["Community"]
)

# File upload routes
api_router.include_router(
    upload.router,
    prefix="/upload",
    tags=["Upload"]
)
