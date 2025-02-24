import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AdminPage from "./pages/admin/AdminPage";
import Loaidat from "./pages/admin/Loaidat";
import QuanLyBatdongsan from "./pages/admin/QuanLyBatdongsan";
import MainLayout from "./layout/MainLayout";
import Batdongsan from "./pages/user/Batdongsan";
import ChiTietSanPham from "./pages/user/Chitietsanpham";

function App() {
  const [showForm, setShowForm] = useState(null);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Kiểm tra nếu đường dẫn là `/bat-dong-san` hoặc `/bat-dong-san/:id`
  const isBatDongSanPage = location.pathname.startsWith("/bat-dong-san");

  return (
    <div className="App">
      {!isAdminPage && !isBatDongSanPage && (
        <MainLayout onFormChange={setShowForm} showForm={showForm} resetForm={() => setShowForm(null)} />
      )}
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/loaidat" element={<Loaidat />} />
        <Route path="/admin/batdongsan" element={<QuanLyBatdongsan />} />
        <Route path="/bat-dong-san" element={<Batdongsan />} />
        <Route path="/bat-dong-san/:id" element={<ChiTietSanPham />} />
      </Routes>
    </div>
  );
}

export default App;
