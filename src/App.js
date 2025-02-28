import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout"; // Layout riêng cho Admin
import MainLayout from "./layout/MainLayout"; // Layout cho User

import AdminPage from "./pages/admin/AdminPage";
import Loaidat from "./pages/admin/Loaidat";
import QuanLyBatdongsan from "./pages/admin/QuanLyBatdongsan";

import Batdongsan from "./pages/user/Batdongsan";
import ChiTietSanPham from "./pages/user/Chitietsanpham";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">

      {!isAdminPage && <Header />}

      <Routes>
        {/* Layout riêng cho Admin */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Layout chính cho User */}
        <Route path="/*" element={<MainLayout />} />


        <Route path="/dang-nhap" element={<LoginForm />} />
        <Route path="/dang-ky" element={<RegisterForm />} />
      </Routes>


      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
