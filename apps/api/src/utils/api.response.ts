import { type Response } from "express";
import type { ApiResponse } from "@awos-ss/types";

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Operación exitosa",
    statusCode = 200,
): void {
    const response: ApiResponse<T> = { success: true, message, data };
    res.status(statusCode).json(response);
}

export function sendError(
    res: Response,
    message = "Operación fallida",
    errors: string[] = [],
    statusCode = 400,
): void {
    const response: ApiResponse<null> = { success: false, message, errors };
    res.status(statusCode).json(response);
}
