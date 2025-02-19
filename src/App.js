import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import Loaidat from "./pages/admin/Loaidat";
import Batdongsan from "./pages/admin/Batdongsan";
import MainLayout from "./layout/MainLayout";

function App() {
  const [showForm, setShowForm] = useState(null);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {!isAdminPage && <MainLayout onFormChange={setShowForm} showForm={showForm} resetForm={() => setShowForm(null)} />}

      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/loaidat" element={<Loaidat />} />
        <Route path="/admin/batdongsan" element={<Batdongsan />} />
      </Routes>
    </div>
  );
}

export default App;
