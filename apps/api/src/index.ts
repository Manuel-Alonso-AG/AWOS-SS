import app from "./app.ts";
import { port } from "./config/env.ts";
import { testConnection } from "./config/db.ts";

function main() {
  try {
    testConnection;
    app.listen(port, () => {
      console.log(`servidor en http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Error al iniciar el servidor: ${error}`);
    process.exit(1);
  }
}

main();
