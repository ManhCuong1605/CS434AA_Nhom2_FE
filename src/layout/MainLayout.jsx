import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TimKiem from "../components/TimKiem";
import Trangchu from "../pages/user/Trangchu";
import Slide from "../components/Slide";
import Batdongsan from "../pages/user/Batdongsan";
import ChiTietSanPham from "../pages/user/Chitietsanpham";

const MainLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>
            {/* Chỉ hiển thị Slide, TimKiem và Trangchu nếu đang ở trang chủ */}
            {isHomePage && (
                <>
                    <Slide />
                    <TimKiem />
                    <Trangchu />
                </>
            )}

            <Routes>
                <Route path="/bat-dong-san" element={<Batdongsan />} />
                <Route path="/bat-dong-san/:id" element={<ChiTietSanPham />} />
            </Routes>
        </>
    );
};

export default MainLayout;
