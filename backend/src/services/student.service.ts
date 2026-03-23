import { StatusCodes } from "../@types/enum";
import { IApiResponse, IStudent } from "../@types/types";
import db from "../config/db";

const studentService = {
  async addStudent(body: IStudent): Promise<IApiResponse> {
    try {
      const { name, age, class_id } = body;
      const MAX_STUDENTS = 10;

      const [sections]: any = await db.query(
        `SELECT s.id, s.section_name, COUNT(st.id) as total FROM sections s
          LEFT JOIN students st ON s.id = st.section_id
          WHERE s.class_id = ?
          GROUP BY s.id
          HAVING total < ?
          ORDER BY total ASC
          LIMIT 1`,
        [class_id, MAX_STUDENTS],
      );

      let section_id: number;

      if (sections.length === 0) {
        const [allSections]: any = await db.query(
          `SELECT section_name FROM sections 
         WHERE class_id = ? 
         ORDER BY section_name DESC 
         LIMIT 1`,
          [class_id],
        );

        let newSectionName = "A";

        if (allSections.length > 0) {
          const lastSection = allSections[0].section_name;
          newSectionName = String.fromCharCode(lastSection.charCodeAt(0) + 1);
        }

        const [newSection]: any = await db.query(
          `INSERT INTO sections (section_name, class_id) VALUES (?, ?)`,
          [newSectionName, class_id],
        );

        section_id = newSection.insertId;
      } else {
        section_id = sections[0].id;
      }

      const [insertResult]: any = await db.query(
        `INSERT INTO students (name, age, class_id, section_id) 
       VALUES (?, ?, ?, ?)`,
        [name, age, class_id, section_id],
      );

      const [student]: any = await db.query(
        `SELECT st.id, st.name, st.age, 
              c.class_name, sec.section_name
       FROM students st
       JOIN classes c ON st.class_id = c.id
       JOIN sections sec ON st.section_id = sec.id
       WHERE st.id = ?`,
        [insertResult.insertId],
      );

      return {
        status: StatusCodes.OK,
        message: "Student added successfully",
        data: {
          student: student[0],
        },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async getAllStudents(
    page: number = 1,
    limit: number = 10,
  ): Promise<IApiResponse> {
    try {
      const offset = (page - 1) * limit;

      const [countResult]: any = await db.query(
        `SELECT COUNT(*) as total FROM students`,
      );
      const total = countResult[0].total;

      const [students]: any = await db.query(
        `SELECT st.id,st.name,st.age,c.class_name,sec.section_name FROM students st
          JOIN classes c ON st.class_id = c.id
          JOIN sections sec ON st.section_id = sec.id
          ORDER BY c.id ASC , sec.id ASC
          LIMIT ? OFFSET ?`,
        [limit, offset],
      );

      return {
        status: StatusCodes.OK,
        message: "Students retrieved successfully",
        data: {
          students,
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
      const [section]: any = await db.query(
        "SELECT * FROM sections WHERE id = ? AND class_id = ?",
        [sectionId, classId],
      );

      if (section.length === 0) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Invalid class & section combination",
        };
      }

      const [students]: any = await db.query(
        `SELECT 
            st.id,
            st.name,
            st.age,
            c.class_name,
            sec.section_name
         FROM students st
         JOIN classes c ON st.class_id = c.id
         JOIN sections sec ON st.section_id = sec.id
         WHERE st.class_id = ? AND st.section_id = ?`,
        [classId, sectionId],
      );

      return {
        status: StatusCodes.OK,
        message: "Students retrieved successfully",
        data: { students },
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
      const { name, age, class_id } = body;
      const MAX_STUDENTS = 30;

      const [existing]: any = await db.query(
        "SELECT * FROM students WHERE id = ?",
        [id],
      );

      if (existing.length === 0) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Student not found",
        };
      }

      let updatedSectionId = existing[0].section_id;
      let finalClassId = existing[0].class_id;

      if (class_id && class_id !== existing[0].class_id) {
        finalClassId = class_id;

        const [sections]: any = await db.query(
          `SELECT s.id, s.section_name, COUNT(st.id) as total FROM sections s
           LEFT JOIN students st ON s.id = st.section_id
           WHERE s.class_id = ?
           GROUP BY s.id
           HAVING total < ?
           ORDER BY total ASC
           LIMIT 1`,
          [class_id, MAX_STUDENTS],
        );

        if (sections.length === 0) {
          const [allSections]: any = await db.query(
            `SELECT section_name FROM sections
            WHERE class_id = ?
            ORDER BY section_name DESC
            LIMIT 1`,
            [class_id],
          );

          let newSectionName = "A";

          if (allSections.length > 0) {
            const lastSection = allSections[0].section_name;
            newSectionName = String.fromCharCode(lastSection.charCodeAt(0) + 1);
          }

          const [newSection]: any = await db.query(
            `INSERT INTO sections (section_name, class_id) VALUES (?, ?)`,
            [newSectionName, class_id],
          );

          updatedSectionId = newSection.insertId;
        } else {
          updatedSectionId = sections[0].id;
        }
      }

      await db.query(
        `UPDATE students SET name = ?, age = ?, class_id = ?, section_id = ?
          WHERE id = ?`,
        [
          name ?? existing[0].name,
          age ?? existing[0].age,
          finalClassId,
          updatedSectionId,
          id,
        ],
      );

      const [student]: any = await db.query(
        `SELECT st.id, st.name, st.age,c.class_name, sec.section_name FROM students st
        JOIN classes c ON st.class_id = c.id
        JOIN sections sec ON st.section_id = sec.id
        WHERE st.id = ?`,
        [id],
      );

      return {
        status: StatusCodes.OK,
        message: "Student updated successfully",
        data: {
          student: student[0],
        },
      };
    } catch (error: any) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error?.message || "Internal server error",
      };
    }
  },

  async deleteStudent(id: number): Promise<IApiResponse> {
    try {
      const [existing]: any = await db.query(
        "SELECT * FROM students WHERE id = ?",
        [id],
      );

      if (existing.length === 0) {
        return {
          status: StatusCodes.NOT_FOUND,
          message: "Student not found",
        };
      }

      await db.query("DELETE FROM students WHERE id = ?", [id]);

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
};

export default studentService;
