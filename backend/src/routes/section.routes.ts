import { Router } from "express";
import sectionController from "../controller/section.controller";


const route = Router();

route.get("/" , sectionController.getSection);
route.post("/assign-teacher", sectionController.assignTeacher)
route.post("/create" , sectionController.createSection);
route.put("/update/:id" , sectionController.updateSection);
route.delete("/delete/:id" , sectionController.deleteSection);

export default route;