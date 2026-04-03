import mysql, { type Pool } from "mysql2/promise";
import { dbHost, dbName, dbPassword, dbUser } from "./env.ts";

export const pool: Pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    connectionLimit: 15,
    waitForConnections: true,
    queueLimit: 0,
    timezone: "+00:00",
});

export const testConnection = async (): Promise<void> => {
    const conn = await pool.getConnection();
    console.log("[DB] Conexión MySQL establecida exitosamente.");
    conn.release();
};
