import { type Request, type Response } from "express";
import { sendError, sendSuccess } from "../utils/api.response";
import { loginUsuario, registarUsuario } from "../services/auth.service";
import { generateToken } from "../utils/token.util";

class AuthController {
    constructor() {}

    async login(req: Request, res: Response): Promise<void> {
        const { matricula, password } = req.body;

        if (!matricula || !password)
            return sendError(res, "Matricula o contraseña vacia", [
                "Campos obligatorios",
            ]);

        const usuario = await loginUsuario(matricula, password);
        if (!usuario) return sendError(res, "Usuario no encontrado");

        const token = generateToken({
            idUsuario: usuario.id,
            rol: usuario.rol,
        });
        sendSuccess(res, { token }, "Login exitoso");
    }

    async registrarEstudiante(req: Request, res: Response): Promise<void> {
        const { matricula, email, password } = req.body;

        if (!matricula || !email || !password)
            return sendError(res, "Matricula, email o contraseña vacia", [
                "Campos obligatorios",
            ]);

        const usuarioId = await registarUsuario(
            matricula,
            email,
            password,
            "estudiante",
        );

        if (usuarioId != null) return sendError(res, "Usuario ya registrado");

        sendSuccess(res, { usuarioId }, "Registro de estudiante exitoso");
    }

    async registrarInstitucion(req: Request, res: Response): Promise<void> {
        const {
            nombre,
            matricula,
            email,
            password,
            nombreLegal,
            tipo,
            direccion,
        } = req.body;
        if (
            !nombre ||
            !matricula ||
            !email ||
            !password ||
            !nombreLegal ||
            !tipo ||
            !direccion
        ) {
            res.status(400).json({
                ok: false,
                error: "Faltan campos requeridos",
            });
            return;
        }
    }

    async perfil(req: Request, res: Response): Promise<void> {
        sendSuccess(res, {}, "Datos del perfil");
    }
}

export default new AuthController();
