import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Teacher } from "../entity/teacher";
import { School } from "../entity/school";

const teacherRepo = AppDataSource.getRepository(Teacher);
const schoolRepo = AppDataSource.getRepository(School);

const teacherService = {
  async createTeacher(body: any): Promise<IApiResponse> {
    try {
      const { name, email, subject, school_name } = body;


      const school = await schoolRepo.findOne({
        where: { school_name },
      });

      if (!school) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "School not found",
        };
      }

      // 🔍 check duplicate email
      const existing = await teacherRepo.findOne({
        where: { email },
      });

      if (existing) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Teacher with this email already exists",
        };
      }

      // ✅ create teacher
      const teacher = teacherRepo.create({
        name,
        email,
        subject,
        school: school,
      });

      const savedTeacher = await teacherRepo.save(teacher);

      return {
        status: StatusCodes.CREATED,
        message: "Teacher created successfully",
        data: savedTeacher,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ GET ALL TEACHERS
  async getAllTeachers(): Promise<IApiResponse> {
    try {
      const teachers = await teacherRepo.find({
        relations: ["school", "sections"],
      });

      return {
        status: StatusCodes.OK,
        message: "Teachers retrieved successfully",
        data: teachers,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ GET SINGLE TEACHER
  async getTeacherById(id: number): Promise<IApiResponse> {
    try {
      const teacher = await teacherRepo.findOne({
        where: { id },
        relations: ["school", "sections"],
      });

      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      return {
        status: StatusCodes.OK,
        message: "Teacher retrieved successfully",
        data: teacher,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ UPDATE TEACHER
  async updateTeacher(
    id: number,
    body: any,
  ): Promise<IApiResponse> {
    try {
      const teacher = await teacherRepo.findOne({
        where: { id },
      });

      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      if (!Object.keys(body).length) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "No data provided to update",
        };
      }

      // 🔄 if school_name comes → update relation
      if (body.school_name) {
        const school = await schoolRepo.findOne({
          where: { school_name: body.school_name },
        });

        if (!school) {
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "School not found",
          };
        }

        body.school = school;
        delete body.school_name;
      }

      teacherRepo.merge(teacher, body);

      const updatedTeacher = await teacherRepo.save(teacher);

      return {
        status: StatusCodes.OK,
        message: "Teacher updated successfully",
        data: updatedTeacher,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ DELETE TEACHER
  async deleteTeacher(id: number): Promise<IApiResponse> {
    try {
      const teacher = await teacherRepo.findOne({
        where: { id },
      });

      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      await teacherRepo.delete(id);

      return {
        status: StatusCodes.OK,
        message: "Teacher deleted successfully",
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default teacherService;