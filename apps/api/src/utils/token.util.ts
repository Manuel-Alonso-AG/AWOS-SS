import type { StringValue } from "ms";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpiresIn } from "../config/env.ts";

export interface TokenPayload {
    idUsuario: number;
    rol: "estudiante" | "institucion" | "administrador";
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn as StringValue,
    });
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
        return decoded;
    } catch {
        return null; // token inválido o expirado
    }
}
