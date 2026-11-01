# Future Syntax — MCN 2026 release status (2026-11-01)

## Verified quality-gate evidence
GitHub Actions run: https://github.com/Abtechguru/FutureSkillsSyntax/actions/runs/41288898070

- Python syntax compilation: PASS.
- FastAPI import without live external credentials: PASS after optional legacy career router isolation.
- Focused backend auth/storage regression tests: PASS.
- TypeScript/Vite production web build: PASS.
- Strict lint of rebuilt MCN screens: PASS.
- Full legacy lint audit: FAIL (non-blocking). The broader prototype remains subject to technical-debt remediation.
- npm audit of production web dependencies: FAIL (non-blocking): 13 findings, comprising 6 high and 7 moderate.
- Full npm dependency install audit: 49 findings including 3 critical (dev plus production dependencies).
- Vercel: recent branch build status FAILED due build-rate limit; no public production release completed.

These checks are narrower than full end-to-end functionality and do not establish production readiness.

## Architecture constraints
- The connected Supabase project called `futuresyntax` is inactive, and its database could not be read during this audit. The repository previously supplied a different hard-coded Supabase project URL, now removed from configuration defaults.
- The existing SQLAlchemy ORM uses integer identifiers; the repository's Supabase bootstrap contains UUID identifiers. Data-preserving schema reconciliation is required before live migrations.
- Tracked environment credentials may be compromised. Rotate keys and secrets and remove the current tracked `.env.production` and any historical exposures. The `backend/.env` was removed on the hardening branch, not from repository history.
- Guardian consent, mentor-screening evidence, supervised interactions and safeguarding incident workflows are not yet complete. Until then matching, scheduling, social messaging, public leaderboards, payments and child-facing uploads remain intentionally disabled.

## Required before launch
1. Resolve public credential exposures and confirm the authoritative production database project. Do not expose service-role secrets to the browser.
2. Complete a migration strategy on a backed-up staging clone; verify ownership and tenant/guardian boundaries and RLS policies before production rollout.
3. Fix production dependency vulnerabilities, regenerate the lockfile, test regressions and make production audit a required CI check.
4. Remediate legacy lint debt, complete coverage for every enabled backend endpoint and verify user flows end-to-end (registration, verification, login, password reset, profile, supervised enrolment).
5. Implement and independently review consent, approval, reporting, mentor safeguarding and supervised communications before enrolling any children.
6. Confirm Vercel project root/build output, deployment quota, frontend API URL, backend hosting, DNS/TLS, monitoring, backups, rollback and incident response.
7. Require successful staging build, security tests, data restoration and accessibility checks before releasing on `main`.

## Workflow principle
Never fabricate learners, mentors, programmes, outcomes, payments or progress in authenticated screens. Keep public impact claims factual and avoid identifiable child images without specific guardian permissions. Reviews occur through draft pull requests rather than direct untested production changes.
