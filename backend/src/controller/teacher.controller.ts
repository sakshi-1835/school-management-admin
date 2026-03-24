import { Request, Response } from "express";
import teacherService from "../services/teacher.service";
import { StatusCodes } from "../@types/enum";

const teacherController = {
  // ✅ CREATE TEACHER
  async createTeacher(req: Request, res: Response) {
    try {
      const result = await teacherService.createTeacher(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  // ✅ GET ALL TEACHERS
  async getAllTeachers(req: Request, res: Response) {
    try {
      const result = await teacherService.getAllTeachers();
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  // ✅ GET SINGLE TEACHER
  async getTeacherById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const result = await teacherService.getTeacherById(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  // ✅ UPDATE TEACHER
  async updateTeacher(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const result = await teacherService.updateTeacher(id, req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  // ✅ DELETE TEACHER
  async deleteTeacher(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const result = await teacherService.deleteTeacher(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};

export default teacherController;