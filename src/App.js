import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useChat } from "./context/ChatContext"; // Import useChat từ context

import AdminLayout from "./layout/AdminLayout"; // Layout riêng cho Admin
import MainLayout from "./layout/MainLayout"; // Layout cho User
import PrivateRoute from "./components/PrivateRoutes";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TinTuc from "./pages/user/Tintuc";
import GioiThieu from "./pages/user/GioiThieu";
import ChatWidget from "./components/ChatWidget"
import ProfilePage from "./pages/user/ProfilePage";
import QuenMatKhau from "./pages/user/QuenMatKhau";
import DoiMatKhau from "./pages/user/DoiMatKhau";
import BaiViet from "./pages/user/BaiViet";
function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { isChatOpen, setIsChatOpen } = useChat(); // Lấy trạng thái chat từ context

  return (
    <div className="App">
      {!isAdminPage && <Header />}

      <Routes>
        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Route>
        <Route path="/*" element={<MainLayout onChatToggle={() => setIsChatOpen(true)} />} />
        <Route path="/dang-nhap" element={<LoginForm />} />
        <Route path="/dang-ky" element={<RegisterForm />} />
        <Route path="/tin-tuc" element={<TinTuc />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<QuenMatKhau />} />
        <Route path="/reset-password" element={<DoiMatKhau />} />
        <Route path="/form-bai-viet" element={<BaiViet />} />
      </Routes>

      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatWidget isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />}
    </div>
  );
}

export default App;
