# MSIM-Course-Hub

Repository: `https://github.com/LAC1012/MSIM-Course-Hub`

## About
MSIM Course Hub centralizes UW MSIM course information and student reviews that are typically scattered across multiple sources (e.g., catalog pages, time schedules, and informal notes).

The goal is to help MSIM students quickly:

- Find courses by **course number**, **course title**, or **professor name**
- See course metadata (credits, description, prereqs)
- See peer feedback (workload, assignments, career relevance, and freeform notes)

## Project layout

All app code lives under `application/`:

- **Frontend**: `application/frontend/` (React + Vite)
- **Backend**: `application/backend/` (Flask API)
- **Data files**: `application/backend/courses(completed).json` and `application/backend/surveyresponses.json`

## Frontend (React + Vite)

The frontend provides the landing page and search UI. As you type in the search bar, it calls the backend API and renders matching courses.

Key files:

- `application/frontend/src/App.tsx`: search input + results rendering
- `application/frontend/src/App.css`: styles

## Backend (Flask API)

The backend loads the two JSON files **once at startup** and exposes a small API for searching.

Endpoints:

- `GET /api/health`
- `GET /api/courses/search?q=...&limit=...`
- `GET /api/courses/<course_id>`

See `application/backend/README.md` for backend install/run details.

## Data sources

- **Course catalog** (`courses(completed).json`): course ID, title, credits, description, prerequisites, etc.
- **Survey responses** (`surveyresponses.json`): student-submitted reviews keyed by course selection (e.g., “IMT 542 Portable Information Structures”).

## Run locally (quick start)

From the repo root:

### Backend

```bash
cd application/backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
PORT=5050 .venv/bin/python app.py
```

### Frontend

In a separate terminal:

```bash
cd application/frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`) and search for a course (e.g. `IMT 542`).
