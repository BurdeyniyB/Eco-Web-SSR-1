import { NextApiRequest, NextApiResponse } from "next";
import { sendError, sendSuccess } from "@/lib/api-utils";
import { getStationById, getMeasurementsByStation } from "@/lib/eco-data";
import { ApiError, ApiSuccess, MeasurementPoint, MonitoringStation } from "@/types/eco";

interface StationDetailsResponse extends MonitoringStation {
  measurements: MeasurementPoint[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess<StationDetailsResponse> | ApiError>,
): void {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Дозволено лише GET запити.");
    return;
  }

  const stationId = String(req.query.id ?? "");
  const station = getStationById(stationId);

  if (!station) {
    sendError(res, 404, "NOT_FOUND", "Станцію не знайдено.");
    return;
  }

  sendSuccess(res, {
    ...station,
    measurements: getMeasurementsByStation(stationId, { limit: 24 }),
  });
}
