import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";

import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat';
import Batdongsan from "./pages/admin/Batdongsan";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [showForm, setShowForm] = useState(null); // null nếu không hiển thị form, 'login' hoặc 'register'

  const handleLoginClick = () => {
    setShowForm('login');
  };

  const handleRegisterClick = () => {
    setShowForm('register');
  };

  const resetForm = () => {
    setShowForm(null); // Ẩn form khi các nút khác được nhấn
  };

  return (
    <Router>
      <div className="App">
        {/* Truyền sự kiện vào Header để xử lý hiển thị form */}
        {!(window.location.pathname.startsWith("/admin")) && (
          <Header
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            resetForm={resetForm}
          />
        )}

        {/* Hiển thị form đăng ký hoặc đăng nhập nếu có */}
        {showForm === 'register' && <RegisterForm toggleForm={() => setShowForm(null)} />}
        {showForm === 'login' && <LoginForm toggleForm={() => setShowForm(null)} />}

        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/loaidat" element={<Loaidat />} />
          <Route path="/admin/batdongsan" element={<Batdongsan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
