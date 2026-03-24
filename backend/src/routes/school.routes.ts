import { Router } from "express";
import schoolController from "../controller/school.controller";

const route = Router();

route.post("/", schoolController.createSchool);
route.get("/", schoolController.getAllSchools);
route.get("/:id", schoolController.getSchoolById);
route.put("/update/:id", schoolController.updateSchool);
route.delete("/delete/:id", schoolController.deleteSchool);

export default route;