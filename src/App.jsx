import { Route, Routes } from "react-router-dom";
import PrivateLayout from "./layouts/PrivateLayout";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/*" element={<PrivateLayout />} />
    </Routes>
  );
}
