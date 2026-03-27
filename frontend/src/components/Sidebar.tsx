import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <div className="w-48 bg-white shadow-md p-4 space-y-3 ">
      <Link to="/dashboard" className="block p-2 bg-gray-200 rounded">
        Dashboard
      </Link>
      <Link to="/classes" className="block p-2 bg-gray-200 rounded">
        Classes
      </Link>
      <Link to="/teachers" className="block p-2 bg-gray-200 rounded">
        Teachers
      </Link>

      <button
        onClick={handleLogout}
        className="p-2 bg-red-400 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
