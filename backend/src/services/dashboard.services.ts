// services/dashboardService.ts
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
  async getDashboardData(school_id?: number): Promise<IApiResponse> {
    try {
      
      const studentQuery = school_id
        ? { where: { school: { id: school_id } } }
        : {};

      const classQuery = school_id
        ? { where: { school: { id: school_id } } }
        : {};

      const sectionQuery = school_id
        ? { where: { classObj: { school: { id: school_id } } } }
        : {};

      const [totalStudents, totalClasses, totalSections] = await Promise.all([
        studentRepo.count(studentQuery),
        classRepo.count(classQuery),
        sectionRepo.count(sectionQuery),
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