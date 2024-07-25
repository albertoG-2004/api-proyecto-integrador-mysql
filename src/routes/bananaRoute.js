import { Router } from "express";
import { registerBanana, findAllClassification } from "../controllers/bananaController.js";

const routesBanana = Router();

routesBanana.post("/", registerBanana);
routesBanana.get("/", findAllClassification);

export default routesBanana;