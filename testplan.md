# MSIM Course Hub – Test Plan

## Purpose

This document outlines the testing strategy for ensuring the **quality, accuracy, reliability, and performance** of the MSIM Course Hub information system.

It is intended to be:

- A **guide during implementation** (what to test before shipping changes)
- A **living document** (what we continuously verify over time)
- A **trust artifact** for users (how we ensure the data and access patterns remain dependable)

---

## System Overview

- **Frontend**: React + Vite (`application/frontend`)
- **Backend**: Flask API (`application/backend`)
- **Data sources**:
  - `application/backend/courses(completed).json` (course catalog metadata)
  - `application/backend/surveyresponses.json` (student review submissions)
- **Primary endpoints**:
  - `GET /api/health`
  - `GET /api/courses/search?q=...&limit=...`
  - `GET /api/courses/<course_id>`

---

## Desired Quality Attributes

- **Correctness**: Search results and course details match the underlying JSON data.
- **Completeness**: All courses are searchable by course ID/title; reviews appear when available.
- **Consistency**: Course IDs are normalized (e.g., `IMT 542`), and reviews map to the correct course.
- **Reliability**: API handles empty/invalid inputs gracefully and never crashes on malformed records.
- **Performance**: Search remains responsive for users and stable under moderate concurrency.
- **Observability**: Failures are visible via health checks, logs, and alarms; actions are defined.

---

## Test Objectives

- Ensure search works for **course number**, **course title**, and **professor name**
- Validate correct **join behavior** between course catalog and survey responses
- Confirm input handling for edge cases (empty queries, unknown courses, strange spacing/casing)
- Verify the system meets baseline **latency and uptime** expectations
- Detect and respond to errors (500 spikes), latency regressions, or data integrity issues

---

## Functional Testing

| Test Case | Description | Method | Expected Result |
|----------|-------------|--------|-----------------|
| Health endpoint | Check system status | `curl /api/health` | 200 JSON with `ok: true` and nonzero `courses` |
| Course search by ID | Query `IMT 542` | `GET /api/courses/search?q=IMT%20542` | Returns `IMT 542` in results |
| Course search by title | Query `portable information structures` | API or UI | Returns `IMT 542` in results |
| Course search by professor | Query `Steven Gustafson` | API or UI | Returns courses with matching survey professor field |
| Search with casing/spacing | Query `imt   542` | API | Same results as `IMT 542` |
| Short query suppression | Query length < 2 chars | UI | UI does not spam API; shows no results (or idle state) |
| Empty query | Query `""` or whitespace | API | Returns 200 with `results: []` (no server error) |
| Unknown course detail | Request course not in catalog | `GET /api/courses/IMT%20999` | 404 with `error: not_found` |
| Review mapping | Survey row includes `Pick an MSIM class...` | API response inspection | Review appears under correct `course_id` |
| Result format stability | Response includes `course`, `review_count`, `reviews` | Contract check | Keys exist and types are consistent |
| Frontend error handling | Stop backend and search | UI test | Clear user message (no blank crash) |
| CORS | Frontend dev server calls backend | Browser DevTools | Requests succeed without CORS errors |

---

## Data Quality / Integrity Tests

| Test Case | Description | Method | Expected Result |
|----------|-------------|--------|-----------------|
| JSON load success | Backend loads both JSON files at startup | Run app + observe logs + `GET /api/health` | App starts; health shows expected counts |
| Course ID uniqueness | Ensure `course_id` keys are unique | Script/unit test (planned) | No duplicates or duplicates are explicitly handled |
| Review course ID extraction | Extract `IMT 542` from survey strings | Unit test | Correct parsing for common formats |
| Missing fields tolerance | Survey rows missing professor/insights | Unit test | Search does not error; records are skipped or treated as empty strings |

---

## Performance Testing

Targets below assume local development or small hosted deployment. Update targets when hosting environment changes.

| Test Case | Description | Tool | Target |
|----------|-------------|------|--------|
| Cold start | First request after backend starts | Browser/curl | `/api/health` < 2.0s |
| Search latency (normal) | Typical search query | curl / UI | `/api/courses/search` p95 < 500ms |
| Burst queries | 20 queries quickly (simulating typing) | scripted curl | No errors; p95 < 750ms |
| Moderate concurrency | 25 concurrent search requests | Locust / k6 (planned) | 99% success; p95 < 1.5s |
| Large response bounds | Ensure `limit` caps payload | API test | `limit` clamped to max (50) |

Notes:

- The backend currently keeps data in memory after startup, so search should remain fast and consistent.
- If/when data grows significantly, add indexing and/or precomputed search fields and update targets.

---

## Quality Metrics (Service-Level Goals)

| Metric | Goal |
|--------|------|
| Search correctness | 100%: exact course ID queries return that course if present |
| Mapping correctness | 100%: reviews appear under the correct `course_id` |
| Response time | p95 < 500ms for search in typical usage |
| API uptime | 99.9% monthly (when hosted) |
| Error rate | < 1% 5xx responses (rolling 15 min) |
| UI stability | No uncaught exceptions for normal use paths |

---

## Alarms & Monitoring

These alarms are designed to detect issues early and guide action.

| Alarm | Trigger | Action |
|------|---------|--------|
| Uptime failure | `/api/health` fails for 1 min | Page/notify maintainer; verify deployment; roll back if needed |
| High latency | p95 search latency > 2s for 10 min | Investigate logs; check host resources; optimize search/indexing |
| 5xx spike | > 5 server errors in 5 min | Triage stack traces; hotfix; add regression test |
| Data load failure | App fails to start or health `courses = 0` unexpectedly | Verify JSON presence/format; restore known-good data |
| CORS failure | Frontend cannot call API | Confirm allowed origins and env vars; patch config |

Planned tooling options (choose based on hosting):

- Uptime pings: UptimeRobot / BetterStack
- Logs/APM: platform logs (Render/Fly/Heroku/Azure) or OpenTelemetry later
- CI checks: GitHub Actions (lint + unit tests + minimal API smoke)

---

## Actions / Runbooks (What we do when something breaks)

- **Uptime alarm fires**
  - Check `/api/health` manually
  - Confirm server process is running and port is reachable
  - If recently deployed, revert to last known good commit
- **Latency alarm fires**
  - Confirm request payload sizes (large `limit` or large response bodies)
  - Profile the search function and consider:
    - precomputed normalized fields
    - indexing by `course_id` and tokenized title/professor fields
    - caching common queries
- **Data integrity issue reported**
  - Reproduce with exact query and expected result
  - Check JSON record(s) and mapping logic
  - Add/extend a regression test to prevent recurrence

---

## Continuous Testing & Ongoing Maintenance

### On every change (local + CI)

- Run frontend build (`npm run build`)
- Run backend smoke test:
  - start Flask app
  - call `/api/health`
  - call `/api/courses/search?q=IMT%20542` (or another known course)

### Weekly (or per data refresh)

- Validate counts:
  - number of courses in catalog
  - number of courses with reviews
- Spot-check a sample of:
  - exact ID search
  - title search
  - professor search

### Quarterly (or when course catalog changes)

- Confirm the course catalog JSON still matches expected schema
- Re-evaluate performance targets if data volume changed materially

---

## Status Summary

| Area | Status |
|------|--------|
| Functional tests | ✅ Defined (manual); automation recommended next |
| Performance tests | ✅ Targets defined; load scripts planned |
| Alarms/monitoring | 🔜 Planned for hosted deployment |
| Regression tests | 🔜 Add unit tests for parsing/mapping and API contract |

---

## Future Additions

- **Backend unit tests** (pytest):
  - course ID extraction correctness
  - mapping survey rows → course IDs
  - API contract tests for response shape
- **Frontend tests** (Vitest/React Testing Library):
  - debounced search behavior
  - error state rendering
- **Synthetic monitoring**:
  - scheduled search checks against production
- **Schema validation**:
  - JSON schema checks for both data sources in CI

