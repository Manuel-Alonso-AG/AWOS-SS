import { type Response } from "express";
import { sendSuccess, sendError } from "../utils/api.response.js";
import { horasService } from "../services/horas.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

class HorasController {
    /** POST /api/horas  🔒 estudiante */
    async registrar(req: AuthRequest, res: Response): Promise<void> {
        const {
            id_postulacion,
            fecha_actividad,
            horas,
            descripcion,
            evidencia_url,
        } = req.body;

        if (
            !id_postulacion ||
            !fecha_actividad ||
            !horas ||
            !descripcion ||
            !evidencia_url
        ) {
            sendError(res, "Todos los campos son obligatorios");
            return;
        }

        try {
            const resultado = await horasService.registrar(
                req.usuario!.id_usuario,
                {
                    id_postulacion: Number(id_postulacion),
                    fecha_actividad,
                    horas: Number(horas),
                    descripcion,
                    evidencia_url,
                },
            );
            sendSuccess(res, resultado, "Horas registradas exitosamente", 201);
        } catch (err: any) {
            sendError(res, err.message ?? "Error al registrar horas", [], 400);
        }
    }

    /** PATCH /api/horas/:id/validar  🔒 institución */
    async validar(req: AuthRequest, res: Response): Promise<void> {
        const id_registro = Number(req.params.id);
        const { validado } = req.body;

        if (isNaN(id_registro)) {
            sendError(res, "ID inválido");
            return;
        }
        if (typeof validado !== "boolean") {
            sendError(res, "El campo 'validado' debe ser true o false");
            return;
        }

        try {
            const resultado = await horasService.validar(
                id_registro,
                validado,
                req.usuario!.id_usuario,
            );
            sendSuccess(
                res,
                resultado,
                `Horas ${validado ? "validadas" : "rechazadas"} correctamente`,
            );
        } catch (err: any) {
            const status = err.message?.includes("permisos") ? 403 : 400;
            sendError(res, err.message ?? "Error al validar", [], status);
        }
    }

    /** GET /api/horas/kardex/:matricula  🔒 cualquier rol */
    async kardex(req: AuthRequest, res: Response): Promise<void> {
        const { matricula } = req.params;

        if (!matricula || Array.isArray(matricula)) {
            sendError(res, "Matrícula inválida");
            return;
        }

        try {
            const kardex = await horasService.kardex(
                matricula,
                req.usuario!.id_usuario,
                req.usuario!.rol,
            );
            sendSuccess(res, kardex, "Kardex obtenido");
        } catch (err: any) {
            const status = err.message?.includes("Acceso denegado") ? 403 : 404;
            sendError(
                res,
                err.message ?? "Error al obtener kardex",
                [],
                status,
            );
        }
    }

    /** GET /api/horas/pendientes  🔒 institución */
    async pendientes(req: AuthRequest, res: Response): Promise<void> {
        try {
            const pendientes = await horasService.pendientes(
                req.usuario!.id_usuario,
            );
            sendSuccess(res, pendientes, "Horas pendientes obtenidas");
        } catch (err: any) {
            sendError(res, err.message ?? "Error", [], 404);
        }
    }
}

export default new HorasController();
