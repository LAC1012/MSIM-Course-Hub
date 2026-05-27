import { useMemo } from "react";
import type { Review } from "../lib/types";
import { aggregateHoursPerWeek, aggregateSkillsApplicability } from "../lib/surveyStats";
import HoursPerWeekPieChart from "./charts/HoursPerWeekPieChart";
import SkillsApplicabilityBarChart from "./charts/SkillsApplicabilityBarChart";

type CourseStatsSectionProps = {
  reviews: Review[];
};

export default function CourseStatsSection({ reviews }: CourseStatsSectionProps) {
  const hoursData = useMemo(() => aggregateHoursPerWeek(reviews), [reviews]);
  const skillsData = useMemo(() => aggregateSkillsApplicability(reviews), [reviews]);

  return (
    <div className="course-stats">
      <HoursPerWeekPieChart data={hoursData} />
      <SkillsApplicabilityBarChart data={skillsData} />
    </div>
  );
}
