import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StateCard from "../components/StateCard";
import StudentsTable from "../components/StudentsTable";
import StudentFormModal from "../components/Form";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import http from "../api/http";
import endPoints from "../api/endpoints";
import type { Student } from "../@types/type";

const DashBoard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSections: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Dashboard stats
  const getDashboardData = async () => {
    try {
      const res = await http.get(endPoints.dashBoard.getData);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch students (search + filters + pagination)
 const getStudents = async () => {
  try {
    let res;

    // Case 1: Class AND Section selected → filtered API
    if (selectedClass && selectedSection) {
      res = await http.get(endPoints.students.getAllBySection, {
        params: {
          classId: selectedClass,
          sectionId: selectedSection,
        },
      });
    } else {
      // Case 2: No filters → get all students
      res = await http.get(endPoints.students.getAll, {
        params: { page: 1, limit: 8 },
      });
    }

    const formatted = res.data.students.map((s: any) => ({
      id: s.id,
      name: s.name,
      age: s.age,
      class_name: s.class || s.class_name || "N/A",
      section_name: s.section || s.section_name || "N/A",
    }));

    setStudents(formatted);
  } catch (err: any) {
    console.error("API Error:", err.response?.data || err);
    setStudents([]);
  }
};
  useEffect(() => {
    getDashboardData();
    getStudents();
  }, []);

  useEffect(() => {
    getStudents();
  }, [selectedClass, selectedSection]);


  const handleSelect = (student: any) => {
    setSelectedClass(null);
    setSelectedSection(null);
    setStudents([
      {
        id: student.id,
        name: student.name,
        age: student.age,
        class_name: student.class || student.class_name,
        section_name: student.section || student.section_name,
        class: "",
      },
    ]);
    setPagination({ page: 1, totalPages: 1 });
  };

  const handlePageChange = (page: number) => getStudents();
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await http.delete(endPoints.students.delete.replace(":id", String(id)));
      getStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitStudent = async (data: any, id?: number) => {
    try {
      const payload: any = {
        name: data.name,
        age: data.age ? Number(data.age) : undefined,
      };
      if (!id) payload.class_id = Number(data.class_id);
      if (id && data.class_id) payload.class_id = Number(data.class_id);

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
      getStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to save student");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Dashboard Cards */}
        <div className="bg-gray-100 p-4 mb-4 rounded shadow">
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

        {/* Search Bar */}
        <SearchBar
          onSelect={handleSelect}
          onClear={() => {
            setSearchQuery("");
            getStudents();
          }}
        />

        {/* Add Student */}
        <button
          onClick={handleAddStudent}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Student
        </button>

        {/* Filter Bar */}
        <FilterBar
          selectedClass={selectedClass}
          selectedSection={selectedSection}
          onClassChange={setSelectedClass}
          onSectionChange={setSelectedSection}
        />

        {/* Students Table */}
        <StudentsTable
          students={students}
          pagination={pagination}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        {modalOpen && (
          <StudentFormModal
            student={selectedStudent}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmitStudent}
          />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
