import { StatusCodes } from "../@types/enum";
import { IApiResponse, IStudent } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Student } from "../entity/student";
import { Class } from "../entity/class";
import { Section } from "../entity/section";
import { School } from "../entity/school";
import { Like } from "typeorm";

const studentRepo = AppDataSource.getRepository(Student);
const classRepo = AppDataSource.getRepository(Class);
const sectionRepo = AppDataSource.getRepository(Section);
const schoolRepo = AppDataSource.getRepository(School);

const MAX_STUDENTS = 6;

const studentService = {
  async addStudent(body: IStudent): Promise<IApiResponse> {
    try {
      const { name, age, class_id, school_id } = body;

      const classData = await classRepo.findOne({ where: { id: class_id } });
      if (!classData) {
        return { status: 404, message: "Class not found" };
      }

      const school = await schoolRepo.findOne({ where: { id: school_id } });
      if (!school) {
        return { status: 404, message: "School not found" };
      }

      const section = await assignSection(classData);

      const student = studentRepo.create({
        name,
        age,
        school,
        classObj: classData,
        section,
      });

      const saved = await studentRepo.save(student);

      return {
        status: 200,
        message: "Student added",
        data: saved,
      };
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message,
      };
    }
  },

  async getAllStudents(
    page: number = 1,
    limit: number = 10,
  ): Promise<IApiResponse> {
    try {
      const [students, total] = await studentRepo.findAndCount({
        relations: ["classObj", "section"],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          classObj: { id: "ASC" },
          section: { id: "ASC" },
        },
      });

      const formatted = students.map((st) => ({
        id: st.id,
        name: st.name,
        age: st.age,
        class_name: st.classObj.class_name,
        section_name: st.section.section_name,
      }));

      return {
        status: StatusCodes.OK,
        message: "Students retrieved successfully",
        data: {
          students: formatted,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async getStudents(classId: number, sectionId: number): Promise<IApiResponse> {
    try {
      const section = await sectionRepo.findOne({
        where: {
          id: sectionId,
          classObj: { id: classId },
        },
      });

      if (!section) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Invalid class & section combination",
        };
      }

      const students = await studentRepo.find({
        where: {
          classObj: { id: classId },
          section: { id: sectionId },
        },
        relations: ["classObj", "section"],
      });

      const formatted = students.map((st) => ({
        id: st.id,
        name: st.name,
        age: st.age,
        class_name: st.classObj.class_name,
        section_name: st.section.section_name,
      }));

      return {
        status: StatusCodes.OK,
        message: "Students retrieved successfully",
        data: { students: formatted },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async updateStudent(
    id: number,
    body: Partial<IStudent>,
  ): Promise<IApiResponse> {
    try {
      const student = await studentRepo.findOne({
        where: { id },
        relations: ["classObj", "school", "section"],
      });

      if (!student) {
        return { status: 404, message: "Student not found" };
      }

      // 🔹 update school
      if (body.school_id) {
        const school = await schoolRepo.findOne({
          where: { id: body.school_id },
        });

        if (!school) {
          return { status: 404, message: "School not found" };
        }

        student.school = school;
      }

      // 🔹 update class + section
      if (body.class_id && body.class_id !== student.classObj.id) {
        const classData = await classRepo.findOne({
          where: { id: body.class_id },
        });

        if (!classData) {
          return { status: 404, message: "Class not found" };
        }

        student.classObj = classData;
        student.section = await assignSection(classData);
      }

      // 🔹 simple fields
      student.name = body.name ?? student.name;
      student.age = body.age ?? student.age;

      const updated = await studentRepo.save(student);

      return {
        status: 200,
        message: "Student updated",
        data: updated,
      };
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message,
      };
    }
  },

  async deleteStudent(id: number): Promise<IApiResponse> {
    try {
      const student = await studentRepo.findOne({
        where: { id },
      });

      if (!student) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Student not found",
        };
      }

      await studentRepo.delete(id);

      return {
        status: StatusCodes.OK,
        message: "Student deleted successfully",
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async searchStudent(query: string): Promise<IApiResponse> {
    try {
      if (!query) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Search query is required",
        };
      }

      const students = await studentRepo.find({
        where: {
          name: Like(`%${query}%`),
        },
        relations: ["classObj", "section"],
      });

      const formattedData = students.map((s) => ({
        id: s.id,
        name: s.name,
        age: s.age,
        class: s.classObj?.class_name,
        section: s.section?.section_name,
      }));

      return {
        status: StatusCodes.OK,
        message: "Students fetched successfully",
        data: formattedData,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error while searching students",
      };
    }
  },
};

export default studentService;

const assignSection = async (classData: Class): Promise<Section> => {
  const sections = await sectionRepo.find({
    where: { classObj: { id: classData.id } },
    order: { section_name: "ASC" },
  });

  for (const sec of sections) {
    const count = await studentRepo.count({
      where: { section: { id: sec.id } },
    });

    if (count < MAX_STUDENTS) return sec;
  }

  let newSectionName = "A";

  if (sections.length > 0) {
    const last = sections[sections.length - 1].section_name;
    newSectionName = String.fromCharCode(last.charCodeAt(0) + 1);
  }

  const newSection = sectionRepo.create({
    section_name: newSectionName,
    classObj: classData,
  });

  return await sectionRepo.save(newSection);
};
