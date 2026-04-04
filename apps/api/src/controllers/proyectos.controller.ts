import { type Response } from "express";
import { sendSuccess, sendError } from "../utils/api.response.ts";
import { proyectosService } from "../services/proyectos.service.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import type { Modalidad } from "@awos-ss/types";

class ProyectosController {
    /** GET /api/proyectos  — pública, devuelve también la API key de Maps */
    async listar(req: AuthRequest, res: Response): Promise<void> {
        const { area, modalidad, lat, lng, radio } = req.query;

        try {
            const filtros = {
                ...(area !== undefined && { area: Number(area) }),
                ...(modalidad !== undefined && {
                    modalidad: modalidad as Modalidad,
                }),
                ...(lat !== undefined && { lat: Number(lat) }),
                ...(lng !== undefined && { lng: Number(lng) }),
                ...(radio !== undefined && { radio: Number(radio) }),
            };

            const resultado = await proyectosService.listar(filtros);

            sendSuccess(res, resultado, "Proyectos obtenidos");
        } catch {
            sendError(res, "Error al obtener proyectos", [], 500);
        }
    }

    /** GET /api/proyectos/areas  — pública */
    async areas(_req: AuthRequest, res: Response): Promise<void> {
        try {
            const areas = await proyectosService.areas();
            sendSuccess(res, areas, "Áreas obtenidas");
        } catch {
            sendError(res, "Error al obtener áreas", [], 500);
        }
    }

    /** GET /api/proyectos/mis-proyectos  🔒 institución */
    async misProyectos(req: AuthRequest, res: Response): Promise<void> {
        try {
            const proyectos = await proyectosService.misProyectos(
                req.usuario!.id_usuario,
            );
            sendSuccess(res, proyectos, "Mis proyectos obtenidos");
        } catch (err: any) {
            sendError(res, err.message ?? "Error", [], 404);
        }
    }

    /** GET /api/proyectos/:id  — pública */
    async detalle(req: AuthRequest, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            sendError(res, "ID inválido");
            return;
        }

        try {
            const proyecto = await proyectosService.detalle(id);
            sendSuccess(res, proyecto, "Proyecto obtenido");
        } catch (err: any) {
            sendError(res, err.message ?? "Error", [], 404);
        }
    }

    /** POST /api/proyectos  🔒 institución */
    async crear(req: AuthRequest, res: Response): Promise<void> {
        const {
            id_area,
            titulo,
            modalidad,
            horas_requeridas,
            plazas_total,
            direccion_proyecto,
            estatus,
        } = req.body;

        if (
            !id_area ||
            !titulo ||
            !modalidad ||
            !horas_requeridas ||
            !plazas_total ||
            !direccion_proyecto
        ) {
            sendError(res, "Todos los campos son obligatorios");
            return;
        }

        try {
            const resultado = await proyectosService.crear(
                req.usuario!.id_usuario,
                {
                    id_area: Number(id_area),
                    titulo,
                    modalidad,
                    horas_requeridas: Number(horas_requeridas),
                    plazas_total: Number(plazas_total),
                    direccion_proyecto,
                    estatus,
                },
            );
            sendSuccess(res, resultado, "Proyecto creado exitosamente", 201);
        } catch (err: any) {
            sendError(res, err.message ?? "Error al crear proyecto", [], 500);
        }
    }
}

export default new ProyectosController();
