import { Request, Response } from "express";
import schoolService from "../services/school.service";
import { StatusCodes } from "../@types/enum";

const schoolController = {
  async createSchool(req: Request, res: Response) {
    try {
      const result = await schoolService.createSchool(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async getAllSchools(req: Request, res: Response) {
    try {
      const result = await schoolService.getAllSchools();
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async getSchoolById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await schoolService.getSchoolById(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async updateSchool(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await schoolService.updateSchool(id, req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async deleteSchool(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await schoolService.deleteSchool(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};

export default schoolController;
