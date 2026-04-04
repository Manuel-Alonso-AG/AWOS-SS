import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/token.util.js";
import type { Rol, TokenPayload } from "@awos-ss/types";

// Extiende Request para adjuntar el usuario decodificado del JWT
export interface AuthRequest extends Request {
    usuario?: TokenPayload;
}

/** Verifica que el header Authorization contenga un Bearer token válido */
export const verificarToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Token requerido" });
        return;
    }

    const token = authHeader.split(" ")[1]!;
    const payload = verifyToken(token);

    if (!payload) {
        res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
        });
        return;
    }

    req.usuario = payload;
    next();
};

/** Factory: crea un middleware que acepta sólo los roles indicados */
export const verificarRol =
    (...roles: Rol[]) =>
    (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            res.status(403).json({
                success: false,
                message: "Acceso denegado",
            });
            return;
        }
        next();
    };
