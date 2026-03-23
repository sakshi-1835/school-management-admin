import { ResultSetHeader } from "mysql2";
import { StatusCodes } from "../@types/enum";
import { IApiResponse, IUser } from "../@types/types";
import db from "../config/db";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { JWT_Secret } from "../config/enviornment";

const Salt_Rounds = 10;

const authService = {
  async register(body: IUser): Promise<IApiResponse> {
    try {
      const { name, email, password , role} = body;

      const [existing] : any = await db.query("SELECT * FROM users WHERE email = ?", [
        body.email,
      ]);

      if (existing.length > 0) {
        return {
          status: StatusCodes.CONFLICT,
          message: "Email already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(body.password, Salt_Rounds);
      body.password = hashedPassword;
      const userRole = role || "user";

      const [user] = await db.query<ResultSetHeader>(
        "INSERT INTO users (name, email, password , role) VALUES (?, ?, ? , ?)",
        [name, email, hashedPassword, userRole],
      );

      const token: string = jwt.sign(
        { id: user.insertId, role: userRole},
        JWT_Secret as string,
        {
          expiresIn: "7d",
        },
      );
      return {
        status: StatusCodes.CREATED,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: user.insertId,
            name,
            email,
            role: userRole,
          },
        },
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async login(body: IUser): Promise<IApiResponse> {
    try {
      const { email, password } = body;

      const [existing] : any = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (!existing.length) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "User not found",
        };
      }

      const isMatch = await bcrypt.compare(password, existing[0].password);

      if (!isMatch) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "Invalid credentials",
        };
      }

      const token: string = jwt.sign(
        { id: existing[0].id ,role: existing[0].role},
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
            id: existing[0].id,
            name: existing[0].name,
            email: existing[0].email,
            role: existing[0].role,
          },
        },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  }

};

export default authService;
