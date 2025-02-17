import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import Trangchu from "./pages/user/Trangchu";
import Header from "./components/Header";
import TimKiem from "./components/TimKiem"; // Import TimKiem
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat';
import Batdongsan from "./pages/admin/Batdongsan";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [showForm, setShowForm] = useState(null);

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

        {/* Hiển thị form đăng ký hoặc đăng nhập */}
        {showForm === 'register' && <RegisterForm toggleForm={() => setShowForm(null)} />}
        {showForm === 'login' && <LoginForm toggleForm={() => setShowForm(null)} />}

        {/* Định nghĩa các Route */}
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/loaidat" element={<Loaidat />} />
          <Route path="/admin/batdongsan" element={<Batdongsan />} />
          <Route path="/user/Trangchu" element={<Trangchu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
