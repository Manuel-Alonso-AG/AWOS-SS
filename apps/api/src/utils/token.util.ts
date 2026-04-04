import type { StringValue } from "ms";
import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpiresIn } from "../config/env.js";
import type { TokenPayload } from "@awos-ss/types";

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn as StringValue,
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, jwtSecret) as TokenPayload;
    } catch {
        return null;
    }
}
