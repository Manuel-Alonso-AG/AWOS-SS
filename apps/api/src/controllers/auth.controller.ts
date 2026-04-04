import { type Response } from "express";
import { sendSuccess, sendError } from "../utils/api.response.js";
import { generateToken } from "../utils/token.util.js";
import { authService } from "../services/auth.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

class AuthController {
    /** POST /api/auth/login */
    async login(req: AuthRequest, res: Response): Promise<void> {
        const { matricula, password } = req.body;

        if (!matricula || !password) {
            sendError(res, "Matrícula y contraseña son obligatorios");
            return;
        }

        try {
            const usuario = await authService.login(matricula, password);
            if (!usuario) {
                sendError(res, "Credenciales inválidas", [], 401);
                return;
            }

            const token = generateToken({
                id_usuario: usuario.id_usuario,
                rol: usuario.rol,
            });
            sendSuccess(res, { token, rol: usuario.rol }, "Login exitoso");
        } catch (err) {
            sendError(res, "Error al iniciar sesión", [], 500);
        }
    }

    /** POST /api/auth/registro/estudiante */
    async registrarEstudiante(req: AuthRequest, res: Response): Promise<void> {
        const { matricula, email, password } = req.body;

        if (!matricula || !email || !password) {
            sendError(res, "Matrícula, email y contraseña son obligatorios");
            return;
        }

        try {
            const id_usuario = await authService.registrarEstudiante(
                matricula,
                email,
                password,
            );
            sendSuccess(
                res,
                { id_usuario },
                "Estudiante registrado exitosamente",
                201,
            );
        } catch (err: any) {
            const esConflicto = err.message?.includes("ya está registrada");
            sendError(
                res,
                err.message ?? "Error al registrar",
                [],
                esConflicto ? 409 : 500,
            );
        }
    }

    /** POST /api/auth/registro/institucion */
    async registrarInstitucion(req: AuthRequest, res: Response): Promise<void> {
        const { matricula, email, password, nombre_legal, tipo, direccion } =
            req.body;

        if (
            !matricula ||
            !email ||
            !password ||
            !nombre_legal ||
            !tipo ||
            !direccion
        ) {
            sendError(res, "Todos los campos son obligatorios");
            return;
        }

        try {
            const ids = await authService.registrarInstitucion({
                matricula,
                email,
                password,
                nombre_legal,
                tipo,
                direccion,
            });
            sendSuccess(res, ids, "Institución registrada exitosamente", 201);
        } catch (err: any) {
            const esConflicto = err.message?.includes("ya está registrada");
            const esGeo = err.message?.includes("geocodificar");
            sendError(
                res,
                err.message ?? "Error al registrar",
                [],
                esConflicto ? 409 : esGeo ? 422 : 500,
            );
        }
    }

    /** GET /api/auth/perfil  🔒 cualquier rol */
    async perfil(req: AuthRequest, res: Response): Promise<void> {
        try {
            const perfil = await authService.getPerfil(req.usuario!.id_usuario);
            if (!perfil) {
                sendError(res, "Usuario no encontrado", [], 404);
                return;
            }
            sendSuccess(res, perfil, "Perfil obtenido");
        } catch {
            sendError(res, "Error al obtener perfil", [], 500);
        }
    }
}

export default new AuthController();
