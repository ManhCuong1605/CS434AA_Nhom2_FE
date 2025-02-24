import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AdminPage from "./pages/admin/AdminPage";
import Loaidat from "./pages/admin/Loaidat";
import QuanLyBatdongsan from "./pages/admin/QuanLyBatdongsan";
import MainLayout from "./layout/MainLayout";
import Batdongsan from "./pages/user/Batdongsan";
function App() {
  const [showForm, setShowForm] = useState(null);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const hiddenLayoutPath = ["/bat-dong-san"]
  return (
    <div className="App">
      {!isAdminPage && !hiddenLayoutPath.includes(location.pathname) && (  // Ẩn MainLayout nếu trang nằm trong danh sách
        <MainLayout onFormChange={setShowForm} showForm={showForm} resetForm={() => setShowForm(null)} />
      )}
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/loaidat" element={<Loaidat />} />
        <Route path="/admin/batdongsan" element={<QuanLyBatdongsan />} />
        <Route path="/bat-dong-san" element={<Batdongsan />} />
      </Routes>
    </div>
  );
}

export default App;
