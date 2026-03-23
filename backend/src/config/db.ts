import mysql from "mysql2/promise";
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "school",
});

export const testDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error(" Database connection failed:", error);
  }
};

export default db;
