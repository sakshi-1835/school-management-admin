import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import http from "../api/http";
import endPoints from "../api/endpoints";
import StateCard from "../components/StateCard";
import StudentsTable from "../components/StudentsTable";
import StudentFormModal from "../components/Form";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSections: 0,
  });

  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const res = await http.get(endPoints.dashBoard.getData);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllStudents = async (page = 1) => {
    try {
      const res = await http.get(
        `${endPoints.students.getAll}?page=${page}&limit=8`,
      );

      setStudents(res.data.students);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    getDashboardData();
    getAllStudents(pagination.page);
  }, []);

  const handlePageChange = (page: number) => {
    getAllStudents(page);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };

  const handleSubmit = async (data: any, id?: number) => {
    try {
      const payload: any = {
        name: data.name,
        age: data.age ? Number(data.age) : undefined,
      };

      if (!id) {
        if (!data.class_id) {
          alert("Class is required while adding student");
          return;
        }
        payload.class_id = Number(data.class_id);
      }

      if (id && data.class_id) {
        payload.class_id = Number(data.class_id);
      }

      if (id) {
        await http.put(
          endPoints.students.update.replace(":id", String(id)),
          payload,
        );
      } else {
        await http.post(endPoints.students.create, payload);
      }

      setModalOpen(false);
      setSelectedStudent(null);

      getAllStudents(pagination.page);
    } catch (err) {
      console.error("Error saving student:", err);
      alert("Failed to save student");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await http.delete(endPoints.students.delete.replace(":id", String(id)));

      getAllStudents(pagination.page);
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      <div className="flex-1 p-4">
        <div className="flex-1 bg-gray-100 p-4 mb-4 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StateCard title="Total Students" value={stats.totalStudents} />
              <StateCard
                title="Classes"
                value={stats.totalClasses}
                onClick={() => navigate("/classes")}
              />
              <StateCard title="Sections" value={stats.totalSections} />
            </div>
          )}
        </div>

        <button
          onClick={handleAddStudent}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Student
        </button>

        <StudentsTable
          students={students}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />

        {modalOpen && (
          <StudentFormModal
            student={selectedStudent}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
