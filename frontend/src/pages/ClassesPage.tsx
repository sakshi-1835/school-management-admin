import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import http from "../api/http";
import endPoints from "../api/endpoints";
import StudentTable from "../components/classPage/StudentList";

const ClassesPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]); // For dropdown

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null,
  );
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Fetch all classes
  const getClasses = async () => {
    try {
      const res = await http.get(endPoints.classes.getAll);
      setClasses(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools
  const getSchools = async () => {
    try {
      const res = await http.get(endPoints.school.getAll);
      setSchools(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  // Fetch sections for a class
  const getSections = async (classId: number) => {
    try {
      const res = await http.get(endPoints.sections.getAll, {
        params: { class_id: classId },
      });
      setSections(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const getStudents = async (classId: number, sectionId: number) => {
    try {
      const res = await http.get(endPoints.students.getAllBySection, {
        params: { classId, sectionId },
      });
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const getTeachers = async () => {
    try {
      const res = await http.get(endPoints.teachers.getAll);
      setTeachers(res.data.data || res.data);
      console.log(res);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    getClasses();
    getSchools();
    getTeachers();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Open Edit Modal
  const handleEditClass = (cls: any) => {
    setEditingClassId(cls.id);
    setClassName(cls.class_name);
    setSchoolName(cls.school?.school_name || "");
    setShowEditClassModal(true);
  };

  // UPDATE API
  const handleUpdateClass = async () => {
    if (!editingClassId || !className) {
      alert("All fields required");
      return;
    }

    const payload: any = {
      class_name: className,
    };

    try {
      await http.put(
        endPoints.classes.update.replace(":id", String(editingClassId)),
        payload,
      );

      alert("Class updated successfully!");
      setShowEditClassModal(false);
      setEditingClassId(null);
      setClassName("");
      setSchoolName("");
      await getClasses();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // DELETE API
  const handleDeleteClass = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?",
    );
    if (!confirmDelete) return;

    try {
      await http.delete(endPoints.classes.delete.replace(":id", String(id)));
       setClasses((prev) => prev.filter((cls) => cls.id !== id));
      alert("Class deleted successfully!");
      await getClasses();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleClassClick = async (classId: number) => {
    setSelectedClassId(classId);
    setSelectedSectionId(null);
    setStudents([]);
    await getSections(classId);
  };

  const handleSectionClick = async (sectionId: number) => {
    if (!selectedClassId) return;
    setSelectedSectionId(sectionId);
    await getStudents(selectedClassId, sectionId);
  };

  // Open edit modal for assigning teacher
  const handleEditSection = (sectionId: number) => {
    setEditingSectionId(sectionId);
    setSelectedTeacherId(null);
    setShowEditSectionModal(true);
  };

  // Assign teacher to section
  const handleAssignTeacher = async () => {
    if (!editingSectionId || !selectedTeacherId) {
      alert("Please select a teacher");
      return;
    }

    try {
      await http.post(endPoints.sections.assignTeacher, {
        section_id: editingSectionId,
        teacher_id: selectedTeacherId,
      });
      alert("Teacher assigned successfully!");
      setShowEditSectionModal(false);
      setEditingSectionId(null);
      setSelectedTeacherId(null);
    } catch (err: any) {
      console.error("Error assigning teacher:", err);
      alert(err.response?.data?.message || "Failed to assign teacher");
    }
  };

  const handleAddClass = async () => {
    if (!className || !schoolName) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await http.post(endPoints.classes.create, {
        class_name: className,
        school_name: schoolName,
      });
      alert("Class added successfully!");
      setShowAddClassModal(false);
      setClassName("");
      setSchoolName("");
      await getClasses();
    } catch (err: any) {
      console.error("Error adding class:", err);
      alert(err.response?.data?.message || "Failed to add class");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Classes</h1>

          <button
            onClick={() => setShowAddClassModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Class
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`relative p-5 rounded-xl shadow-md transition 
                  ${
                    selectedClassId === cls.id
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-blue-50"
                  }`}
              >
                {/* Click area */}
                <div
                  onClick={() => handleClassClick(cls.id)}
                  className="cursor-pointer"
                >
                  <h2 className="text-lg font-semibold text-center">
                    {cls.class_name}
                  </h2>
                </div>

                {/* 3 DOT MENU */}
                <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === cls.id ? null : cls.id);
                  }}
                  className="text-lg"
                >
                  ⋮
                </button>

                {/* DROPDOWN */}
                {openMenuId === cls.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-28 bg-white border rounded shadow"
                  >
                    <button
                      onClick={() => {
                        handleEditClass(cls);
                        setOpenMenuId(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-black hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteClass(cls.id);
                        setOpenMenuId(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              </div>
            ))}
          </div>
        )}

        {selectedClassId && (
          <div className="mt-8 bg-white p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sections</h2>

            {sections.length === 0 ? (
              <p>No sections available</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition 
                    ${
                      selectedSectionId === sec.id
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 hover:bg-blue-200"
                    }`}
                  >
                    <div onClick={() => handleSectionClick(sec.id)}>
                      Section {sec.section_name}
                    </div>
                    <button
                      onClick={() => handleEditSection(sec.id)}
                      className="ml-2 px-2 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSectionId && (
          <div className="mt-8 bg-white p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            {students.length === 0 ? (
              <p>No students found</p>
            ) : (
              <StudentTable student = {students}/>
            )}
          </div>
        )}

        {/* Add Class Modal */}
        {showAddClassModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80">
              <h2 className="font-bold mb-3 text-lg">Add Class</h2>

              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                className="w-full border p-2 mb-3 rounded"
              />

              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="">Select School</option>
                {schools.map((school: any) => (
                  <option key={school.id} value={school.school_name}>
                    {school.school_name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddClass}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditClassModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80">
              <h2 className="font-bold mb-3 text-lg">Edit Class</h2>

              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                className="w-full border p-2 mb-3 rounded"
              />

              <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="">Select School</option>
                {schools.map((school: any) => (
                  <option key={school.id} value={school.school_name}>
                    {school.school_name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditClassModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateClass}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Section Modal */}
        {showEditSectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80">
              <h2 className="font-bold mb-3 text-lg">Assign Class Teacher</h2>

              <select
                value={selectedTeacherId || ""}
                onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditSectionModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAssignTeacher}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
