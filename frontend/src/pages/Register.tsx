import { useNavigate } from "react-router-dom";
import Authcard from "../components/Authcard";
import { useState, useEffect } from "react";
import http from "../api/http";
import endPoints from "../api/endpoints";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    school: "",
  });

  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await http.get(endPoints.school.getAll);
        setSchools(res.data || []);
      } catch (err) {
        console.error("Error fetching schools", err);
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        school_name: form.school ,
      };

      const res = await http.post(endPoints.auth.register, payload);

      alert(res.data.message || "Registered Successfully");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authcard title="Register">
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Name"
        name="name"
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />
      <input
        className="w-full border p-2 rounded mb-2"
        type="password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
      />

      <select
        className="w-full border p-2 rounded mb-2"
        name="school"
        value={form.school}
        onChange={handleChange}
      >
        <option value="">Select School</option>
        {schools.map((s) => (
          <option key={s.id} value={s.school_name}>
            {s.school_name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded mb-2"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="">Select Role</option>
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="SCHOOL_ADMIN">School Admin</option>
      </select>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>

      <p className="text-center text-sm mt-2">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-blue-500 cursor-pointer"
        >
          Login
        </span>
      </p>
    </Authcard>
  );
};

export default Register;
