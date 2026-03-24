import { StatusCodes } from "../@types/enum";
import { IApiResponse } from "../@types/types";
import AppDataSource from "../config/data-source";
import { School } from "../entity/school";

const schoolRepo = AppDataSource.getRepository(School);

const schoolService = {
  async createSchool(body: any): Promise<IApiResponse> {
    try {
      const { school_name, address } = body;

      
      const existingSchool = await schoolRepo.findOne({
        where: { school_name },
      });

      if (existingSchool) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "School already exists",
        };
      }

      // create school
      const school = schoolRepo.create({
        school_name,
        address,
      });

      const savedSchool = await schoolRepo.save(school);

      return {
        status: StatusCodes.CREATED,
        message: "School created successfully",
        data: savedSchool,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

 
  async getAllSchools(): Promise<IApiResponse> {
    try {
      const schools = await schoolRepo.find({
        relations: ["classes", "teachers"], // optional
      });

      return {
        status: StatusCodes.OK,
        message: "Schools retrieved successfully",
        data: schools,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  
  async getSchoolById(id: number): Promise<IApiResponse> {
    try {
      const school = await schoolRepo.findOne({
        where: { id },
        relations: ["classes", "teachers", "students", "users"],
      });

      if (!school) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "School not found",
        };
      }

      return {
        status: StatusCodes.OK,
        message: "School retrieved successfully",
        data: school,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  
  async updateSchool(
    id: number,
    body: Partial<School>,
  ): Promise<IApiResponse> {
    try {
      const school = await schoolRepo.findOne({ where: { id } });

      if (!school) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "School not found",
        };
      }

      
      schoolRepo.merge(school, body);

      const updatedSchool = await schoolRepo.save(school);

      return {
        status: StatusCodes.OK,
        message: "School updated successfully",
        data: updatedSchool,
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  
  async deleteSchool(id: number): Promise<IApiResponse> {
    try {
      const school = await schoolRepo.findOne({ where: { id } });

      if (!school) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "School not found",
        };
      }

      await schoolRepo.remove(school);

      return {
        status: StatusCodes.OK,
        message: "School deleted successfully",
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default schoolService;