import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router: Router = Router();

// Públicas
router.post("/login", (req, res) => authController.login(req, res));
router.post("/registro/estudiante", (req, res) =>
    authController.registrarEstudiante(req, res),
);
router.post("/registro/institucion", (req, res) =>
    authController.registrarInstitucion(req, res),
);

// Protegidas — cualquier rol autenticado
router.get("/perfil", verificarToken, (req, res) =>
    authController.perfil(req as any, res),
);

export default router;
