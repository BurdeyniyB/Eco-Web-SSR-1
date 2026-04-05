import { ChartPoint } from "@/types/eco";

interface LineChartProps {
  title: string;
  points: ChartPoint[];
  unit: string;
}

export function LineChart({ title, points, unit }: LineChartProps): JSX.Element {
  const width = 720;
  const height = 220;
  const padding = 32;

  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const spread = Math.max(max - min, 1);

  const path = points
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
      const y = height - padding - ((point.value - min) / spread) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          <p>Останні 12 вимірювань</p>
        </div>
        <span className="chart-unit">{unit}</span>
      </div>

      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {[0, 1, 2, 3].map((step) => {
          const y = padding + ((height - padding * 2) / 3) * step;
          return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} className="chart-grid" />;
        })}

        <path d={path} className="chart-line" />
        {points.map((point, index) => {
          const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
          const y = height - padding - ((point.value - min) / spread) * (height - padding * 2);

          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r="4" className="chart-dot" />
              <text x={x} y={height - 10} textAnchor="middle" className="chart-label">
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-range">
        <span>min: {min.toFixed(1)}</span>
        <span>max: {max.toFixed(1)}</span>
      </div>
    </section>
  );
}
