# Лабораторна робота №1 — Next.js + TypeScript + SSR

## Що реалізовано
- **Next.js проєкт з TypeScript** і суворою типізацією (`strict`, `noImplicitAny`, `strictNullChecks`).
- **Логічна структура каталогів**: `components`, `pages`, `pages/api`, `types`, `lib`, `styles`.
- **SSR-сторінки**:
  - `/` — список станцій моніторингу та загальна статистика.
  - `/stations/[id]` — деталізація станції з динамічним маршрутом та графіками.
- **SSG-сторінки**:
  - `/about` — інформація про проєкт.
  - `/pollutants` — довідник типів забруднювачів.
- **API endpoints**:
  - `GET /api/stations`
  - `GET /api/stations/:id`
  - `GET /api/measurements?stationId=...`
  - `GET /api/current`
- **Тестові дані** для 6 станцій і 24-годинних часових рядів.

## Чому використано Pages Router
Для цієї лабораторної свідомо використано **Pages Router**, оскільки він наочно показує
`getServerSideProps` і `getStaticProps`, які прямо демонструють SSR та SSG у межах навчального завдання.

## Структура проєкту
```text
eco-monitoring-lab1/
├── components/
│   ├── Layout.tsx
│   ├── LineChart.tsx
│   ├── MetricCard.tsx
│   └── StationCard.tsx
├── lib/
│   ├── api-utils.ts
│   └── eco-data.ts
├── pages/
│   ├── api/
│   │   ├── current.ts
│   │   ├── measurements.ts
│   │   └── stations/
│   │       ├── [id].ts
│   │       └── index.ts
│   ├── stations/
│   │   └── [id].tsx
│   ├── _app.tsx
│   ├── about.tsx
│   ├── index.tsx
│   └── pollutants.tsx
├── styles/
│   └── globals.css
├── types/
│   └── eco.ts
├── next-env.d.ts
├── package.json
├── README.md
└── tsconfig.json
```

## Як запустити
```bash
npm install
npm run dev
```

Після цього сторінки будуть доступні за адресою `http://localhost:3000`.

## Приклади API-запитів
```bash
curl http://localhost:3000/api/current
curl "http://localhost:3000/api/stations?page=1&size=3&sort=aqi&order=desc"
curl "http://localhost:3000/api/stations/kyiv-center"
curl "http://localhost:3000/api/measurements?stationId=lviv-park&limit=12"
```
