import { Router } from "express";
import teacherController from "../controller/teacher.controller";

const route = Router();

route.post("/", teacherController.createTeacher);
route.get("/all", teacherController.getAllTeachers);
route.get("/:id", teacherController.getTeacherById);
route.put("/:id", teacherController.updateTeacher);
route.delete("/:id", teacherController.deleteTeacher);

export default route;