import { useEffect, useMemo, useState } from "react";

type Course = {
  course_id: string;
  course_title: string;
  credits?: string;
  description?: string;
  course_type?: string;
  specialization?: string[];
  prerequisites?: string[];
};

type Review = Record<string, unknown>;

type SearchResult = {
  course: Course;
  review_count: number;
  reviews: Review[];
};

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = query.trim();
  const shouldSearch = trimmed.length >= 2;

  const apiBase = useMemo(() => {
    return (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE ?? "http://localhost:5050";
  }, []);

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
        const res = await fetch(
          `${apiBase}/api/courses/search?q=${encodeURIComponent(trimmed)}&limit=10`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: { results: SearchResult[] } = await res.json();
        setResults(data.results ?? []);
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") return;
        setError("Couldn’t load results. Is the Flask server running on port 5000?");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [apiBase, shouldSearch, trimmed]);

  return (
    <div className="page" data-node-id="1:12">
      <header className="header" data-node-id="8:599">
        <div className="header__inner" data-node-id="I8:599;8:593">
          <p className="header__logo" data-node-id="I8:599;8:586">
            MSIM Course Hub
          </p>
          <nav
            className="header__nav"
            data-node-id="I8:599;8:592"
            aria-label="Main"
          >
            <a href="#" className="header__link" data-node-id="I8:599;8:588">
              Home
            </a>
            <a href="#" className="header__link" data-node-id="I8:599;8:589">
              Review a Class
            </a>
          </nav>
        </div>
        <div
          className="header__divider"
          data-node-id="I8:599;8:594"
          aria-hidden="true"
        >
          <img src="/assets/header-line.svg" alt="" width={1440} height={1} />
        </div>
      </header>

      <main className="hero">
        <p className="hero__label" data-node-id="1:23">
          UNIVERSITY OF WASHINGTON &nbsp;•&nbsp; iSCHOOL
        </p>
        <h1 className="hero__title" data-node-id="1:24">
          What do you want to <em>learn</em>?
        </h1>
        <p className="hero__subtitle" data-node-id="1:25">
          Search by course name, course number or professor name
        </p>
        <form
          className="search-bar"
          data-node-id="8:141"
          role="search"
          aria-label="Course search"
          onSubmit={(event) => event.preventDefault()}
        >
          <img
            className="search-bar__icon"
            src="/assets/magnifying-glass.svg"
            alt=""
            width={16}
            height={16}
            data-node-id="I8:141;1:30"
          />
          <input
            type="search"
            className="search-bar__input"
            placeholder={'Try "IMT 542" or "portable information structures" ...'}
            data-node-id="I8:141;1:27"
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
            {results.map((r) => (
              <li key={r.course.course_id} className="search-results__item">
                <div className="search-results__title">
                  <span className="search-results__code">{r.course.course_id}</span>
                  <span className="search-results__name">{r.course.course_title}</span>
                </div>
                <div className="search-results__meta">
                  <span>{r.review_count} review{r.review_count === 1 ? "" : "s"}</span>
                  {r.course.credits ? <span>• {r.course.credits} credits</span> : null}
                  {r.course.course_type ? <span>• {r.course.course_type}</span> : null}
                </div>
                {r.course.description ? (
                  <p className="search-results__desc">{r.course.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

