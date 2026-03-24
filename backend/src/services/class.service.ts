import { StatusCodes } from "../@types/enum";
import { IApiResponse, IClass } from "../@types/types";
import AppDataSource from "../config/data-source";
import { Class } from "../entity/class";
import { Section } from "../entity/section";
import { School } from "../entity/school";

const classRepo = AppDataSource.getRepository(Class);
const sectionRepo = AppDataSource.getRepository(Section);
const schoolRepo = AppDataSource.getRepository(School);

const classService = {
  async createClass(body: IClass): Promise<IApiResponse> {
    try {
      const { class_name, school_name } = body;

      if (!class_name || !school_name) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "class_name and school_name are required",
        };
      }

    
      let school = await schoolRepo.findOne({
        where: { school_name },
      });

      if (!school) {
        school = await schoolRepo.save(schoolRepo.create({ school_name }));
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
        data: {
          id: savedClass.id,
          class_name: savedClass.class_name,
          school_name: school.school_name,
          sections: [{ section_name: "A" }],
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
      const classes = await classRepo.find({
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
};

export default classService;
