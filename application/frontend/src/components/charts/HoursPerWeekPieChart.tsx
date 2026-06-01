import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { HoursBucket } from "../../lib/surveyStats";
import ChartCard from "./ChartCard";
import { chartFont, chartFontSize, HOURS_PIE_COLORS } from "./chartTheme";

type HoursPerWeekPieChartProps = {
  data: HoursBucket[];
};

export default function HoursPerWeekPieChart({ data }: HoursPerWeekPieChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: d.label, value: d.count }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  return (
    <ChartCard
      title="Hours per week on homework"
      subtitle="Student-reported time on assignments"
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="46%"
            outerRadius={100}
            innerRadius={0}
            paddingAngle={2}
            stroke="#ffffff"
            strokeWidth={2}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={HOURS_PIE_COLORS[index % HOURS_PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, item) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return [`${value} (${pct}%)`, item.payload?.name ?? "Responses"];
            }}
            contentStyle={{
              fontFamily: chartFont,
              fontSize: chartFontSize.tooltip,
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              fontFamily: chartFont,
              fontSize: chartFontSize.legend,
              paddingTop: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
