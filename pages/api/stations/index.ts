import { NextApiRequest, NextApiResponse } from "next";
import { sendError, sendSuccess, toPositiveInteger } from "@/lib/api-utils";
import { queryStations } from "@/lib/eco-data";
import { ApiError, ApiSuccess, StationWithLatest, StationsQuery } from "@/types/eco";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess<StationWithLatest[]> | ApiError>,
): void {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Дозволено лише GET запити.");
    return;
  }

  const query: StationsQuery = {
    type: typeof req.query.type === "string" ? (req.query.type as StationsQuery["type"]) : undefined,
    city: typeof req.query.city === "string" ? req.query.city : undefined,
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    sort: typeof req.query.sort === "string" ? (req.query.sort as StationsQuery["sort"]) : "name",
    order: typeof req.query.order === "string" ? (req.query.order as StationsQuery["order"]) : "asc",
    page: toPositiveInteger(req.query.page, 1),
    size: Math.min(toPositiveInteger(req.query.size, 10), 50),
  };

  const result = queryStations(query);

  sendSuccess(res, result.items, {
    page: query.page ?? 1,
    size: query.size ?? 10,
    total: result.total,
    totalPages: Math.max(1, Math.ceil(result.total / (query.size ?? 10))),
  });
}
