import jwt, { Secret } from "jsonwebtoken";
import { StatusCodes } from "../@types/enum";
import { NextFunction, Response } from "express";
import db from "../config/db";
import { AuthRequest, IUser } from "../@types/types";
import { JWT_Secret } from "../config/enviornment";

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const secretKey: Secret = JWT_Secret as Secret;

    
    if (!authHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, secretKey) as any;

    const [rows]: any = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.id] 
    );

    const user = rows[0];

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User not found",
      });
    }

    req.user = user as IUser;

    next();
  } catch (error: any) {
    console.log(error)
    return res.status(StatusCodes.FORBIDDEN).json({
      message: error?.message || "Invalid or expired token",
    });
  }
};

export default authenticate;