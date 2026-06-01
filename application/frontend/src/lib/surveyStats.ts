import type { Review } from "./types";
import { SURVEY_HOURS_KEY, SURVEY_SKILLS_KEY } from "./surveyFields";

export type HoursBucketId = "lt2" | "2-4" | "4-6" | "6plus";

export type HoursBucket = {
  id: HoursBucketId;
  label: string;
  count: number;
};

export type SkillsRatingDatum = {
  rating: number;
  count: number;
};

const HOURS_BUCKETS: { id: HoursBucketId; label: string; match: (raw: string) => boolean }[] = [
  { id: "lt2", label: "Less than 2 hours", match: (s) => /less than 2/i.test(s) },
  { id: "2-4", label: "2–4 hours", match: (s) => /2\s*to\s*4|2-4/i.test(s) },
  { id: "4-6", label: "4–6 hours", match: (s) => /4\s*to\s*6|4-6/i.test(s) },
  { id: "6plus", label: "6+ hours", match: (s) => /6\+|6 or more|more than 6/i.test(s) },
];

function normalizeHours(raw: unknown): string {
  return String(raw ?? "").trim();
}

export function aggregateHoursPerWeek(reviews: Review[]): HoursBucket[] {
  const counts = new Map<HoursBucketId, number>();
  for (const b of HOURS_BUCKETS) counts.set(b.id, 0);

  for (const review of reviews) {
    const raw = normalizeHours(review[SURVEY_HOURS_KEY]);
    if (!raw) continue;
    const bucket = HOURS_BUCKETS.find((b) => b.match(raw));
    if (bucket) counts.set(bucket.id, (counts.get(bucket.id) ?? 0) + 1);
  }

  return HOURS_BUCKETS.map((b) => ({
    id: b.id,
    label: b.label,
    count: counts.get(b.id) ?? 0,
  }));
}

export function aggregateSkillsApplicability(reviews: Review[]): SkillsRatingDatum[] {
  const counts = new Map<number, number>();
  for (let r = 1; r <= 7; r++) counts.set(r, 0);

  for (const review of reviews) {
    const raw = review[SURVEY_SKILLS_KEY];
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(n) || n < 1 || n > 7) continue;
    const rating = Math.round(n);
    counts.set(rating, (counts.get(rating) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rating, count]) => ({ rating, count }));
}

export function hasChartData(reviews: Review[]): boolean {
  const hours = aggregateHoursPerWeek(reviews).some((b) => b.count > 0);
  const skills = aggregateSkillsApplicability(reviews).some((d) => d.count > 0);
  return hours || skills;
}
