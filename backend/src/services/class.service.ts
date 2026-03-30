import { StatusCodes } from "../@types/enum";
import { IApiResponse, IClass } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Class } from "../entity/class";
import { Section } from "../entity/section";
import { School } from "../entity/school";
import { UserRole } from "../entity/user";

const classRepo = AppDataSource.getRepository(Class);
const sectionRepo = AppDataSource.getRepository(Section);
const schoolRepo = AppDataSource.getRepository(School);

const classService = {
  // ✅ CREATE CLASS
  async createClass(
    body: IClass,
    user: { role: string; school_id: number | null }
  ): Promise<IApiResponse> {
    try {
      const { class_name, school_name } = body;

      if (!class_name) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "class_name is required",
        };
      }

      let school;

      // ✅ SUPER ADMIN → can use any school
      if (user.role === UserRole.SUPER_ADMIN) {
        if (!school_name) {
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "school_name is required for super admin",
          };
        }

        school = await schoolRepo.findOne({
          where: { school_name },
        });

        if (!school) {
          school = await schoolRepo.save(
            schoolRepo.create({ school_name })
          );
        }
      } else {
        // ✅ SCHOOL ADMIN → only own school
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

      const existingClass = await classRepo.findOne({
        where: {
          class_name,
          school: { id: school.id },
        },
      });

      if (existingClass) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Class already exists in this school",
        };
      }

      const newClass = classRepo.create({
        class_name,
        school,
      });

      const savedClass = await classRepo.save(newClass);

      const section = sectionRepo.create({
        section_name: "A",
        classObj: savedClass,
      });

      await sectionRepo.save(section);

      return {
        status: StatusCodes.CREATED,
        message: "Class created successfully",
        data: savedClass,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ GET ALL CLASSES (FILTERED)
 async getAllClasses(user: {
  role: string;
  school_id: number | null;
}, querySchoolId?: number): Promise<IApiResponse> {
  try {
    let where: any = {};

    if (user.role === UserRole.SUPER_ADMIN) {
      // ✅ agar SUPER_ADMIN ne school select kiya hai
      if (!querySchoolId) {
        return {
          status: StatusCodes.OK,
          message: "No school selected",
          data: [], // 🔥 empty bhejo
        };
      }

      where.school = { id: querySchoolId };
    } else {
      // ✅ SCHOOL_ADMIN → always own school
      where.school = { id: user.school_id! };
    }

    const classes = await classRepo.find({
      where,
      relations: ["school", "sections"],
    });

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

  // ✅ UPDATE CLASS
  async updateClass(
    id: number,
    body: IClass,
    user: { role: string; school_id: number | null }
  ): Promise<IApiResponse> {
    try {
      const existingClass = await classRepo.findOne({
        where: { id },
        relations: ["school"],
      });

      if (!existingClass) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Class not found",
        };
      }

      // 🔥 SCHOOL CHECK (IMPORTANT)
      if (
        user.role !== UserRole.SUPER_ADMIN &&
        existingClass.school.id !== user.school_id
      ) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "You cannot update this class",
        };
      }

      if (body.class_name) {
        existingClass.class_name = body.class_name;
      }

      await classRepo.save(existingClass);

      return {
        status: StatusCodes.OK,
        message: "Class updated successfully",
        data: existingClass,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  // ✅ DELETE CLASS
  async deleteClass(
    id: number,
    user: { role: string; school_id: number | null }
  ): Promise<IApiResponse> {
    try {
      const existingClass = await classRepo.findOne({
        where: { id },
        relations: ["sections", "sections.students", "school"],
      });

      if (!existingClass) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Class not found",
        };
      }

      // 🔥 SCHOOL CHECK
      if (
        user.role !== UserRole.SUPER_ADMIN &&
        existingClass.school.id !== user.school_id
      ) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "You cannot delete this class",
        };
      }

      const hasStudents = existingClass.sections.some(
        (section) => (section.students ?? []).length > 0
      );

      if (hasStudents) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Cannot delete class. Sections have students.",
        };
      }

      if (existingClass.sections?.length) {
        await sectionRepo.remove(existingClass.sections);
      }

      await classRepo.remove(existingClass);

      return {
        status: StatusCodes.OK,
        message: "Class deleted successfully",
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