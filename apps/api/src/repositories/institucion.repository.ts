import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { Institucion } from "@awos-ss/types";

export const institucionRepository = {
    async findByUserId(id_usuario: number): Promise<Institucion | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM instituciones WHERE id_usuario = ?",
            [id_usuario],
        );
        return (rows[0] as Institucion) ?? null;
    },

    async findById(id: number): Promise<Institucion | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM instituciones WHERE id_institucion = ?",
            [id],
        );
        return (rows[0] as Institucion) ?? null;
    },

    async create(data: Omit<Institucion, "id_institucion">): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO instituciones (id_usuario, nombre_legal, tipo, lat, lng)
       VALUES (?, ?, ?, ?, ?)`,
            [data.id_usuario, data.nombre_legal, data.tipo, data.lat, data.lng],
        );
        return result.insertId;
    },
};
