/** Palette aligned with MSIM Course Hub Figma tokens. */
export const CHART_COLORS = {
  gold: "#dca624",
  inkGhost: "#c4b8aa",
  inkTertiary: "#9c8f80",
  heading: "#2d1f2a",
  subtitle: "#8e7998",
  grid: "rgba(196, 184, 170, 0.45)",
} as const;

export const HOURS_PIE_COLORS = [
  CHART_COLORS.gold,
  CHART_COLORS.inkTertiary,
  CHART_COLORS.inkGhost,
  CHART_COLORS.heading,
];

export const chartFont = '"Inter", system-ui, -apple-system, sans-serif';

export const chartFontSize = {
  tick: 14,
  label: 13,
  tooltip: 14,
  legend: 14,
} as const;
