# OnaAseyori — FutureSkillsSyntax

A comprehensive platform for career paths, mentorship, learning and gamified experiences.

---

## 🚀 Project Overview

**OnaAseyori (FutureSkillsSyntax)** helps learners discover career paths, join mentorship programs, track learning progress, and engage with gamified experiences. This repository hosts the full-stack application: a Python backend (FastAPI), a React web frontend (Vite + TypeScript), a React Native mobile app (Expo), and infrastructure manifests + IaC (Kubernetes, Terraform).

## 📁 Repository Layout

- `backend/` — FastAPI service, database migrations, Celery tasks
- `frontend/web/` — Web client (Vite + React + TypeScript)
- `frontend/mobile/` — Mobile app (Expo / React Native)
- `infrastructure/` — Kubernetes manifests, NGINX, Terraform
- `monitoring/` — Prometheus, Grafana, ELK stack
- `scripts/` — Deployment & utility scripts
- `supabase/migrations/` — DB migration SQL for Supabase/Postgres

> See individual `README.md` files in each service for service-specific instructions.

---

## 🔧 Key Features

- Career path recommendations and content management
- Mentorship matchmaking and sessions
- Gamification (badges, points, leaderboards)
- Background jobs (Celery) and async processing
- Observability: logs, metrics, dashboards (Prometheus / Grafana / ELK)

---

## 🧰 Prerequisites

- Docker & Docker Compose
- Node 18+ / npm or pnpm
- Python 3.11+
- Git
- Optionally: `kubectl`, `helm`, `terraform` for deployments

---

## ⚡ Quickstart (Local Development)

### Backend

1. Create and activate Python venv (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
```

2. Copy environment template and set secrets:

```powershell
copy .env.example .env
# Edit .env with database and other credentials
```

3. Run DB migrations and start server:

```powershell
cd backend
npm run migrate  # or: alembic upgrade head
npm run dev       # runs: uvicorn app.main:app --reload --port 8000
```

> Backend dev scripts are in `backend/package.json`.

### Web Frontend

1. Install dependencies and run:

```bash
cd frontend/web
npm install
npm run dev
# app served at http://localhost:4173
```

2. Build for production:

```bash
npm run build
npm run preview
```

### Mobile (Expo)

```bash
cd frontend/mobile
npm install
npm run start
# Use Expo to open on device or emulator
```

---

## 🐘 Database & Migrations

- Postgres is used in production; Supabase migrations are in `supabase/migrations/`.
- Use Alembic for schema migrations: `alembic upgrade head`.
- To reset DB locally: `npm run db:reset` (backend scripts).

---

## 🐳 Docker & Docker Compose

- Compose files: `backend/docker-compose.yml`, `docker-compose.elk.yml`, `docker-compose.ssl.yml`.

Start full stack with docker-compose (development):

```bash
docker-compose -f docker-compose.yml -f docker-compose.elk.yml up --build
```

Build individual service images via `npm run docker:build` in each service folder.

---

## ☁️ Deployment

- Kubernetes manifests live in `infrastructure/kubernetes/` (Deployments, Services, StatefulSets).
- Terraform files are in `infrastructure/terraform/` for cloud provisioning.
- CI/CD hooks and staging/production configs are project-specific; see `scripts/deployment` for examples.

---

## 🔍 Testing, Linting & Formatting

- Backend tests: `cd backend && npm run test` (pytest)
- Frontend tests: `cd frontend/web && npm run test` (vitest)
- Linting: `npm run lint` (frontend) and `npm run lint` (backend uses flake8)
- Formatting: `npm run format` or `black` for Python

---

## 📈 Monitoring & Logging

- ELK stack config in `elk/` and `monitoring/elk/` for log ingestion.
- Prometheus & Grafana manifests in `monitoring/prometheus/` and `monitoring/grafana-dashboard.yaml`.
- Datadog integration helpers in `backend/integrations/datadog.py`.

---

## 🤝 Contributing

Please follow these guidelines:

1. Fork the repo and create a feature branch.
2. Keep changes scoped and add tests for new behavior.
3. Run linters and formatters before raising PR.
4. Use GitHub issues + PR templates (if available).

---

## 📜 License

This project is released under the **MIT License**. See `backend/pyproject.toml` for author and license metadata.

---

## 📞 Contact & Links

- Repo: https://github.com/Abtechguru/futureskillssyntax
- Team email: `team@onaaseyori.com`

---

If you want, I can:
1. Add CI badges and status (build / test / coverage). ✅
2. Add step-by-step environment variable examples and a `backend/.env.example`. ✅
3. Insert short diagrams or a CONTRIBUTING.md file. ✅

Tell me which of the above you'd like next, or if you want a trimmed/expanded README for a specific audience (developer, ops, or product). ✨
