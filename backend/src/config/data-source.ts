import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/user";
import { School } from "../entity/school";
import { Teacher } from "../entity/teacher";
import { Class } from "../entity/class";
import { Section } from "../entity/section";
import { Student } from "../entity/student";

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "school_management",
  entities: [User, School, Teacher, Class, Section, Student],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
