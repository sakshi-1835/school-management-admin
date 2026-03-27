import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import http from "../api/http";
import endPoints from "../api/endpoints";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    school_name: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // ================= API =================

  const getTeachers = async () => {
    try {
      const res = await http.get(endPoints.teachers.getAll);
      setTeachers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSchools = async () => {
    try {
      const res = await http.get(endPoints.school.getAll);
      setSchools(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTeachers();
    getSchools();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // ================= HANDLERS =================

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      subject: "",
      school_name: "",
    });
    setEditingId(null);
  };

  // CREATE
  const handleAddTeacher = async () => {
    const { name, email, subject, school_name } = form;

    if (!name || !email || !subject || !school_name) {
      alert("All fields required");
      return;
    }

    try {
      await http.post(endPoints.teachers.create, form);
      alert("Teacher added!");
      setShowAddModal(false);
      resetForm();
      getTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // EDIT OPEN
  const handleEdit = (t: any) => {
    setForm({
      name: t.name,
      email: t.email,
      subject: t.subject,
      school_name: t.school?.school_name || "",
    });
    setEditingId(t.id);
    setShowEditModal(true);
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await http.put(
        endPoints.teachers.update.replace(":id", String(editingId)),
        form
      );
      alert("Updated!");
      setShowEditModal(false);
      resetForm();
      getTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await http.delete(
        endPoints.teachers.delete.replace(":id", String(id))
      );
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teachers</h1>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Teacher
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded shadow overflow-visible">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">School</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.email}</td>
                    <td className="p-3">{t.subject}</td>
                    <td className="p-3">
                      {t.school?.school_name || "-"}
                    </td>

                    <td className="p-3 text-center relative overflow-visible">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === t.id ? null : t.id
                          );
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === t.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 w-32 bg-white border rounded shadow-lg z-50"
                        >
                          <button
                            onClick={() => {
                              handleEdit(t);
                              setOpenMenuId(null);
                            }}
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(t.id);
                              setOpenMenuId(null);
                            }}
                            className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD MODAL */}
        {showAddModal && (
          <Modal
            title="Add Teacher"
            form={form}
            schools={schools}
            onChange={handleChange}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddTeacher}
          />
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <Modal
            title="Edit Teacher"
            form={form}
            schools={schools}
            onChange={handleChange}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default TeachersPage;

// ================= MODAL =================

const Modal = ({ title, form, schools, onChange, onClose, onSubmit }: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="font-bold mb-3">{title}</h2>

        <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="w-full border p-2 mb-2 rounded" />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full border p-2 mb-2 rounded" />
        <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject" className="w-full border p-2 mb-2 rounded" />

        <select name="school_name" value={form.school_name} onChange={onChange} className="w-full border p-2 mb-3 rounded">
          <option value="">Select School</option>
          {schools.map((s: any) => (
            <option key={s.id} value={s.school_name}>
              {s.school_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
            Cancel
          </button>
          <button onClick={onSubmit} className="bg-blue-500 text-white px-3 py-1 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};