import { GetServerSideProps } from "next";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { StationCard } from "@/components/StationCard";
import { getAirQualitySummary, getStationsWithLatest } from "@/lib/eco-data";
import { AirQualitySummary, StationWithLatest } from "@/types/eco";

interface HomePageProps {
  stations: StationWithLatest[];
  summary: AirQualitySummary;
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const stations = getStationsWithLatest();
  const summary = getAirQualitySummary();

  return {
    props: {
      stations,
      summary,
    },
  };
};

export default function HomePage({ stations, summary }: HomePageProps): JSX.Element {
  return (
    <Layout title="Eco Monitor SSR — Головна">
      <section className="hero">
        <div>
          <p className="eyebrow">SSR сторінка</p>
          <h2>Моніторинг якості повітря по містах України</h2>
          <p className="lead">
            Дані станцій і загальна статистика завантажуються на сервері при кожному запиті сторінки.
          </p>
        </div>

        <div className="hero-note">
          <p>Оновлення даних</p>
          <strong>щогодини</strong>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard title="Кількість станцій" value={summary.stationCount} hint="Активні точки моніторингу" />
        <MetricCard title="Середній AQI" value={summary.averageAqi} hint="Поточна загальна оцінка" />
        <MetricCard title="Найкращий стан" value={summary.bestStation.name} hint={`AQI ${summary.bestStation.aqi}`} />
        <MetricCard title="Найгірший стан" value={summary.worstStation.name} hint={`AQI ${summary.worstStation.aqi}`} />
      </section>

      <section className="section-header">
        <div>
          <p className="eyebrow">Список станцій</p>
          <h2>Поточні показники</h2>
        </div>
        <p>Для кожної станції відображається останній доступний набір показників і швидкий перехід до деталізації.</p>
      </section>

      <section className="station-cards">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </section>
    </Layout>
  );
}
