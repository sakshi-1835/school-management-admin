import { Request, Response } from "express";
import authService from "../services/auth.service";
import { StatusCodes } from "../@types/enum";

const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};

export default authController;
