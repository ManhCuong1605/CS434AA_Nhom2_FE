import React from "react";
import Header from "../components/Header";
import TimKiem from "../components/TimKiem";
import Trangchu from "../pages/user/Trangchu";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
const MainLayout = ({ onFormChange, showForm, resetForm }) => {
    return (
        <>
            <Header onFormChange={onFormChange} resetForm={resetForm} />

            {/* Chỉ hiển thị form đăng nhập hoặc đăng ký nếu có */}
            {showForm === "register" ? <RegisterForm toggleForm={resetForm} /> :
                showForm === "login" ? <LoginForm toggleForm={resetForm} /> :
                    // Nếu không có form nào, hiển thị các phần còn lại
                    <>
                        <TimKiem />
                        <Trangchu />
                        <Footer />
                    </>
            }
        </>
    );
};


export default MainLayout;
