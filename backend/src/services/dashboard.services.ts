// import e from "express";
// import { StatusCodes } from "../@types/enum";
// import { IApiResponse } from "../@types/types";
// import db from "../config/db";

// const dashboardServices = {
//   async getDashboardData(): Promise<IApiResponse> {
//     try {
//       const [students]: any = await db.query(
//         "SELECT COUNT(*) as totalStudents FROM students",
//       );

//       const [classes]: any = await db.query(
//         "SELECT COUNT(*) as totalClasses FROM classes",
//       );

//       const [sections]: any = await db.query(
//         "SELECT COUNT(*) as totalSections FROM sections",
//       );
//       return {
//         status: StatusCodes.OK,
//         message: "Dashboard data fetched successfully",
//         data: {
//           totalStudents: students[0].totalStudents,
//           totalClasses: classes[0].totalClasses,
//           totalSections: sections[0].totalSections,
//         },
//       };
//     } catch (error: any) {
//       return {
//         status: StatusCodes.INTERNAL_SERVER_ERROR,
//         message: error?.message || "internal server error",
//       };
//     }
//   },
// };
// export default dashboardServices;
