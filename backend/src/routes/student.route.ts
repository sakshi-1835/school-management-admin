import { Router } from "express";
import studentController from "../controller/student.controller";

const route = Router();

route.post("/add", studentController.addStudent);
route.get("/", studentController.getStudents);
route.get("/list/", studentController.getStudentsBySectionId);
route.put("/update/:id", studentController.updateStudent);
route.delete("/delete/:id", studentController.deleteStudent);
route.get("/search", studentController.searchStudent);

export default route;
