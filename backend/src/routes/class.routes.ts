import { Router } from "express";
import classController from "../controller/class.controller";

const route = Router();

route.get("/", classController.getAllClasses);
route.post("/create", classController.createClass);
route.put("/update/:id", classController.updateClass);
route.delete("/delete/:id", classController.deleteClass);
export default route;
