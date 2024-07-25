import { Router } from "express";
import { registerUser, findUser, updateUser } from "../controllers/userController.js";

const routesUser = Router();

routesUser.post("/", registerUser);
routesUser.get("/:phone_number/:password", findUser);
routesUser.put("/", updateUser)

export default routesUser;