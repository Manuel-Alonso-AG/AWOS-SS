import { jwtSecret } from "../config/env.ts";
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    usuario?: { id: number; rol: string; email: string };
}

export const verificarToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ ok: false, error: "Token requerido" });
        return;
    }

    const token = authHeader.split(" ")[1]!;
    try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        req.usuario = {
            id: decoded.id,
            rol: decoded.rol,
            email: decoded.email,
        };
        next();
    } catch {
        res.status(401).json({ ok: false, error: "Token inválido o expirado" });
        return;
    }
};

export const verificarRol =
    (...roles: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            res.status(403).json({ ok: false, error: "Acceso denegado" });
            return;
        }
        next();
    };
