import asyncio
from sqlalchemy import select
from app.core.database import engine, Base, get_db
from app.models.user import User, UserRole
from app.models.mentorship import MentorAssignment, MentorshipSession, MentorshipTask, TaskSubmission, CollaborativeSession
from app.models.career import CareerAssessment, LearningPath, Module, Step, LearningProgress
from app.models.payment import Transaction
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession

async def seed_admin():
    print("Seeding admin user...")
    async with AsyncSession(engine) as db:
        # Check if admin already exists
        result = await db.execute(select(User).where(User.email == "admin@futuresyntax.com"))
        admin = result.scalar_one_or_none()
        
        if not admin:
            admin = User(
                email="admin@futuresyntax.com",
                username="admin",
                full_name="Super Admin",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_verified=True,
                is_active=True
            )
            db.add(admin)
            await db.commit()
            print("Admin user created: admin@futuresyntax.com / admin123")
        else:
            print("Admin user already exists.")

if __name__ == "__main__":
    asyncio.run(seed_admin())
