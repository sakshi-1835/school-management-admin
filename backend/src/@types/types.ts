import { Request } from "express";

export interface AuthRequest extends Request {
  user?: IUser;
}
export interface IApiResponse {
  data?: any;
  message: string;
  status: number;
}
export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  school_name: string;
  role?: "admin" | "teacher";
}

export interface IClass {
  id?: number;
  class_name: string;
  school_name: string;
}
export interface IStudent {
  id?: number;
  name: string;
  age?: number;
  gender?: string;
  class_id: number;
  section_id: number;
  school_id: number;
}
