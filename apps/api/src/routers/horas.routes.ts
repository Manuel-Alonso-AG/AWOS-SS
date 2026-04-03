import express, { Router } from "express";

const routes: Router = express.Router();

routes.post("/");

routes.patch("/:id/validar");

routes.get("/kardex/:matricula");

routes.get("/pendientes");

export default routes;
