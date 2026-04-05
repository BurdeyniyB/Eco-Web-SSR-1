import { NextApiResponse } from "next";
import { ApiError, ApiSuccess } from "@/types/eco";

export function sendSuccess<T>(res: NextApiResponse<ApiSuccess<T>>, data: T, meta?: ApiSuccess<T>["meta"]): void {
  res.status(200).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: NextApiResponse<ApiError>,
  status: number,
  code: string,
  message: string,
  details?: string,
): void {
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

export function toPositiveInteger(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
