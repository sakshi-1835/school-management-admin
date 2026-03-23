import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import db from "../config/db";

const sectionService = {
  async getSectionsByClass(class_id: number): Promise<IApiResponse> {
    try {
      if (!class_id) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "class_id is required",
        };
      }

      const [existingClass]: any = await db.query(
        "SELECT * FROM classes WHERE id = ?",
        [class_id]
      );

      if (existingClass.length === 0) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Class not found",
        };
      }

      const [sections]: any = await db.query(
        "SELECT * FROM sections WHERE class_id = ?",
        [class_id]
      );

      return {
        status: StatusCodes.OK,
        message: "Sections retrieved successfully",
        data: sections,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default sectionService;