# Future Syntax — MCN 2026 Production Readiness Gate

## Mission and intended audience
Future Syntax is a community-based programme for boys ages 10–15 who lack consistent parental guidance. It combines supervised mentorship, digital literacy, foundational coding, simple automation, and life skills (responsibility, discipline, financial awareness, and growth mindset). The existing OnaAseyori career platform is a technology foundation, **not** evidence that safeguarding or launch testing has been completed.

## Critical: public repository credentials
Files named `backend/.env` and `.env.production` were discoverable in the public repository as of 2026-11-01. **Assume all credentials in these files are compromised.** Do not copy contents into issues, logs, or pull requests. Rotate all real credentials in their source providers (Supabase service-role/database passwords, SMTP, MongoDB, cloud, JWT secret, and other third-party tokens). Remove tracked copies from the current tree and coordinate history rewriting / GitHub secret-scanning remediation separately. A .gitignore update alone does not untrack or erase secrets already committed. Check deployment configs and audit logs after rotation.

## Release blockers
- [ ] Rotate and revoke exposed credentials, audit access, remove tracked secret files and sanitize git history as appropriate.
- [ ] Verify all authentication paths, token validity, session expiration, authorization and tenant/resource ownership on the backend. No roles may be accepted from untrusted request bodies.
- [ ] Verify explicit production CORS origins, unique strong secret key, HTTPS, secure headers, request throttling, CSRF policy where cookie auth is used, and secure credential storage.
- [ ] Review every API route and storage bucket for child-data exposure, file-type/content verification, malicious uploads, and privacy.
- [ ] Build and test web, API and mobile against a non-production environment with seeded non-sensitive test fixtures. Run dependency audits, static analysis, database migration checks and end-to-end tests; record evidence.
- [ ] Check deployment rollback, database backups/restores, uptime monitoring, crash alerts, log redaction, and incident response procedures.
- [ ] Validate accessibility (keyboard, screen-reader, contrast, low-bandwidth/mobile) and availability on expected devices.
- [ ] Audit every public claim and partner testimonial; publish only verified programme facts and genuine approved media.
- [ ] Conduct a safeguarding and legal/privacy review applicable to Nigeria before onboarding children. Collect minimal data, establish retention/deletion and guardian access procedures.

## Child safeguarding product requirements
- Guardian-controlled onboarding and documented, verifiable parent/guardian consent before collecting sensitive information or creating a child's account; do not assume assent alone is sufficient.
- Adult mentor identity verification, screening and safeguarding training before permission to interact with children; admin approval and revocation.
- **No unrestricted adult–minor private messaging**, unsupervised 1:1 meetings, live location sharing, public minor profiles, or public leaderboards that reveal children's identities.
- Moderated, auditable group communications only; guardian or programme-supervisor visibility, flag/report/block workflows, escalation and incident handling.
- Role boundaries: visitor, applicant/guardian, learner, vetted mentor, programme facilitator, safeguarding officer, and administrator. Apply server-side least privilege and auditable access.
- Event registration, attendance, learning progress and feedback must have consent-aware visibility. Media requires separate express guardian permission; default to no public photos.
- Child-friendly privacy information, anonymous programme outcome reporting, practical data deletion and complaint/reporting routes.
- Verify mentoring schedules and learning content align with a realistic, supervised community rollout.

## MCN 2026 launch MVP
1. Public: mission, programme design, eligibility, community location described safely, mentor/volunteer application, contact, accessible FAQs, privacy and safeguarding policies.
2. Operations: guardian application/consent workflow; learner intake; mentor screening/approval; cohort enrolment; scheduled facilitated sessions; attendance; age-appropriate coding and life-skills curriculum.
3. Accountability: guardian updates, safeguarding reports, audit log, anonymised impact measures (sessions delivered, attendance, modules completed); don't fabricate impact statistics.
4. Launch later, only after review: social feeds, open direct messaging, public leaderboards, real-time chats or community interactions.

## Deployment exit criteria
Production launches only when the security and safeguarding blockers above are resolved and documented. Validate `npm run build` and `npm run lint` under `frontend/web`, plus backend pytest, migrations and container health checks in a reproducible CI pipeline. Establish hosting, DNS, TLS, verified environment variables, and deployment smoke tests before public announcement.

## Immediate hardening branch
The `hardening/mcn-2026-launch-readiness` branch introduces startup validation for production secrets and allowed origins, removes the wildcard CORS fallback, and expands ignore patterns. These limited changes are **not** a production certification. They do not remediate previously tracked secrets.
