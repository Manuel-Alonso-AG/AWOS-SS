import express, { Router } from "express";

const routes: Router = express.Router();

routes.get("/");

routes.get("/areas");

routes.get("/:id");

routes.get("/mis-proyectos");

routes.post("/proyectos");

export default routes;
