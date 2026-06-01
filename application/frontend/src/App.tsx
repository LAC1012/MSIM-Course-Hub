export default function App() {
  return <AppRoutes />;
}

import { Navigate, Route, Routes } from "react-router-dom";
import CoursePage from "./pages/CoursePage";
import HomePage from "./pages/HomePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/course/:courseId" element={<CoursePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

