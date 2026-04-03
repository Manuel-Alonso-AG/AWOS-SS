import express, { Router } from "express";

const routes: Router = express.Router();

routes.post("/login");

routes.post("/registro/estudiante");

routes.post("/registro/institucion");

routes.get("/perfil");

export default routes;

