import { Router } from "express";
import authController from "../controller/auth.controller";

const route = Router();
route.post("/register", authController.register);
route.post("/login", authController.login);

export default route;