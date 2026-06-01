import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { searchCourses } from "../lib/api";
import type { SearchResult } from "../lib/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = query.trim();
  const shouldSearch = trimmed.length >= 2;

  useEffect(() => {
    if (!shouldSearch) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const next = await searchCourses(trimmed, 10, controller.signal);
        setResults(next);
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") return;
        setError("Couldn’t load results. Is the Flask server running?");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [shouldSearch, trimmed]);

  return (
    <div className="page">
      <SiteHeader />

      <main className="hero">
        <p className="hero__label">UNIVERSITY OF WASHINGTON &nbsp;•&nbsp; iSCHOOL</p>
        <h1 className="hero__title">
          What do you want to <em>learn</em>?
        </h1>
        <p className="hero__subtitle">Search by course name, course number or professor name</p>

        <form className="search-bar" role="search" aria-label="Course search" onSubmit={(e) => e.preventDefault()}>
          <img className="search-bar__icon" src="/assets/magnifying-glass.svg" alt="" width={16} height={16} />
          <input
            type="search"
            className="search-bar__input"
            placeholder={'Try "IMT 542" or "portable information structures" ...'}
            aria-label="Search courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <section className="search-results" aria-live="polite">
          {error ? <p className="search-results__status search-results__status--error">{error}</p> : null}
          {loading ? <p className="search-results__status">Searching…</p> : null}

          {!loading && !error && shouldSearch && results.length === 0 ? (
            <p className="search-results__status">No matches.</p>
          ) : null}

          <ul className="search-results__list">
            {results.map((r) => {
              const to = `/course/${encodeURIComponent(r.course.course_id)}`;
              return (
                <li key={r.course.course_id} className="search-results__item">
                  <Link to={to} className="search-results__link" aria-label={`View ${r.course.course_id}`}>
                    <div className="search-results__title">
                      <span className="search-results__code">{r.course.course_id}</span>
                      <span className="search-results__name">{r.course.course_title}</span>
                    </div>
                    <div className="search-results__meta">
                      <span>
                        {r.review_count} review{r.review_count === 1 ? "" : "s"}
                      </span>
                      {r.course.credits ? <span>• {r.course.credits} credits</span> : null}
                      {r.course.course_type ? <span>• {r.course.course_type}</span> : null}
                    </div>
                    {r.course.description ? <p className="search-results__desc">{r.course.description}</p> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

