import { type RowDataPacket } from "mysql2/promise";
import { pool } from "../config/db.ts";
import { type Usuario } from "@awos-ss/types";

export async function findUsuarioByMatricula(
    matricula: string,
): Promise<Usuario | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM usuarios WHERE matricula = ?",
        [matricula],
    );
    const usuario = rows[0] as Usuario | undefined;
    return usuario ?? null;
}

export async function createUsuario(
    usuario: Omit<Usuario, "id">,
): Promise<number> {
    const { matricula, email, passwordHash, rol, activo } = usuario;
    const [result] = await pool.query(
        "INSERT INTO usuarios (matricula, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)",
        [matricula, email, passwordHash, rol, activo],
    );
    return (result as any).insertId;
}
