import { Router } from "express";
import horasController from "../controllers/horas.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router: Router = Router();

router.use(verificarToken);

router.post("/", verificarRol("estudiante"), (req, res) =>
    horasController.registrar(req as any, res),
);

// IMPORTANTE: rutas estáticas antes de las dinámicas
router.get("/pendientes", verificarRol("institucion"), (req, res) =>
    horasController.pendientes(req as any, res),
);

router.get(
    "/kardex/:matricula",
    verificarRol("estudiante", "institucion", "administrador"),
    (req, res) => horasController.kardex(req as any, res),
);

router.patch("/:id/validar", verificarRol("institucion"), (req, res) =>
    horasController.validar(req as any, res),
);

export default router;
