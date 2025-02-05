import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat';
function App() {
  return (
    <Router>
      <div className="App">
        {/* Kiểm tra nếu không phải trang admin thì hiển thị Header */}
        {window.location.pathname !== "/admin" && <Header />}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
