import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { fetchCourseDetail } from "../lib/api";
import type { CourseDetailResponse, Review } from "../lib/types";

export default function CoursePage() {
  const params = useParams();
  const courseId = useMemo(() => decodeURIComponent(params.courseId ?? ""), [params.courseId]);

  const [data, setData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const next = await fetchCourseDetail(courseId, controller.signal);
        setData(next);
      } catch {
        setError("Couldn’t load this course. Try going back to search.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [courseId]);

  const course = data?.course;
  const reviews = data?.reviews ?? [];

  return (
    <div className="page">
      <SiteHeader />

      <main className="course-page">
        <div className="course-page__top">
          <Link to="/" className="back-link">
            <span className="back-link__icon" aria-hidden="true">
              ‹
            </span>
            Back to search
          </Link>
        </div>

        <div className="course-page__content">
          {loading ? <p className="course-page__status">Loading…</p> : null}
          {error ? <p className="course-page__status course-page__status--error">{error}</p> : null}

          {!loading && !error && course ? (
            <>
              <section className="course-hero">
                <p className="course-hero__type">{course.course_type ?? ""}</p>
                <div className="course-hero__titleRow">
                  <h1 className="course-hero__title">
                    {course.course_id} {course.course_title}
                  </h1>
                  {(course.specialization ?? []).map((tag) => (
                    <span key={tag} className="pill pill--ink">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <section className="info-card">
                <p className="info-card__kicker">ABOUT THIS COURSE</p>
                {course.description ? <p className="info-card__body">{course.description}</p> : null}
                <div className="info-card__divider" aria-hidden="true" />

                <div className="info-card__row">
                  <p className="info-card__label">Relevant careers:</p>
                  {topCareerTags(reviews).map((c) => (
                    <span key={c} className="pill pill--soft">
                      {c}
                    </span>
                  ))}
                </div>
              </section>

              <section className="section-heading">
                <h2 className="section-heading__title">Course Statistics</h2>
                <p className="section-heading__subtitle">
                  This data is based on what students have reported based on their experience taking this class.
                </p>
              </section>

              {/* Charts + peer reviews added next */}

              <section className="section-heading section-heading--spaced">
                <h2 className="section-heading__title">Peer Reviews</h2>
              </section>

              <div className="reviews">
                {reviews.length === 0 ? <p className="course-page__status">No peer reviews yet.</p> : null}
                {reviews.slice(0, 5).map((r, idx) => (
                  <ReviewCard key={idx} review={r} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const timestamp = (review["Timestamp"] as string | undefined) ?? "";
  const month = formatMonthLabel(timestamp);
  const text =
    (review[
      "Please provide additional insights about course content, professor, career relevance, or anything else you think is helpful for other students who are considering taking this class (write N/A if you have nothing else to share)"
    ] as string | undefined) ?? "";

  return (
    <article className="review-card">
      <p className="review-card__kicker">{month}</p>
      <p className="review-card__text">{text || "N/A"}</p>
    </article>
  );
}

function formatMonthLabel(ts: string): string {
  // Survey timestamps look like "5/17/2026 11:43:00"
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(ts);
  if (!m) return "Unknown date";
  const month = Number(m[1]);
  const year = Number(m[3]);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[Math.max(1, Math.min(12, month)) - 1]} ${year}`;
}

function topCareerTags(reviews: Review[]): string[] {
  const key = "What field do you want to work in?" as const;
  const counts = new Map<string, number>();

  for (const r of reviews) {
    const raw = r[key] as string | undefined;
    if (!raw) continue;
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const p of parts) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
}

