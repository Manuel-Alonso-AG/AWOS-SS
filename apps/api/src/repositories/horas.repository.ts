import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { HorasRegistro, VistaKardexSS } from "@awos-ss/types";

export const horasRepository = {
    async create(
        data: Omit<
            HorasRegistro,
            "id_registro" | "validado" | "validado_por" | "fecha_validacion"
        >,
    ): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO horas_registro
         (id_postulacion, fecha_actividad, horas, descripcion, evidencia_url)
       VALUES (?, ?, ?, ?, ?)`,
            [
                data.id_postulacion,
                data.fecha_actividad,
                data.horas,
                data.descripcion,
                data.evidencia_url,
            ],
        );
        return result.insertId;
    },

    async findById(id: number): Promise<HorasRegistro | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM horas_registro WHERE id_registro = ?",
            [id],
        );
        return (rows[0] as HorasRegistro) ?? null;
    },

    async validar(
        id_registro: number,
        validado: boolean,
        validado_por: number,
    ): Promise<void> {
        await pool.execute(
            `UPDATE horas_registro
       SET validado = ?, validado_por = ?, fecha_validacion = NOW()
       WHERE id_registro = ?`,
            [validado ? 1 : 0, validado_por, id_registro],
        );
    },

    async kardexByMatricula(matricula: string): Promise<VistaKardexSS[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM vista_kardex_ss WHERE matricula = ?",
            [matricula],
        );
        return rows as VistaKardexSS[];
    },

    /** Registros sin validar que pertenecen a proyectos de una institución */
    async pendientesByInstitucion(
        id_institucion: number,
    ): Promise<RowDataPacket[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT hr.*, u.matricula, p.titulo AS proyecto
       FROM horas_registro hr
       JOIN postulaciones ps ON hr.id_postulacion = ps.id_postulacion
       JOIN usuarios u ON ps.id_usuario = u.id_usuario
       JOIN proyectos p ON ps.id_proyecto = p.id_proyecto
       WHERE p.id_institucion = ?
         AND hr.validado = 0`,
            [id_institucion],
        );
        return rows;
    },
};
