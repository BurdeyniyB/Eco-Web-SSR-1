import { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { LineChart } from "@/components/LineChart";
import {
  getAqiLabel,
  getChartSeries,
  getMeasurementsByStation,
  getPollutantDefinitions,
  getStationById,
} from "@/lib/eco-data";
import { MeasurementPoint, MonitoringStation } from "@/types/eco";

interface StationDetailsPageProps {
  station: MonitoringStation;
  measurements: MeasurementPoint[];
}

export const getServerSideProps: GetServerSideProps<StationDetailsPageProps> = async (context) => {
  const stationId = String(context.params?.id ?? "");
  const station = getStationById(stationId);

  if (!station) {
    return { notFound: true };
  }

  return {
    props: {
      station,
      measurements: getMeasurementsByStation(stationId, { limit: 24 }),
    },
  };
};

export default function StationDetailsPage({
  station,
  measurements,
}: StationDetailsPageProps): JSX.Element {
  const latest = measurements.at(-1);
  if (!latest) {
    return (
      <Layout title={`${station.name} — Дані відсутні`}>
        <p>Для станції ще немає вимірювань.</p>
      </Layout>
    );
  }

  const aqiState = getAqiLabel(latest.aqi);
  const pollutantDefinitions = getPollutantDefinitions();

  return (
    <Layout title={`${station.name} — Деталі станції`}>
      <div className="page-actions">
        <Link href="/" className="ghost-link">
          ← Назад до списку
        </Link>
      </div>

      <section className="details-hero">
        <div>
          <p className="eyebrow">SSR + динамічний роутинг</p>
          <h2>{station.name}</h2>
          <p className="lead">{station.description}</p>
        </div>

        <div className={`details-aqi ${aqiState.tone}`}>
          <span>AQI</span>
          <strong>{latest.aqi}</strong>
          <p>{aqiState.label}</p>
        </div>
      </section>

      <section className="details-grid">
        <article className="info-card">
          <h3>Інформація про станцію</h3>
          <dl className="compact-grid">
            <div>
              <dt>Місто</dt>
              <dd>{station.city}</dd>
            </div>
            <div>
              <dt>Координати</dt>
              <dd>
                {station.coordinates.lat}, {station.coordinates.lon}
              </dd>
            </div>
            <div>
              <dt>Висота</dt>
              <dd>{station.elevation} м</dd>
            </div>
            <div>
              <dt>Останнє оновлення</dt>
              <dd>{new Date(latest.timestamp).toLocaleString("uk-UA", { timeZone: "UTC" })} UTC</dd>
            </div>
          </dl>
        </article>

        <article className="info-card">
          <h3>Поточні показники</h3>
          <div className="pollutants-grid">
            {pollutantDefinitions.map((pollutant) => (
              <div key={pollutant.key} className="pollutant-item">
                <span>{pollutant.label}</span>
                <strong>
                  {latest.pollutants[pollutant.key]} {pollutant.unit}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="charts-layout">
        <LineChart title="PM2.5 за останні 12 годин" points={getChartSeries(station.id, "pm25")} unit="µg/m³" />
        <LineChart title="NO₂ за останні 12 годин" points={getChartSeries(station.id, "no2")} unit="µg/m³" />
      </section>
    </Layout>
  );
}
