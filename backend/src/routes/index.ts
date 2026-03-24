import { Router } from "express";
import authRoutes from "./auth.routes";
import classRoutes from "./class.routes";
import studentRoutes from "./student.route";
import dashboardRoutes from "./dashboard.routes";
import sectionRoutes from "./section.routes";
import schoolRoutes from "./school.routes";
import authenticate from "../middleware/authenticate";

const route = Router();

route.use("/auth", authRoutes);
route.use("/class", authenticate, classRoutes);
// route.use("/student", authenticate, studentRoutes);
// route.use("/section", authenticate, sectionRoutes);
// route.use("/dashboard", authenticate, dashboardRoutes);
route.use("/school", schoolRoutes);

export default route;
