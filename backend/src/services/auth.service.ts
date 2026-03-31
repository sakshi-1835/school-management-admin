import { StatusCodes } from "../@types/enum";
import { IApiResponse, IUser } from "../@types/types";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { JWT_Secret } from "../config/enviornment";
import AppDataSource from "../config/data-source";
import { User, UserRole } from "../entity/user";
import { School } from "../entity/school";

const Salt_Rounds = 10;

const userRepo = AppDataSource.getRepository(User);
const schoolRepo = AppDataSource.getRepository(School);

const authService = {
  async register(body: IUser): Promise<IApiResponse> {
    try {
      const { name, email, password, school_name, role } = body;

      const existing = await userRepo.findOne({
        where: { email },
      });

      if (existing) {
        return {
          status: StatusCodes.CONFLICT,
          message: "Email already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(password, Salt_Rounds);

      // ✅ role validation
      if (!role || !Object.values(UserRole).includes(role as UserRole)) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Invalid role",
        };
      }

      let school = null;

      // ✅ SCHOOL_ADMIN → school_name required
      if (role === UserRole.SCHOOL_ADMIN) {
        if (!school_name) {
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "School name is required",
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
      }

      const user = userRepo.create({
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
        school,
      });

      const savedUser = await userRepo.save(user);

      const token: string = jwt.sign(
        {
          id: savedUser.id,
          role: savedUser.role,
          school_id: savedUser.school?.id || null,
        },
        JWT_Secret as string,
        { expiresIn: "7d" },
      );

      return {
        status: StatusCodes.CREATED,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: savedUser.id,
            name,
            email,
            role: savedUser.role,
            school_name: savedUser.school?.school_name || null,
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

  async login(body: any): Promise<IApiResponse> {
    try {
      const { email, password } = body;

      const existing = await userRepo.findOne({
        where: { email },
        relations: ["school"],
      });

      if (!existing) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "User not found",
        };
      }

      const isMatch = await bcrypt.compare(password, existing.password);

      if (!isMatch) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "Invalid credentials",
        };
      }

      const token: string = jwt.sign(
        {
          id: existing.id,
          role: existing.role,
          school_id: existing.school?.id || null,
        },
        JWT_Secret as string,
        {
          expiresIn: "7d",
        },
      );

      return {
        status: StatusCodes.OK,
        message: "Login successful",
        data: {
          token,
          user: {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            role: existing.role,
            school_id: existing.school?.id || null,
            school_name: existing.school?.school_name || null,
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

  async deleteUser(userId: number): Promise<IApiResponse> {
    try {
      const existing = await userRepo.findOne({
        where: { id: userId },
      });

      if (!existing) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "User not found",
        };
      }

      await userRepo.delete(userId);

      return {
        status: StatusCodes.OK,
        message: "User deleted successfully",
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },
};

export default authService;
