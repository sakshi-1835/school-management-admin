import { Request, Response } from "express";
import { StatusCodes } from "../@types/enum";
import dashboardServices from "../services/dashboard.services";

const dashboardController = {
  async getDashboardData(req: Request, res: Response) {
    try {
      const result = await dashboardServices.getDashboardData();
      return res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};
export default dashboardController; 
