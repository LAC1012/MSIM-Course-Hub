# MSIM Course Hub

Repository: [https://github.com/LAC1012/MSIM-Course-Hub](https://github.com/LAC1012/MSIM-Course-Hub)

## About

MSIM Course Hub centralizes UW MSIM course information and student survey feedback that is typically scattered across the catalog, time schedules, and informal notes.

Students can:

- **Search** courses by course number, title, or professor name
- **Open a course page** with catalog metadata and peer feedback
- **See survey-based statistics** (homework hours and skills applicability)
- **Submit a new review** via the linked Google Form

## Features

### Home (search)

- Landing page with live search (debounced, minimum 2 characters)
- Results show course ID, title, credits, type, description snippet, and review count
- Each result links to `/course/:courseId` (e.g. `/course/IMT%20542`)

### Course detail page

- Course type, title, specialization tags
- **About this course** — description and top career fields from survey responses
- **Course statistics** (when survey data exists for that course):
  - **Pie chart** — homework hours per week (`<2`, `2–4`, `4–6`, `6+`)
  - **Bar chart** — skills applicability ratings (1–7 scale)
- **Peer reviews** — written feedback from students (excludes empty or “N/A” responses)

### Navigation

- **Home** — search page
- **Review a Class** — opens the [student survey Google Form](https://docs.google.com/forms/d/e/1FAIpQLSc38D79TAzg-ADQtQDWdMUFN-OLHzZN6VnBrpQtAmsZ6T3_bg/viewform) in a new tab

### Backend API

Flask loads JSON data once at startup and serves:

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Service status, course count, courses with reviews |
| `GET /api/courses/search?q=...&limit=...` | Search catalog + match professor names and review text |
| `GET /api/courses/<course_id>` | Full course record and all linked survey rows |

Search matches course ID, title, description, professor name (from surveys), and review text.

## Data

All data lives under `application/backend/` as JSON files loaded by the API.

### Course catalog — `courses(completed).json`

| Field | Description |
|-------|-------------|
| `course_id` | e.g. `IMT 542` |
| `course_title` | Official title |
| `credits` | Credit string |
| `description` | Catalog description |
| `course_type` | e.g. Core, Elective |
| `specialization` | Array of specialization tags (may be empty) |
| `prerequisites` | Array of prerequisite course IDs (may be empty) |

**Current size:** 45 MSIM courses

### Student surveys — `surveyresponses.json`

Each row is one Google Form submission. The backend maps reviews to courses using **“Pick an MSIM class you have taken before”** (course number extracted via pattern, e.g. `IMT 542`).

| Survey field | Used for |
|--------------|----------|
| `Timestamp` | Review date on course page |
| `Pick an MSIM class you have taken before` | Link response → course |
| `What was the professor's full name? (e.g., Steven Gustafson)` | Search |
| `How many hours per week do you spend on homework assignments...` | Hours pie chart |
| `What types of assignments did you do for this class?` | Stored in data (not yet shown in UI) |
| `What field do you want to work in?` | Career tags on course page |
| `Recall what you have learned... how applicable are the skills you learned?` | Skills bar chart (1–7) |
| `Did this class help you create a professional project...` | Stored in data (not yet shown in UI) |
| `Please provide additional insights...` | Peer review cards + search |

**Current size:** 18 responses across **12** courses (IMT 500, 526, 535, 540, 542, 550, 561, 570, 573, 575, 580, 598)

New submissions should use the **Review a Class** form; export updated JSON into `surveyresponses.json` to refresh the site.

## Project layout

```
application/
├── backend/          # Flask API, Python venv, JSON data
│   ├── app.py
│   ├── courses(completed).json
│   └── surveyresponses.json
└── frontend/         # React + Vite + TypeScript
    ├── src/
    │   ├── pages/           # HomePage, CoursePage
    │   ├── components/      # SiteHeader, charts, CourseStatsSection
    │   └── lib/             # API client, types, survey aggregation
    └── .env.example
testplan.md                 # Testing strategy and quality targets
```

### Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, TypeScript, React Router, Recharts |
| Backend | Flask 3, flask-cors |
| Data | Static JSON (no database yet) |

### Key frontend files

- `src/pages/HomePage.tsx` — search UI
- `src/pages/CoursePage.tsx` — course detail, stats, reviews
- `src/components/SiteHeader.tsx` — nav + survey form link
- `src/components/charts/` — reusable Recharts pie and bar components
- `src/lib/surveyStats.ts` — aggregate survey fields for charts

## Run locally

Use **two terminals**. The frontend dev server proxies `/api` to Flask on port **5000**.

### 1. Backend

```bash
cd application/backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python app.py
```

API: [http://127.0.0.1:5000](http://127.0.0.1:5000)

```bash
curl http://127.0.0.1:5000/api/health
```

### 2. Frontend

```bash
cd application/frontend
npm install
cp .env.example .env   # optional; empty VITE_API_BASE uses the Vite proxy
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and try searching for `IMT 542` or `portable information structures`.

To call the API directly (without the proxy), set in `.env`:

```bash
VITE_API_BASE=http://127.0.0.1:5000
```

Restart `npm run dev` after changing `.env`.

## Testing

See [`testplan.md`](testplan.md) for functional checks, performance targets, and ongoing quality goals.

## Related docs

- [`application/backend/README.md`](application/backend/README.md) — API install, curl examples
- [`application/frontend/README.md`](application/frontend/README.md) — design tokens and Figma references
