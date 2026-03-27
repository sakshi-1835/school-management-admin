import { Request, Response } from "express";
import classService from "../services/class.service";
import { StatusCodes } from "../@types/enum";

const classController = {
  async createClass(req: Request, res: Response) {
    try {
      const result = await classService.createClass(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async getAllClasses(req: Request, res: Response) {
    try {
      const result = await classService.getAllClasses();
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async updateClass(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Class ID is required",
        });
      }

      const result = await classService.updateClass(id, req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error?.message || "Internal server error",
      });
    }
  },

  async deleteClass(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Class ID is required",
        });
      }

      const result = await classService.deleteClass(id);
      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error?.message || "Internal server error",
      });
    }
  },
};
export default classController;
