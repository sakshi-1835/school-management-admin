import { useNavigate } from "react-router-dom";
import Authcard from "../components/Authcard";
import { useState } from "react";
import http from "../api/http";
import endPoints from "../api/endpoints";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role:"",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.placeholder.toLowerCase()]: e.target.value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await http.post(
        endPoints.auth.register,
        form
      );

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
        className="w-full border p-2 rounded"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Role"
        onChange={handleChange}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>

      <p className="text-center text-sm">
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
