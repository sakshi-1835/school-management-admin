import { Router } from "express";
import classController from "../controller/class.controller";


const route = Router();

route.get("/" , classController.getAllClasses);
route.post("/create" , classController.createClass);

export default route;