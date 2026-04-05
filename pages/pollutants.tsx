import { GetStaticProps } from "next";
import { Layout } from "@/components/Layout";
import { getPollutantDefinitions } from "@/lib/eco-data";
import { PollutantDefinition } from "@/types/eco";

interface PollutantsPageProps {
  pollutants: PollutantDefinition[];
}

export const getStaticProps: GetStaticProps<PollutantsPageProps> = async () => {
  return {
    props: {
      pollutants: getPollutantDefinitions(),
    },
  };
};

export default function PollutantsPage({ pollutants }: PollutantsPageProps): JSX.Element {
  return (
    <Layout title="Довідник забруднювачів — Eco Monitor SSR">
      <section className="section-header">
        <div>
          <p className="eyebrow">SSG сторінка</p>
          <h2>Довідник типів забруднювачів</h2>
        </div>
        <p>Довідкова інформація змінюється рідко, тому доцільно рендерити її статично.</p>
      </section>

      <div className="reference-grid">
        {pollutants.map((pollutant) => (
          <article key={pollutant.key} className="reference-card">
            <p className="eyebrow">{pollutant.unit}</p>
            <h3>{pollutant.label}</h3>
            <p>{pollutant.description}</p>
            <div className="safe-range">Рекомендований діапазон: {pollutant.safeRange}</div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
