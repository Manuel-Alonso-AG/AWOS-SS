import { type Response } from "express";
import { type ApiResponse } from "@awos-ss/types";

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Operacion exitosa",
): void {
    const response: ApiResponse<T> = {
        data,
        success: true,
        message,
    };
    res.status(200).json(response);
}

export function sendError(
    res: Response,
    message = "Operacion fallida",
    errors: string[] = [],
    statusCode = 400,
): void {
    const response: ApiResponse<null> = {
        data: null,
        success: false,
        message,
        errors,
    };
    res.status(statusCode).json(response);
}
