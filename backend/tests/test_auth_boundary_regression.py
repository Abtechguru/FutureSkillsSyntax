"""Regression tests for privilege boundaries and account deactivation."""
from unittest.mock import AsyncMock, MagicMock
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt

from app.core import security
from app.core.config import settings


@pytest.mark.asyncio
async def test_role_in_token_cannot_override_database_role(monkeypatch):
    token = jwt.encode(
        {"sub": "42", "role": "admin", "type": "access"},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    persisted_user = MagicMock()
    persisted_user.id = 42
    persisted_user.role.value = "career_seeker"
    persisted_user.is_active = True
    execution = MagicMock()
    execution.scalar_one_or_none.return_value = persisted_user
    db = MagicMock()
    db.execute = AsyncMock(return_value=execution)
    actual = await security.get_current_user(
        credentials=HTTPAuthorizationCredentials(scheme="Bearer", credentials=token),
        db=db,
    )
    assert actual == {"user_id": 42, "role": "career_seeker"}


@pytest.mark.asyncio
async def test_deactivated_account_denied_even_with_valid_token():
    token = security.create_access_token({"sub": "42", "role": "admin"})
    persisted_user = MagicMock()
    persisted_user.is_active = False
    execution = MagicMock()
    execution.scalar_one_or_none.return_value = persisted_user
    db = MagicMock()
    db.execute = AsyncMock(return_value=execution)
    with pytest.raises(HTTPException) as raised:
        await security.get_current_user(
            credentials=HTTPAuthorizationCredentials(scheme="Bearer", credentials=token),
            db=db,
        )
    assert raised.value.status_code == 401


@pytest.mark.asyncio
async def test_malformed_subject_is_rejected():
    token = security.create_access_token({"sub": "not-an-integer"})
    db = MagicMock()
    db.execute = AsyncMock()
    with pytest.raises(HTTPException) as raised:
        await security.get_current_user(
            credentials=HTTPAuthorizationCredentials(scheme="Bearer", credentials=token),
            db=db,
        )
    assert raised.value.status_code == 401
    db.execute.assert_not_awaited()
