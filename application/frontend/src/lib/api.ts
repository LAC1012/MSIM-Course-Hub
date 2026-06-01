import type { CourseDetailResponse, SearchResult } from "./types";

export function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE;
  // Empty = same origin (Vite dev proxy → Flask on :5000). Set VITE_API_BASE for a direct URL.
  if (base === undefined || base === "") return "";
  return base.replace(/\/$/, "");
}

export async function searchCourses(
  q: string,
  limit = 10,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const apiBase = getApiBase();
  const res = await fetch(
    `${apiBase}/api/courses/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    { signal }
  );
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data: { results: SearchResult[] } = await res.json();
  return data.results ?? [];
}

export async function fetchCourseDetail(
  courseId: string,
  signal?: AbortSignal
): Promise<CourseDetailResponse> {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/api/courses/${encodeURIComponent(courseId)}`, {
    signal,
  });
  if (!res.ok) throw new Error(`Course fetch failed (${res.status})`);
  return (await res.json()) as CourseDetailResponse;
}

