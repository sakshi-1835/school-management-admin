import { Router } from "express";
import sectionController from "../controller/section.controller";


const route = Router();

route.get("/" , sectionController.getSection);

export default route;