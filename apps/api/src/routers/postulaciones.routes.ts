import { Router } from "express";
import postulacionesController from "../controllers/postulaciones.controller.js";
import { verificarToken, verificarRol } from "../middleware/auth.middleware.js";

const router: Router = Router();

// Todas requieren autenticación
router.use(verificarToken);

router.post("/", verificarRol("estudiante"), (req, res) =>
    postulacionesController.postular(req as any, res),
);

router.get("/mis", verificarRol("estudiante"), (req, res) =>
    postulacionesController.misPostulaciones(req as any, res),
);

router.get("/proyecto/:id", verificarRol("institucion"), (req, res) =>
    postulacionesController.postulacionesDeProyecto(req as any, res),
);

router.patch("/:id/responder", verificarRol("institucion"), (req, res) =>
    postulacionesController.responder(req as any, res),
);

export default router;
