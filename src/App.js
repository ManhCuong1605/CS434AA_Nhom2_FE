import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";

import Header from "./components/Header";
import TimKiem from "./components/TimKiem"; // Import TimKiem
import LoginForm from "./components/LoginForm";
import Loaidat from './pages/admin/Loaidat';
import Batdongsan from "./pages/admin/Batdongsan";
import RegisterForm from "./components/RegisterForm";
import Footer from "./components/Footer";

function MainLayout() {
  const location = useLocation(); // Lấy URL hiện tại

  return (
    <>
      <Header />
      {/* Chỉ hiển thị TimKiem nếu ở trang chủ ("/") */}
      {location.pathname === "/" && <TimKiem />}
      <Footer />
    </>
  );
}

function App() {
  const [showForm, setShowForm] = useState(null);

  return (
    <Router>
      <div className="App">
        {/* Hiển thị Header và TimKiem chỉ trên trang "/" */}
        <MainLayout />

        {/* Hiển thị form đăng ký hoặc đăng nhập */}
        {showForm === 'register' && <RegisterForm toggleForm={() => setShowForm(null)} />}
        {showForm === 'login' && <LoginForm toggleForm={() => setShowForm(null)} />}

        {/* Định nghĩa các Route */}
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
