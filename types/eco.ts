export type StationType =
  | "urban"
  | "industrial"
  | "traffic"
  | "suburban"
  | "background"
  | "park";

export type PollutantKey = "pm25" | "pm10" | "no2" | "so2" | "o3" | "co";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface MonitoringStation {
  id: string;
  name: string;
  city: string;
  type: StationType;
  coordinates: Coordinates;
  description: string;
  elevation: number;
  isActive: boolean;
}

export interface PollutantReadings {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
}

export interface MeasurementPoint {
  timestamp: string;
  pollutants: PollutantReadings;
  temperature: number;
  humidity: number;
  pressure: number;
  aqi: number;
}

export interface StationWithLatest extends MonitoringStation {
  latest: MeasurementPoint;
}

export interface AirQualitySummary {
  stationCount: number;
  averageAqi: number;
  worstStation: { id: string; name: string; aqi: number };
  bestStation: { id: string; name: string; aqi: number };
  measurementsToday: number;
}

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface StationsQuery {
  type?: StationType;
  city?: string;
  search?: string;
  sort?: "name" | "aqi" | "city";
  order?: "asc" | "desc";
  page?: number;
  size?: number;
}

export interface MeasurementsQuery {
  stationId: string;
  from?: string;
  to?: string;
  limit?: number;
}

export interface PollutantDefinition {
  key: PollutantKey;
  label: string;
  unit: string;
  safeRange: string;
  description: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}
