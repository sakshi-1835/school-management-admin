import { useNavigate } from "react-router-dom";
import Authcard from "../components/Authcard";
import http from "../api/http";
import endPoints from "../api/endpoints";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await http.post(endPoints.auth.login, form);
    const { token, user } = res.data;

    console.log("LOGIN SUCCESS");

    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    alert("Login Successful");

    console.log("BEFORE NAVIGATE");

    navigate("/dashboard");

    console.log("AFTER NAVIGATE"); // 👈 ye print hona chahiye
  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <Authcard title="Login">
      <input
        name="email"
        className="w-full border p-2 rounded"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="password"
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-500 cursor-pointer"
        >
          Register
        </span>
      </p>
    </Authcard>
  );
};

export default Login;
