import { StatusCodes } from "../@types/enum";
import { IApiResponse, IClass } from "../@types/types";
import db from "../config/db";

const classService = {
  async createClass(body: IClass): Promise<IApiResponse> {
    try {
      const { class_name } = body;

      const [existingClass]: any = await db.query(
        "SELECT id FROM classes WHERE class_name = ?",
        [class_name],
      );

      if (existingClass.length > 0) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Class already exists",
        };
      }


      const [result]: any = await db.query(
        "INSERT INTO classes (class_name) VALUES (?)",
        [class_name],
      );

      const classId = result.insertId;

      const initialSection = "A";

      await db.query(
        "INSERT INTO sections (section_name, class_id) VALUES (?, ?)",
        [initialSection, classId],
      );


      return {
        status: StatusCodes.CREATED,
        message: "Class created successfully",
        data: {
          id: classId,
          class_name,
          sections: [
            {
              section_name: initialSection,
            },
          ],
        },
      };
    } catch (error: any) {

      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
  async getAllClasses(): Promise<IApiResponse> {
    try {
      const [classes]: any = await db.query("SELECT * FROM classes");

      return {
        status: StatusCodes.OK,
        message: "Classes retrieved successfully",
        data: classes,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default classService;
