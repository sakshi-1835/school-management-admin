import { Request, Response } from "express";
import sectionService from "../services/section.service";
import { StatusCodes } from "../@types/enum";

const sectionController = {
  async getSection(req: Request, res: Response) {
    try {
      const result = await sectionService.getSectionsByClass(
        Number(req.query.class_id),
      );
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async createSection(req: Request, res: Response) {
    try {
      const { section_name, class_id } = req.body;

      const result = await sectionService.createSection(
        section_name,
        Number(class_id),
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async updateSection(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { section_name } = req.body;

      const result = await sectionService.updateSection(
        Number(id),
        section_name,
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async deleteSection(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await sectionService.deleteSection(Number(id));

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async assignTeacher(req: Request, res: Response) {
    try {
      const { section_id, teacher_id } = req.body;

      const result = await sectionService.assignTeacherToSection(
        Number(section_id),
        Number(teacher_id),
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};

export default sectionController;
