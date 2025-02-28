import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/admin/AdminPage";
import Loaidat from "../pages/admin/Loaidat";
import QuanLyBatdongsan from "../pages/admin/QuanLyBatdongsan";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            {/* Nội dung Admin không có Header & Footer */}
            <Routes>
                <Route path="/" element={<AdminPage />} />
                <Route path="/loaidat" element={<Loaidat />} />
                <Route path="/batdongsan" element={<QuanLyBatdongsan />} />
            </Routes>
        </div>
    );
};

export default AdminLayout;
