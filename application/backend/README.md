# Flask API (Course Search)

This folder contains a small Flask backend that:

- Loads course metadata from `courses(completed).json`
- Loads course survey responses from `surveyresponses.json`
- Exposes search endpoints used by the frontend.

## Requirements

- Python 3.10+ (tested with Python 3.14)
- `pip`

## Install & Run

From the project root (`application/`):

```bash
cd backend

# Create a virtual environment (one-time)
python3 -m venv .venv

# Install dependencies
.venv/bin/python -m pip install -r requirements.txt

# Start the server (defaults to port 5000; recommended for local use: 5050)
PORT=5050 .venv/bin/python app.py
```

The API will be available at:

- `http://127.0.0.1:5050`

## Test the API

Health check:

```bash
curl http://127.0.0.1:5050/api/health
```

Search for a course (examples):

```bash
curl "http://127.0.0.1:5050/api/courses/search?q=IMT%20542&limit=10"
curl "http://127.0.0.1:5050/api/courses/search?q=portable%20information%20structures&limit=10"
```

Get a specific course by ID:

```bash
curl "http://127.0.0.1:5050/api/courses/IMT%20542"
```

## Notes for Frontend Integration

The React app fetches from `VITE_API_BASE` if it’s set; otherwise it uses `http://localhost:5050`.

For example, when running Vite:

```bash
export VITE_API_BASE="http://localhost:5050"
```

