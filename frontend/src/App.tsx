import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import ClassesPage from "./pages/ClassesPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import TeachersPage from "./pages/TeacherPage";

const AuthWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthWrapper />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
