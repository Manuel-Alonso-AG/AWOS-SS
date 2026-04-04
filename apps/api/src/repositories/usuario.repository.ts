import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { Usuario } from "@awos-ss/types";

export const usuarioRepository = {
    async findByMatricula(matricula: string): Promise<Usuario | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM usuarios WHERE matricula = ?",
            [matricula],
        );
        return (rows[0] as Usuario) ?? null;
    },

    async findById(id: number): Promise<Usuario | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM usuarios WHERE id_usuario = ?",
            [id],
        );
        return (rows[0] as Usuario) ?? null;
    },

    async create(data: Omit<Usuario, "id_usuario">): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO usuarios (matricula, email, password_hash, rol, activo)
       VALUES (?, ?, ?, ?, ?)`,
            [
                data.matricula,
                data.email,
                data.password_hash,
                data.rol,
                data.activo,
            ],
        );
        return result.insertId;
    },
};
