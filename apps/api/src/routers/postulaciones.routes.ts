import express, { Router } from "express";

const routes: Router = express.Router();

routes.post("/");

routes.get("/mis");

routes.get("/proyecto/:id");

routes.patch("/:id/responder");

export default routes;
