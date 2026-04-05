import {
  AirQualitySummary,
  MeasurementPoint,
  MonitoringStation,
  PollutantDefinition,
  PollutantKey,
  PollutantReadings,
  StationType,
  StationWithLatest,
  StationsQuery,
} from "@/types/eco";

interface StationSeed {
  station: MonitoringStation;
  base: PollutantReadings;
}

const pollutantDefinitions: PollutantDefinition[] = [
  {
    key: "pm25",
    label: "PM2.5",
    unit: "µg/m³",
    safeRange: "0–15",
    description: "Дрібнодисперсний пил, що найсильніше впливає на дихальну систему.",
  },
  {
    key: "pm10",
    label: "PM10",
    unit: "µg/m³",
    safeRange: "0–45",
    description: "Завислі частинки більшого розміру, типові для транспорту і будівництва.",
  },
  {
    key: "no2",
    label: "NO₂",
    unit: "µg/m³",
    safeRange: "0–40",
    description: "Діоксид азоту, пов’язаний із транспортними викидами та промисловістю.",
  },
  {
    key: "so2",
    label: "SO₂",
    unit: "µg/m³",
    safeRange: "0–20",
    description: "Діоксид сірки, характерний для енергетики та промислових джерел.",
  },
  {
    key: "o3",
    label: "O₃",
    unit: "µg/m³",
    safeRange: "0–100",
    description: "Приземний озон, що формується фотохімічними реакціями у сонячну погоду.",
  },
  {
    key: "co",
    label: "CO",
    unit: "mg/m³",
    safeRange: "0–4",
    description: "Чадний газ, індикатор неповного згоряння палива.",
  },
];

const stationSeeds: StationSeed[] = [
  {
    station: {
      id: "kyiv-center",
      name: "Київ Центр",
      city: "Київ",
      type: "urban",
      coordinates: { lat: 50.4501, lon: 30.5234 },
      description: "Міська станція з інтенсивним змішаним впливом транспорту та житлової забудови.",
      elevation: 179,
      isActive: true,
    },
    base: { pm25: 24, pm10: 39, no2: 34, so2: 9, o3: 52, co: 1.3 },
  },
  {
    station: {
      id: "kharkiv-industrial",
      name: "Харків Індустріальний",
      city: "Харків",
      type: "industrial",
      coordinates: { lat: 49.9935, lon: 36.2304 },
      description: "Промислова станція для контролю викидів у виробничому районі.",
      elevation: 152,
      isActive: true,
    },
    base: { pm25: 31, pm10: 48, no2: 29, so2: 16, o3: 41, co: 1.7 },
  },
  {
    station: {
      id: "lviv-park",
      name: "Львів Парк",
      city: "Львів",
      type: "park",
      coordinates: { lat: 49.8397, lon: 24.0297 },
      description: "Фонова станція в зеленій зоні для порівняння з урбанізованими районами.",
      elevation: 289,
      isActive: true,
    },
    base: { pm25: 14, pm10: 25, no2: 17, so2: 6, o3: 58, co: 0.8 },
  },
  {
    station: {
      id: "dnipro-traffic",
      name: "Дніпро Транспортна",
      city: "Дніпро",
      type: "traffic",
      coordinates: { lat: 48.4647, lon: 35.0462 },
      description: "Станція поруч із транспортною розв’язкою для контролю пікових навантажень.",
      elevation: 141,
      isActive: true,
    },
    base: { pm25: 27, pm10: 44, no2: 37, so2: 11, o3: 46, co: 1.5 },
  },
  {
    station: {
      id: "odesa-port",
      name: "Одеса Порт",
      city: "Одеса",
      type: "suburban",
      coordinates: { lat: 46.4825, lon: 30.7233 },
      description: "Припортова станція з впливом логістики, морських вітрів і перевантаження вантажів.",
      elevation: 42,
      isActive: true,
    },
    base: { pm25: 20, pm10: 34, no2: 23, so2: 13, o3: 49, co: 1.1 },
  },
  {
    station: {
      id: "vinnytsia-background",
      name: "Вінниця Фонова",
      city: "Вінниця",
      type: "background",
      coordinates: { lat: 49.2331, lon: 28.4682 },
      description: "Фонова станція для оцінки регіонального стану повітря без локальних піків.",
      elevation: 241,
      isActive: true,
    },
    base: { pm25: 11, pm10: 21, no2: 12, so2: 5, o3: 55, co: 0.7 },
  },
];

const POLLUTANT_LIMITS: Record<PollutantKey, number> = {
  pm25: 25,
  pm10: 50,
  no2: 40,
  so2: 20,
  o3: 100,
  co: 4,
};

const HOURS = 24;

function round(value: number, digits = 1): number {
  return Number(value.toFixed(digits));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateAqi(readings: PollutantReadings): number {
  const normalized = Object.entries(readings).map(([key, value]) => {
    const limit = POLLUTANT_LIMITS[key as PollutantKey];
    return (value / limit) * 100;
  });

  const aqi = Math.round(Math.max(...normalized));
  return clamp(aqi, 15, 250);
}

function vary(base: number, hourIndex: number, stationOffset: number, amplitude: number): number {
  const wave =
    Math.sin((hourIndex + stationOffset) / 2.6) * amplitude +
    Math.cos((hourIndex + stationOffset) / 5.1) * amplitude * 0.45;
  return base + wave;
}

function buildSeries(seed: StationSeed, stationOffset: number): MeasurementPoint[] {
  const end = new Date("2026-04-05T12:00:00Z");
  const items: MeasurementPoint[] = [];

  for (let i = HOURS - 1; i >= 0; i -= 1) {
    const date = new Date(end);
    date.setUTCHours(end.getUTCHours() - i);

    const pollutants: PollutantReadings = {
      pm25: round(clamp(vary(seed.base.pm25, i, stationOffset, 5), 6, 90)),
      pm10: round(clamp(vary(seed.base.pm10, i, stationOffset, 7), 10, 130)),
      no2: round(clamp(vary(seed.base.no2, i, stationOffset, 6), 5, 100)),
      so2: round(clamp(vary(seed.base.so2, i, stationOffset, 2.8), 1, 40)),
      o3: round(clamp(vary(seed.base.o3, i, stationOffset, 8), 15, 140)),
      co: round(clamp(vary(seed.base.co, i, stationOffset, 0.22), 0.2, 8), 2),
    };

    items.push({
      timestamp: date.toISOString(),
      pollutants,
      temperature: round(clamp(vary(17 + stationOffset * 0.8, i, stationOffset, 3.4), 9, 29)),
      humidity: round(clamp(vary(58 - stationOffset * 1.4, i, stationOffset, 6.5), 32, 91)),
      pressure: round(clamp(vary(1012 + stationOffset * 0.6, i, stationOffset, 2.4), 999, 1028)),
      aqi: calculateAqi(pollutants),
    });
  }

  return items;
}

const seriesMap = Object.fromEntries(
  stationSeeds.map((seed, index) => [seed.station.id, buildSeries(seed, index + 1)]),
) as Record<string, MeasurementPoint[]>;

export function getPollutantDefinitions(): PollutantDefinition[] {
  return pollutantDefinitions;
}

export function getStations(): MonitoringStation[] {
  return stationSeeds.map((entry) => entry.station);
}

export function getStationById(stationId: string): MonitoringStation | undefined {
  return getStations().find((station) => station.id === stationId);
}

export function getMeasurementsByStation(
  stationId: string,
  options?: { from?: string; to?: string; limit?: number },
): MeasurementPoint[] {
  const source = seriesMap[stationId] ?? [];
  const fromDate = options?.from ? new Date(options.from) : undefined;
  const toDate = options?.to ? new Date(options.to) : undefined;

  const filtered = source.filter((point) => {
    const pointDate = new Date(point.timestamp);
    if (fromDate && pointDate < fromDate) return false;
    if (toDate && pointDate > toDate) return false;
    return true;
  });

  if (options?.limit && options.limit > 0) {
    return filtered.slice(-options.limit);
  }

  return filtered;
}

export function getStationsWithLatest(): StationWithLatest[] {
  return stationSeeds.map((seed) => {
    const latest = seriesMap[seed.station.id]?.at(-1);
    if (!latest) {
      throw new Error(`No measurements found for station ${seed.station.id}`);
    }

    return {
      ...seed.station,
      latest,
    };
  });
}

export function getCurrentReadings(): StationWithLatest[] {
  return getStationsWithLatest();
}

export function getAirQualitySummary(): AirQualitySummary {
  const stations = getStationsWithLatest();
  const sorted = [...stations].sort((a, b) => a.latest.aqi - b.latest.aqi);
  const measurementsToday = stations.reduce(
    (accumulator, station) => accumulator + getMeasurementsByStation(station.id).length,
    0,
  );

  const averageAqi = Math.round(
    stations.reduce((accumulator, station) => accumulator + station.latest.aqi, 0) / stations.length,
  );

  return {
    stationCount: stations.length,
    averageAqi,
    bestStation: {
      id: sorted[0]!.id,
      name: sorted[0]!.name,
      aqi: sorted[0]!.latest.aqi,
    },
    worstStation: {
      id: sorted.at(-1)!.id,
      name: sorted.at(-1)!.name,
      aqi: sorted.at(-1)!.latest.aqi,
    },
    measurementsToday,
  };
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, "uk");
}

export function queryStations(query: StationsQuery): { items: StationWithLatest[]; total: number } {
  const page = query.page && query.page > 0 ? query.page : 1;
  const size = query.size && query.size > 0 ? query.size : 10;
  const orderFactor = query.order === "desc" ? -1 : 1;

  let result = getStationsWithLatest();

  if (query.type) {
    result = result.filter((station) => station.type === query.type);
  }

  if (query.city) {
    result = result.filter((station) => station.city.toLowerCase() === query.city!.toLowerCase());
  }

  if (query.search) {
    const search = query.search.toLowerCase();
    result = result.filter(
      (station) =>
        station.name.toLowerCase().includes(search) ||
        station.city.toLowerCase().includes(search) ||
        station.description.toLowerCase().includes(search),
    );
  }

  if (query.sort === "aqi") {
    result = result.sort((left, right) => (left.latest.aqi - right.latest.aqi) * orderFactor);
  } else if (query.sort === "city") {
    result = result.sort((left, right) => compareStrings(left.city, right.city) * orderFactor);
  } else {
    result = result.sort((left, right) => compareStrings(left.name, right.name) * orderFactor);
  }

  const total = result.length;
  const start = (page - 1) * size;
  const end = start + size;

  return {
    items: result.slice(start, end),
    total,
  };
}

export function getAqiLabel(aqi: number): { label: string; tone: string } {
  if (aqi <= 50) return { label: "Добра", tone: "good" };
  if (aqi <= 100) return { label: "Помірна", tone: "moderate" };
  if (aqi <= 150) return { label: "Незадовільна для чутливих груп", tone: "warning" };
  return { label: "Погана", tone: "danger" };
}

export function getStationTypeLabel(type: StationType): string {
  const dictionary: Record<StationType, string> = {
    urban: "Міська",
    industrial: "Промислова",
    traffic: "Транспортна",
    suburban: "Приміська",
    background: "Фонова",
    park: "Паркова",
  };

  return dictionary[type];
}

export function getChartSeries(stationId: string, key: PollutantKey): Array<{ label: string; value: number }> {
  return getMeasurementsByStation(stationId, { limit: 12 }).map((point) => ({
    label: new Date(point.timestamp).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }),
    value: point.pollutants[key],
  }));
}
