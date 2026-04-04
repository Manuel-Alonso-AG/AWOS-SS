import { Router } from "express";
import proyectosController from "../controllers/proyectos.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router: Router = Router();

// Públicas
router.get("/", (req, res) => proyectosController.listar(req as any, res));
router.get("/areas", (req, res) => proyectosController.areas(req as any, res));

// IMPORTANTE: /mis-proyectos debe ir ANTES de /:id para evitar que Express
// capture "mis-proyectos" como parámetro dinámico
router.get(
    "/mis-proyectos",
    verificarToken,
    verificarRol("institucion"),
    (req, res) => proyectosController.misProyectos(req as any, res),
);

router.get("/:id", (req, res) => proyectosController.detalle(req as any, res));

router.post("/", verificarToken, verificarRol("institucion"), (req, res) =>
    proyectosController.crear(req as any, res),
);

export default router;
