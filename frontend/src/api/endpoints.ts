const endPoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },
  dashBoard: {
    getData: "/dashboard/",
  },
  classes: {
    getAll: "/class/",
    create: "/class/create",
  },
  sections: {
    getAll: "/section",
    assignTeacher : "/section/assign-teacher"
  },
  students: {
    getAll: "/student/",
    getAllBySection: "/student/list",
    create: "/student/add",
    update: "/student/update/:id",
    delete: "/student/delete/:id",
    search: "/student/search"
  },
  school:{
    getAll: "/school/",
  },
  teachers :{
    getAll : "/teacher/all"
  }
};
export default endPoints;
