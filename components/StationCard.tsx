import Link from "next/link";
import { getAqiLabel, getStationTypeLabel } from "@/lib/eco-data";
import { StationWithLatest } from "@/types/eco";

interface StationCardProps {
  station: StationWithLatest;
}

export function StationCard({ station }: StationCardProps): JSX.Element {
  const airState = getAqiLabel(station.latest.aqi);

  return (
    <article className="station-card">
      <div className="station-card-top">
        <div>
          <p className="station-city">{station.city}</p>
          <h3>{station.name}</h3>
        </div>

        <span className={`status-badge ${airState.tone}`}>{airState.label}</span>
      </div>

      <p className="station-description">{station.description}</p>

      <dl className="station-grid">
        <div>
          <dt>Тип</dt>
          <dd>{getStationTypeLabel(station.type)}</dd>
        </div>
        <div>
          <dt>AQI</dt>
          <dd>{station.latest.aqi}</dd>
        </div>
        <div>
          <dt>PM2.5</dt>
          <dd>{station.latest.pollutants.pm25} µg/m³</dd>
        </div>
        <div>
          <dt>NO₂</dt>
          <dd>{station.latest.pollutants.no2} µg/m³</dd>
        </div>
      </dl>

      <Link className="primary-link" href={`/stations/${station.id}`}>
        Деталі станції
      </Link>
    </article>
  );
}
