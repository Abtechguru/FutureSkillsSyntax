"""API router configuration."""

from fastapi import APIRouter
from app.core.config import settings

from app.api.v1.endpoints import auth, user, mentorship, gamification, learning, upload, admin

api_router = APIRouter()

# Admin routes
api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["Admin"]
)

# Payment routes
if settings.PAYMENTS_ENABLED:
    from app.api.v1.endpoints import payment
    api_router.include_router(
        payment.router,
        prefix="/payment",
        tags=["Payment"]
    )

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
if settings.CAREER_API_ENABLED:
    from app.api.v1.endpoints import career
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

# Collaboration routes (WebSocket)
if settings.CHILD_INTERACTIVE_FEATURES_ENABLED:
    from app.api.v1.endpoints import collaboration
    api_router.include_router(
        collaboration.router,
        prefix="/collaboration",
        tags=["Collaboration"]
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
if settings.CHILD_INTERACTIVE_FEATURES_ENABLED:
    from app.api.v1.endpoints import community
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

# Goals tracking routes (MongoDB)
if settings.GOALS_ENABLED:
    from app.api.v1.endpoints import goals
    api_router.include_router(
        goals.router,
        prefix="/goals",
        tags=["Goals"]
    )
