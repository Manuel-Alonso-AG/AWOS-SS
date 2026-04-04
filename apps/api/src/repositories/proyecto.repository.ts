import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { Area, Proyecto, VistaProyectoMapa } from "@awos-ss/types";

export const proyectoRepository = {
    /** Lista proyectos desde la vista del mapa (ya filtrada por estatus=publicado) */
    async findAllMapa(): Promise<VistaProyectoMapa[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM vista_proyectos_mapa",
        );
        return rows as VistaProyectoMapa[];
    },

    async findById(id: number): Promise<Proyecto | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM proyectos WHERE id_proyecto = ?",
            [id],
        );
        return (rows[0] as Proyecto) ?? null;
    },

    /** Proyectos de una institución con conteo de postulaciones */
    async findByInstitucion(id_institucion: number): Promise<RowDataPacket[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT p.*,
              COUNT(ps.id_postulacion) AS total_postulaciones
       FROM proyectos p
       LEFT JOIN postulaciones ps ON p.id_proyecto = ps.id_proyecto
       WHERE p.id_institucion = ?
       GROUP BY p.id_proyecto`,
            [id_institucion],
        );
        return rows;
    },

    async create(
        data: Omit<Proyecto, "id_proyecto" | "plazas_ocupadas">,
    ): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO proyectos
         (id_institucion, id_area, titulo, modalidad, horas_requeridas,
          plazas_total, estatus, lat, lng, direccion_proyecto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id_institucion,
                data.id_area,
                data.titulo,
                data.modalidad,
                data.horas_requeridas,
                data.plazas_total,
                data.estatus,
                data.lat,
                data.lng,
                data.direccion_proyecto,
            ],
        );
        return result.insertId;
    },

    async findAllAreas(): Promise<Area[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM areas",
        );
        return rows as Area[];
    },
};
