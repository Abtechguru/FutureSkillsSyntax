"""PostgreSQL-backed API smoke test, never connected to live Supabase.

Run only with an ephemeral CI database. Exercises actual startup,
registration persistence and readiness, not just Python imports.
"""
from fastapi.testclient import TestClient
from app.main import app


def test_real_postgres_startup_and_adult_signup():
    with TestClient(app) as client:
        ready = client.get("/ready")
        assert ready.status_code == 200
        assert ready.json()["status"] == "ready"

        register = client.post(
            "/api/v1/auth/register",
            json={
                "is_adult": True,
                "email": "ci-parent@example.com",
                "username": "ci_parent_user",
                "password": "StrongExamplePassword42!",
                "full_name": "CI Parent",
                "role": "parent_guardian",
            },
        )
        assert register.status_code == 201, register.text
        assert register.json()["role"] == "parent_guardian"
        assert "hashed_password" not in register.json()

        sign_in = client.post(
            "/api/v1/auth/login",
            json={"username": "ci_parent_user", "password": "StrongExamplePassword42!"},
        )
        assert sign_in.status_code == 200, sign_in.text
        token = sign_in.json()["access_token"]
        profile = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert profile.status_code == 200, profile.text
        assert profile.json()["email"] == "ci-parent@example.com"
