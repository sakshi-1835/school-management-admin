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
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async assignTeachee(req: Request, res: Response) {
    try {
      const { section_id, teacher_id } = req.body;

      const result = await sectionService.assignTeacherToSection(
        Number(section_id),
        Number(teacher_id),
      );
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};
export default sectionController;
