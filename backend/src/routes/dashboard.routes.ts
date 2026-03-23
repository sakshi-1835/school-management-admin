import { Router } from "express";
import dashboardController from "../controller/dashboard.controller";


const route = Router();

route.get("/" , dashboardController.getDashboardData);

export default route;