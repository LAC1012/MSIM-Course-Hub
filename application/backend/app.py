from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from flask import Flask, jsonify, request
from flask_cors import CORS


BACKEND_DIR = Path(__file__).resolve().parent
COURSES_PATH = BACKEND_DIR / "courses(completed).json"
SURVEY_PATH = BACKEND_DIR / "surveyresponses.json"


COURSE_ID_RE = re.compile(r"\b([A-Za-z]{2,5}\s*\d{3})\b")


def _normalize(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip()).lower()


def _extract_course_id(text: str) -> Optional[str]:
    """
    Tries to pull out an ID like 'IMT 542' from survey strings such as:
    'IMT 542 Portable Information Structures'
    """
    m = COURSE_ID_RE.search(text or "")
    if not m:
        return None
    return re.sub(r"\s+", " ", m.group(1)).upper()


@dataclass(frozen=True)
class LoadedData:
    courses: List[Dict[str, Any]]
    courses_by_id: Dict[str, Dict[str, Any]]
    reviews_by_course_id: Dict[str, List[Dict[str, Any]]]


def load_data() -> LoadedData:
    courses = json.loads(COURSES_PATH.read_text(encoding="utf-8"))
    survey = json.loads(SURVEY_PATH.read_text(encoding="utf-8"))

    courses_by_id: Dict[str, Dict[str, Any]] = {}
    for c in courses:
        cid = (c.get("course_id") or "").strip().upper()
        if cid:
            courses_by_id[cid] = c

    reviews_by_course_id: Dict[str, List[Dict[str, Any]]] = {}
    for row in survey:
        picked = row.get("Pick an MSIM class you have taken before") or ""
        cid = _extract_course_id(picked)
        if not cid:
            continue
        reviews_by_course_id.setdefault(cid, []).append(row)

    return LoadedData(
        courses=courses,
        courses_by_id=courses_by_id,
        reviews_by_course_id=reviews_by_course_id,
    )


def _matches_course(course: Dict[str, Any], reviews: List[Dict[str, Any]], q: str) -> bool:
    if not q:
        return False

    haystacks: List[str] = []
    haystacks.append(course.get("course_id") or "")
    haystacks.append(course.get("course_title") or "")
    haystacks.append(course.get("description") or "")

    for r in reviews:
        haystacks.append(r.get("What was the professor's full name? (e.g., Steven Gustafson)") or "")
        haystacks.append(
            r.get(
                "Please provide additional insights about course content, professor, career relevance, or anything else you think is helpful for other students who are considering taking this class (write N/A if you have nothing else to share)"
            )
            or ""
        )

    nq = _normalize(q)
    return any(nq in _normalize(h) for h in haystacks if h)


def create_app() -> Flask:
    app = Flask(__name__)

    # Allow local Vite dev server to call the API (any localhost port).
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:5174",
                    "http://127.0.0.1:5174",
                ]
            }
        },
    )

    app.config["DATA"] = load_data()

    @app.get("/api/health")
    def health():
        data: LoadedData = app.config["DATA"]
        return jsonify(
            {
                "ok": True,
                "courses": len(data.courses),
                "courses_with_reviews": sum(1 for k in data.reviews_by_course_id.keys()),
            }
        )

    @app.get("/api/courses/search")
    def search_courses():
        q = (request.args.get("q") or "").strip()
        limit = request.args.get("limit", "20")
        try:
            limit_n = max(1, min(50, int(limit)))
        except Exception:
            limit_n = 20

        data: LoadedData = app.config["DATA"]

        results: List[Dict[str, Any]] = []
        for course in data.courses:
            cid = (course.get("course_id") or "").strip().upper()
            reviews = data.reviews_by_course_id.get(cid, [])
            if _matches_course(course, reviews, q):
                results.append(
                    {
                        "course": course,
                        "review_count": len(reviews),
                        "reviews": reviews[:5],
                    }
                )

        # Stable-ish ordering: prefer exact course id hits, then title hits, then review count.
        nq = _normalize(q)

        def score(item: Dict[str, Any]) -> Tuple[int, int, int]:
            c = item["course"]
            cid = _normalize(c.get("course_id") or "")
            title = _normalize(c.get("course_title") or "")
            exact_id = 1 if cid == nq else 0
            id_contains = 1 if nq and nq in cid else 0
            title_contains = 1 if nq and nq in title else 0
            return (exact_id, id_contains + title_contains, item["review_count"])

        results.sort(key=score, reverse=True)
        return jsonify({"query": q, "count": len(results), "results": results[:limit_n]})

    @app.get("/api/courses/<course_id>")
    def get_course(course_id: str):
        cid = re.sub(r"\s+", " ", (course_id or "")).strip().upper()
        data: LoadedData = app.config["DATA"]
        course = data.courses_by_id.get(cid)
        if not course:
            return jsonify({"error": "not_found", "course_id": cid}), 404
        reviews = data.reviews_by_course_id.get(cid, [])
        return jsonify({"course": course, "review_count": len(reviews), "reviews": reviews})

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)

