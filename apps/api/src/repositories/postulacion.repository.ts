import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { Postulacion } from "@awos-ss/types";

export const postulacionRepository = {
    async findById(id: number): Promise<Postulacion | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM postulaciones WHERE id_postulacion = ?",
            [id],
        );
        return (rows[0] as Postulacion) ?? null;
    },

    async findByUsuarioYProyecto(
        id_usuario: number,
        id_proyecto: number,
    ): Promise<Postulacion | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM postulaciones WHERE id_usuario = ? AND id_proyecto = ?",
            [id_usuario, id_proyecto],
        );
        return (rows[0] as Postulacion) ?? null;
    },

    async findByUsuario(id_usuario: number): Promise<RowDataPacket[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT ps.*, p.titulo, p.modalidad, p.horas_requeridas,
              i.nombre_legal AS institucion,
              COALESCE(SUM(hr.horas), 0) AS horas_registradas,
              COALESCE(SUM(CASE WHEN hr.validado = 1 THEN hr.horas ELSE 0 END), 0) AS horas_validadas
       FROM postulaciones ps
       JOIN proyectos p ON ps.id_proyecto = p.id_proyecto
       JOIN instituciones i ON p.id_institucion = i.id_institucion
       LEFT JOIN horas_registro hr ON ps.id_postulacion = hr.id_postulacion
       WHERE ps.id_usuario = ?
       GROUP BY ps.id_postulacion`,
            [id_usuario],
        );
        return rows;
    },

    async findByProyecto(id_proyecto: number): Promise<RowDataPacket[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT ps.*, u.matricula, u.email
       FROM postulaciones ps
       JOIN usuarios u ON ps.id_usuario = u.id_usuario
       WHERE ps.id_proyecto = ?`,
            [id_proyecto],
        );
        return rows;
    },

    async create(
        data: Omit<Postulacion, "id_postulacion" | "estatus">,
    ): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO postulaciones (id_usuario, id_proyecto, carta_motivacion)
       VALUES (?, ?, ?)`,
            [data.id_usuario, data.id_proyecto, data.carta_motivacion],
        );
        return result.insertId;
    },

    /** Actualiza estatus; si se acepta, incrementa plazas_ocupadas en transacción */
    async responder(
        id_postulacion: number,
        estatus: "aceptada" | "rechazada",
        id_proyecto: number,
    ): Promise<void> {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute(
                "UPDATE postulaciones SET estatus = ? WHERE id_postulacion = ?",
                [estatus, id_postulacion],
            );

            if (estatus === "aceptada") {
                await conn.execute(
                    "UPDATE proyectos SET plazas_ocupadas = plazas_ocupadas + 1 WHERE id_proyecto = ?",
                    [id_proyecto],
                );
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },
};
