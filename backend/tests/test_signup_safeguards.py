"""Validate public signup cannot bypass adult or trusted-role requirements."""
import pytest
from fastapi import BackgroundTasks, HTTPException
from pydantic import ValidationError
from unittest.mock import AsyncMock, MagicMock

from app.schemas.user import UserCreate
from app.api.v1.endpoints.auth import register


VALID = {
    "email": "adult@example.org",
    "username": "adult123",
    "password": "strong-password-for-test",
    "full_name": "Test Adult",
    "role": "parent_guardian",
}


def test_adult_attestation_required():
    with pytest.raises(ValidationError):
        UserCreate(**VALID)


def test_false_adult_attestation_is_rejected():
    with pytest.raises(ValidationError):
        UserCreate(**VALID, is_adult=False)


@pytest.mark.asyncio
@pytest.mark.parametrize("blocked_role", ["admin", "mentor", "mentee"])
async def test_public_signup_cannot_grant_sensitive_roles(blocked_role):
    fake_response = MagicMock()
    fake_response.scalar_one_or_none.return_value = None
    db = MagicMock()
    db.execute = AsyncMock(return_value=fake_response)
    data = UserCreate(**{**VALID, "role": blocked_role}, is_adult=True)
    with pytest.raises(HTTPException) as error:
        await register(data, BackgroundTasks(), db)
    assert error.value.status_code == 403
    db.commit.assert_not_called()
