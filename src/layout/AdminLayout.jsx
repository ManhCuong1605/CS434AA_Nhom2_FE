import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/admin/AdminPage";
import Loaidat from "../pages/admin/Loaidat";
import QuanLyBatdongsan from "../pages/admin/QuanLyBatdongsan";
import NguoiDung from "../pages/admin/NguoiDung";
import KhachHang from "../pages/admin/KhachHang";
import NhanVien from "../pages/admin/NhanVien";
import QuanLyBaiViet from "../pages/admin/QuanLyBaiViet";
import QuanLyLichHen from "../pages/admin/QuanLyLichHen";
import NhanVienLichHen from "../pages/admin/NhanVienLichHen";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            {/* Nội dung Admin không có Header & Footer */}
            <Routes>
                <Route path="/" element={<AdminPage />} />
                <Route path="/loaidat" element={<Loaidat />} />
                <Route path="/batdongsan" element={<QuanLyBatdongsan />} />
                <Route path="/user" element={<NguoiDung />} />
                <Route path="/khachhang" element={<KhachHang />} />
                <Route path="/nhanVien" element={<NhanVien />} />
                <Route path="/quanLyBaiViet" element={<QuanLyBaiViet />} />
                <Route path="/quanLyLichHen" element={<QuanLyLichHen />} />
                <Route
                    path="/nhanvien/lichhen/:nhanVienId"
                    element={<NhanVienLichHen />}
                />
            </Routes>
        </div>
    );
};

export default AdminLayout;

