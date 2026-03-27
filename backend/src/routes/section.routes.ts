import { Router } from "express";
import sectionController from "../controller/section.controller";


const route = Router();

route.get("/" , sectionController.getSection);
route.post("/assign-teacher", sectionController.assignTeachee)

export default route;