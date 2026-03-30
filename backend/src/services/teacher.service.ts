import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Teacher } from "../entity/teacher";
import { School } from "../entity/school";
import { UserRole } from "../entity/user";

const teacherRepo = AppDataSource.getRepository(Teacher);
const schoolRepo = AppDataSource.getRepository(School);

const teacherService = {
  async createTeacher(
    body: any,
    user: { role: string; school_id: number | null },
  ): Promise<IApiResponse> {
    try {
      const { name, email, subject, school_name } = body;

      let school;

      // 🔥 SUPER ADMIN
      if (user.role === UserRole.SUPER_ADMIN) {
        if (!school_name) {
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "school_name is required",
          };
        }

        school = await schoolRepo.findOne({
          where: { school_name },
        });

        if (!school) {
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "School not found",
          };
        }
      } else {
        school = await schoolRepo.findOne({
          where: { id: user.school_id! },
        });
      }

      if (!school) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "School not found",
        };
      }

      const existing = await teacherRepo.findOne({
        where: { email },
      });

      if (existing) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Teacher with this email already exists",
        };
      }

      const teacher = teacherRepo.create({
        name,
        email,
        subject,
        school,
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

  // ✅ GET ALL (FILTERED)
  async getAllTeachers(user: {
    role: string;
    school_id: number | null;
  }): Promise<IApiResponse> {
    try {
      let teachers;

      if (user.role === UserRole.SUPER_ADMIN) {
        teachers = await teacherRepo.find({
          relations: ["school", "sections"],
        });
      } else {
        teachers = await teacherRepo.find({
          where: {
            school: { id: user.school_id! },
          },
          relations: ["school", "sections"],
        });
      }

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

  // ✅ GET BY ID
  async getTeacherById(
    id: number,
    user: { role: string; school_id: number | null },
  ): Promise<IApiResponse> {
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

      // 🔥 SCHOOL CHECK
      if (
        user.role !== UserRole.SUPER_ADMIN &&
        teacher.school.id !== user.school_id
      ) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "You cannot access this teacher",
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

  // ✅ UPDATE
  async updateTeacher(
    id: number,
    body: any,
    user: { role: string; school_id: number | null },
  ): Promise<IApiResponse> {
    try {
      const teacher = await teacherRepo.findOne({
        where: { id },
        relations: ["school"],
      });

      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      if (user.role === UserRole.SCHOOL_ADMIN) {
        // School admin can only update their own teacher
        if (teacher.school.id !== user.school_id) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            message: "You cannot update this teacher",
          };
        }
      }

      // SUPER_ADMIN can update any teacher and can change school
      if (user.role === UserRole.SUPER_ADMIN && body.school_name) {
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

  // ✅ DELETE
  async deleteTeacher(
    id: number,
    user: { role: string; school_id: number | null },
  ): Promise<IApiResponse> {
    try {
      const teacher = await teacherRepo.findOne({
        where: { id },
        relations: ["school"],
      });

      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      // 🔥 SCHOOL CHECK
      if (
        user.role !== UserRole.SUPER_ADMIN &&
        teacher.school.id !== user.school_id
      ) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "You cannot delete this teacher",
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
