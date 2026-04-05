import { GetStaticProps } from "next";
import { Layout } from "@/components/Layout";

interface AboutPageProps {
  generatedAt: string;
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  return {
    props: {
      generatedAt: "2026-04-05T12:00:00Z",
    },
  };
};

export default function AboutPage({ generatedAt }: AboutPageProps): JSX.Element {
  return (
    <Layout title="Про проєкт — Eco Monitor SSR">
      <section className="section-header">
        <div>
          <p className="eyebrow">SSG сторінка</p>
          <h2>Про навчальний проєкт</h2>
        </div>
        <p>Ця сторінка генерується під час build-процесу і не потребує серверного обчислення на кожний запит.</p>
      </section>

      <section className="content-card prose">
        <p>
          Проєкт демонструє базову архітектуру веб-додатку для екологічного моніторингу, у якому
          поєднано TypeScript, Next.js, SSR, SSG та власні API endpoints.
        </p>
        <p>
          Головна сторінка та деталізація станції використовують SSR для відображення актуальних
          даних, а інформаційні матеріали винесені в SSG для максимально швидкого завантаження.
        </p>
        <p>
          Час генерації статичної сторінки:{" "}
          <strong>{new Date(generatedAt).toLocaleString("uk-UA", { timeZone: "UTC" })} UTC</strong>
        </p>
      </section>
    </Layout>
  );
}
