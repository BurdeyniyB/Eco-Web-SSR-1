interface MetricCardProps {
  title: string;
  value: string | number;
  hint?: string;
}

export function MetricCard({ title, value, hint }: MetricCardProps): JSX.Element {
  return (
    <article className="metric-card">
      <p className="metric-title">{title}</p>
      <strong className="metric-value">{value}</strong>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </article>
  );
}
