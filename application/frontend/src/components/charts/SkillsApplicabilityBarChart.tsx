import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SkillsRatingDatum } from "../../lib/surveyStats";
import ChartCard from "./ChartCard";
import { chartFont, CHART_COLORS } from "./chartTheme";

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
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="rating"
            tick={{ fill: CHART_COLORS.heading, fontFamily: chartFont, fontSize: 12 }}
            axisLine={{ stroke: CHART_COLORS.inkGhost }}
            tickLine={false}
            label={{
              value: "Rating",
              position: "insideBottom",
              offset: -2,
              fill: CHART_COLORS.subtitle,
              fontFamily: chartFont,
              fontSize: 11,
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: CHART_COLORS.heading, fontFamily: chartFont, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            formatter={(value: number) => [`${value} response${value === 1 ? "" : "s"}`, "Count"]}
            labelFormatter={(label) => `Rating ${label}`}
            contentStyle={{
              fontFamily: chartFont,
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="count" fill={CHART_COLORS.gold} radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
