from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=30,
)

# Create session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base model class
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Validate a provisioned production schema; create tables only for development.

    The Supabase bootstrap SQL currently uses UUID user IDs whereas this ORM
    expects integer IDs. This check prevents silently launching against an
    incompatible schema or auto-creating production tables.
    """
    # Career routes are optional, but User has ORM relationships to career
    # models. Register their mappings before sessions configure or query User.
    from app.models import career as _career_models  # noqa: F401

    if settings.ENVIRONMENT.lower() == "production":
        required_columns = {
            "users": {"id", "email", "username", "role", "is_active",
                      "password_reset_token", "password_reset_expires",
                      "verification_token_expires"},
            "mentor_assignments": {"id", "mentor_id", "mentee_id", "is_active"},
            "mentorship_sessions": {"id", "assignment_id", "mentor_id", "mentee_id"},
        }
        async with engine.connect() as conn:
            for table, columns in required_columns.items():
                result = await conn.execute(
                    text(
                        "SELECT column_name, data_type FROM information_schema.columns "
                        "WHERE table_schema = current_schema() AND table_name = :table"
                    ),
                    {"table": table},
                )
                available = {name: dtype for name, dtype in result.fetchall()}
                missing = columns - available.keys()
                if missing:
                    raise RuntimeError(
                        f"Production schema mismatch: {table} missing columns {sorted(missing)}"
                    )
                if available["id"] not in ("integer", "bigint"):
                    raise RuntimeError(
                        f"Production schema mismatch: {table}.id must use integer identifiers; "
                        "reconcile Supabase UUID migrations before release"
                    )
        return

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)