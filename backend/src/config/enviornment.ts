import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? 3002;
export const MONGO_DB_URI = process.env.MONGO_DB_URI ?? "";
export const JWT_Secret = process.env.JWT_secret;