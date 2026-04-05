import { NextApiRequest, NextApiResponse } from "next";
import { sendError, sendSuccess, toPositiveInteger } from "@/lib/api-utils";
import { getMeasurementsByStation, getStationById } from "@/lib/eco-data";
import { ApiError, ApiSuccess, MeasurementPoint } from "@/types/eco";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess<MeasurementPoint[]> | ApiError>,
): void {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Дозволено лише GET запити.");
    return;
  }

  const stationId = typeof req.query.stationId === "string" ? req.query.stationId : "";

  if (!stationId) {
    sendError(res, 400, "VALIDATION_ERROR", "Параметр stationId є обов’язковим.");
    return;
  }

  if (!getStationById(stationId)) {
    sendError(res, 404, "NOT_FOUND", "Станцію не знайдено.");
    return;
  }

  const limit = Math.min(toPositiveInteger(req.query.limit, 24), 168);
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;

  sendSuccess(res, getMeasurementsByStation(stationId, { from, to, limit }));
}
