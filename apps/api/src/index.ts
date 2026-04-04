import app from "./app.js";
import { port } from "./config/env.js";
import { testConnection } from "./config/db.js";

async function main() {
    try {
        await testConnection(); // verifica la conexión a MySQL antes de escuchar
        app.listen(port, () => {
            console.log(`[SERVER] API corriendo en http://localhost:${port}`);
            console.log(`[SERVER] Health: http://localhost:${port}/api/health`);
        });
    } catch (error) {
        console.error("[SERVER] Error al iniciar:", error);
        process.exit(1);
    }
}

main();
