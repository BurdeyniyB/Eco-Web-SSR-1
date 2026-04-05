import { NextApiRequest, NextApiResponse } from "next";
import { sendError, sendSuccess } from "@/lib/api-utils";
import { getCurrentReadings } from "@/lib/eco-data";
import { ApiError, ApiSuccess, StationWithLatest } from "@/types/eco";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess<StationWithLatest[]> | ApiError>,
): void {
  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Дозволено лише GET запити.");
    return;
  }

  sendSuccess(res, getCurrentReadings());
}
