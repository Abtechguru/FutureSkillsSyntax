# Future Syntax — MCN 2026 Release Gate (7 November 2026)

## Public website vs application launch
The public Vite website is deployed from `main` on Vercel. **This does not mean the authenticated platform or mentorship programme is production-ready.** Changes in this document are implemented in the draft `release/mcn-2026-production-gates` branch and are **not** live unless specifically merged and deployed.

## Code changes in this release candidate
- Removed the tracked `.env.production` from the current branch tree. Historic Git commits may still expose values: **rotate/revoke credentials and remove historic exposure**. No secret values are reproduced in this report.
- Removed production fallback to `http://localhost:8000`; sign-in and registration display an unavailable state until an explicit HTTPS `VITE_API_URL` is configured.
- Added `/ready` backend database readiness check, separated from the `/health` liveness check.
- Fixed SQLAlchemy user-registration mapper imports. Isolated PostgreSQL API integration tests now cover backend startup, adult registration, login and authenticated profile.
- Updated container to support dynamically assigned hosting ports and database-aware health checks.
- Strengthened HTTPS-only CORS production settings and added production configuration regression tests.
- Repaired frontend lockfile, upgraded React Router to 7.18.5, and removed Monaco Editor and its vulnerable DOMPurify chain.
- Replaced the legacy live coding playground with a read-only activity, rather than exposing unsupervised WebSocket communication or code execution.

## Verification evidence
- Ephemeral PostgreSQL startup, registration, login, profile: passing on GitHub Actions.
- Frontend TypeScript/Vite build, core lint, backend syntax and focused security tests: passing on verified release-branch workflow checkpoints.
- Dependency repair workflow: `npm ci`, production web build, core lint, and `npm audit --omit=dev --audit-level=high` succeeded. The production audit reported **0 vulnerabilities**. Workflow: https://github.com/Abtechguru/FutureSkillsSyntax/actions/runs/42382284791
- The full legacy frontend lint audit continues to have outstanding findings outside the active MCN screens. It is a separate non-blocking CI report, **not** proof of production quality.
- A fresh CI run is required after the final lockfile commit. Confirm all required checks before any merge.

## External blockers — do not merge for full production launch
1. The connected Supabase project `futuresyntax` (`xqqhkfggysiqrnflyqno`) is **INACTIVE**. A restoration request failed because the organization already has two active free projects. The owner must approve a paid plan or choose which *other* project can be paused; do not pause an unrelated project automatically.
2. Vercel's `future-skills-syntax` project has **no configured application environment variables** in the checked project. Provision a backend host and set `VITE_API_URL` to its verified HTTPS origin; configure corresponding trusted backend CORS and SMTP.
3. Reconcile the existing Supabase migration UUID IDs with SQLAlchemy integer IDs using a reviewed, backed-up, non-destructive migration strategy. No database migration has been run against the paused production project.
4. Rotate/revoke exposed database, SMTP, cloud and other third-party credentials, and assess Git history and deployment logs. A file deletion is **not** historical secret eradication.
5. Complete verified guardian consent, mentor screening, supervision, moderation, safeguarding reporting, and clear role/ownership rules before any child account, messaging, or mentor assignment goes live.
6. Verify backend hosting, production HTTPS, end-to-end browser flows, production readiness endpoint, backups, rollback, alerting, accessibility and privacy policies.
7. Keep production social collaboration, code execution, avatar/document uploads, payments, public leaderboards and mentor matching disabled until their required reviews pass.

## Release decision
**Not yet approved for full production.** The static public site may remain online as an informational presence with honest descriptions. Authenticated enrolment of minors and unsupervised communication must remain unavailable.

Review candidate: https://github.com/Abtechguru/FutureSkillsSyntax/pull/2
