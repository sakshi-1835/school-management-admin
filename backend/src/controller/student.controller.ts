import { Request, Response } from "express";
import studentService from "../services/student.service";
import { StatusCodes } from "../@types/enum";

const studentController = {
  async addStudent(req: Request, res: Response) {
    try {
      const result = await studentService.addStudent(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async getStudents(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await studentService.getAllStudents(page, limit);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res

        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async getStudentsBySectionId(req: Request, res: Response) {
    try {
      const classId = Number(req.query.classId);
      const sectionId = Number(req.query.sectionId);
      if (!classId || !sectionId) {
        return res.status(400).json({
          message: "class and section are required",
        });
      }

      const result = await studentService.getStudents(classId, sectionId);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async updateStudent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.status(400).json({
          message: "Invalid student id",
        });
      }
      const result = await studentService.updateStudent(id, req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async deleteStudent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.status(400).json({
          message: "Invalid student id",
        });
      }
      const result = await studentService.deleteStudent(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async searchStudent(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const result = await studentService.searchStudent(q as string);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};
export default studentController;
