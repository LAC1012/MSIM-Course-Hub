import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
};

export default function ChartCard({
  title,
  subtitle,
  children,
  emptyMessage = "Not enough survey responses yet.",
  isEmpty = false,
}: ChartCardProps) {
  return (
    <article className="chart-card">
      <header className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        {subtitle ? <p className="chart-card__subtitle">{subtitle}</p> : null}
      </header>
      {isEmpty ? (
        <p className="chart-card__empty">{emptyMessage}</p>
      ) : (
        <div className="chart-card__body">{children}</div>
      )}
    </article>
  );
}
