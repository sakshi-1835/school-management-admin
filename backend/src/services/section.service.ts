import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Section } from "../entity/section";
import { Class } from "../entity/class";
import { Teacher } from "../entity/teacher";

const sectionRepo = AppDataSource.getRepository(Section);
const classRepo = AppDataSource.getRepository(Class);
const teacherRepo = AppDataSource.getRepository(Teacher);
const sectionService = {
  async getSectionsByClass(class_id: number): Promise<IApiResponse> {
    try {
      if (!class_id) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "class_id is required",
        };
      }

      const existingClass = await classRepo.findOne({
        where: { id: class_id },
      });

      if (!existingClass) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Class not found",
        };
      }

      const sections = await sectionRepo.find({
        where: {
          classObj: { id: class_id },
        },
        relations: ["classObj", "classTeacher"],
      });

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

  async assignTeacherToSection(
    section_id: number,
    teacher_id: number
  ): Promise<IApiResponse> {
    try {
      if (!section_id || !teacher_id) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "section_id and teacher_id are required",
        };
      }

      const section = await sectionRepo.findOne({
        where: { id: section_id },
        relations: ["classTeacher"],
      });
      if (!section) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Section not found",
        };
      }

      const teacher = await teacherRepo.findOne({ where: { id: teacher_id } });
      if (!teacher) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Teacher not found",
        };
      }

      section.classTeacher = teacher;
      await sectionRepo.save(section);

      return {
        status: StatusCodes.OK,
        message: "Teacher assigned successfully",
        data: section,
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