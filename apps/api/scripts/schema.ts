// Por alguna razon que no entiendo cuendo entro al script aparecen errores, cuando lo cierro desaparecen xd
import { createPool } from "mysql2/promise";
import fs from "fs/promises";
import { dbHost, dbName, dbPassword, dbUser } from "../src/config/env.ts";

async function run() {
    const db = createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        multipleStatements: true,
    });

    try {
        const sql = await fs.readFile("database/schema.sql", "utf-8");
        const conn = await db.getConnection();
        await conn.query(sql);
        conn.release();
        console.log("Schema creado exitosamente");
    } catch (error) {
        console.error("Error creando el schema:", error);
    } finally {
        await db.end();
    }
}

run();
