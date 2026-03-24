import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Student } from "../entity/student";
import { Class } from "../entity/class";
import { Section } from "../entity/section";

const studentRepo = AppDataSource.getRepository(Student);
const classRepo = AppDataSource.getRepository(Class);
const sectionRepo = AppDataSource.getRepository(Section);

const dashboardServices = {
  async getDashboardData(): Promise<IApiResponse> {
    try {
      // ✅ parallel execution (faster 🚀)
      const [totalStudents, totalClasses, totalSections] =
        await Promise.all([
          studentRepo.count(),
          classRepo.count(),
          sectionRepo.count(),
        ]);

      return {
        status: StatusCodes.OK,
        message: "Dashboard data fetched successfully",
        data: {
          totalStudents,
          totalClasses,
          totalSections,
        },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default dashboardServices;