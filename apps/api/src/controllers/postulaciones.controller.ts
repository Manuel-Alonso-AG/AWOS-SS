import { type Response } from "express";
import { sendSuccess, sendError } from "../utils/api.response.js";
import { postulacionesService } from "../services/postulaciones.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

class PostulacionesController {
    /** POST /api/postulaciones  🔒 estudiante */
    async postular(req: AuthRequest, res: Response): Promise<void> {
        const { id_proyecto, carta_motivacion } = req.body;

        if (!id_proyecto || !carta_motivacion) {
            sendError(res, "id_proyecto y carta_motivacion son obligatorios");
            return;
        }

        try {
            const resultado = await postulacionesService.postular(
                req.usuario!.id_usuario,
                Number(id_proyecto),
                carta_motivacion,
            );
            sendSuccess(
                res,
                resultado,
                "Postulación enviada exitosamente",
                201,
            );
        } catch (err: any) {
            const status = err.message?.includes("Ya existe") ? 409 : 400;
            sendError(res, err.message ?? "Error al postularse", [], status);
        }
    }

    /** GET /api/postulaciones/mis  🔒 estudiante */
    async misPostulaciones(req: AuthRequest, res: Response): Promise<void> {
        try {
            const postulaciones = await postulacionesService.misPostulaciones(
                req.usuario!.id_usuario,
            );
            sendSuccess(res, postulaciones, "Postulaciones obtenidas");
        } catch {
            sendError(res, "Error al obtener postulaciones", [], 500);
        }
    }

    /** GET /api/postulaciones/proyecto/:id  🔒 institución */
    async postulacionesDeProyecto(
        req: AuthRequest,
        res: Response,
    ): Promise<void> {
        const id_proyecto = Number(req.params.id);
        if (isNaN(id_proyecto)) {
            sendError(res, "ID inválido");
            return;
        }

        try {
            const lista = await postulacionesService.postulacionesDeProyecto(
                id_proyecto,
                req.usuario!.id_usuario,
            );
            sendSuccess(res, lista, "Postulaciones del proyecto obtenidas");
        } catch (err: any) {
            const status = err.message?.includes("permisos") ? 403 : 404;
            sendError(res, err.message ?? "Error", [], status);
        }
    }

    /** PATCH /api/postulaciones/:id/responder  🔒 institución */
    async responder(req: AuthRequest, res: Response): Promise<void> {
        const id_postulacion = Number(req.params.id);
        const { estatus } = req.body;

        if (isNaN(id_postulacion)) {
            sendError(res, "ID inválido");
            return;
        }
        if (estatus !== "aceptada" && estatus !== "rechazada") {
            sendError(res, "El estatus debe ser 'aceptada' o 'rechazada'");
            return;
        }

        try {
            const resultado = await postulacionesService.responder(
                id_postulacion,
                estatus,
                req.usuario!.id_usuario,
            );
            sendSuccess(res, resultado, `Postulación ${estatus} correctamente`);
        } catch (err: any) {
            const status = err.message?.includes("permisos") ? 403 : 400;
            sendError(res, err.message ?? "Error al responder", [], status);
        }
    }
}

export default new PostulacionesController();
