import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { SkillsRatingDatum } from "../../lib/surveyStats";
import ChartCard from "./ChartCard";
import { chartFont, chartFontSize, CHART_COLORS } from "./chartTheme";

type SkillsApplicabilityBarChartProps = {
  data: SkillsRatingDatum[];
};

export default function SkillsApplicabilityBarChart({ data }: SkillsApplicabilityBarChartProps) {
  const chartData = data.map((d) => ({
    rating: String(d.rating),
    count: d.count,
  }));
  const isEmpty = chartData.every((d) => d.count === 0);

  return (
    <ChartCard
      title="Skills applicability (1–7)"
      subtitle="How applicable are the skills you learned?"
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }} cursor={false}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="rating"
            tick={{ fill: CHART_COLORS.heading, fontFamily: chartFont, fontSize: chartFontSize.tick }}
            axisLine={{ stroke: CHART_COLORS.inkGhost }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: CHART_COLORS.heading, fontFamily: chartFont, fontSize: chartFontSize.tick }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Bar dataKey="count" fill={CHART_COLORS.gold} radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
