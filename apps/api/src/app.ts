import express, {
    type Express,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routers/auth.routes.js";
import proyectosRoutes from "./routers/proyectos.routes.js";
import postulacionesRoutes from "./routers/postulaciones.routes.js";
import horasRoutes from "./routers/horas.routes.js";

const app: Express = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

// ── Rutas de la API ───────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/postulaciones", postulacionesRoutes);
app.use("/api/horas", horasRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// ── Error handler global ──────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[ERROR]", err.message);
    res.status(500).json({
        success: false,
        message: "Error interno del servidor",
    });
});

export default app;
