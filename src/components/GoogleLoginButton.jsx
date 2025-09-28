import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton({ setError }) {
    const navigate = useNavigate();
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            
            const response = await axios.post("http://localhost:5000/api/google", { idToken });

            // Lưu token và dữ liệu user
            localStorage.setItem("accessToken", response.data.accessToken);
            
            localStorage.setItem("refreshToken", response.data.refreshToken);
            
            localStorage.setItem("roles", JSON.stringify(response.data.roles || []));
            localStorage.setItem("userId", response.data.userId);

            // lưu thêm username
            if (response.data.username) {
                localStorage.setItem("username", response.data.username);
            }

            // bắn sự kiện sau cùng
            window.dispatchEvent(new Event("storage"));

            alert("Đăng nhập Google thành công!");

            // Chuyển trang theo role
            if (response.data.roles?.some(role => ["ADMIN", "NHANVIEN"].includes(role))) {
            
                navigate("/admin", { replace: true });
            } else {
            
                navigate("/", { replace: true });
            }

        } catch (err) {
            console.error("Lỗi đăng nhập Google:", err);
            setError(err.response?.data?.error || "Đăng nhập Google thất bại!");
        }
    };

    const handleGoogleLoginFailure = () => {
        setError("Đăng nhập Google thất bại!");
    };
    return (
        <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            render={renderProps => (
                <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="btn btn-outline-primary w-100"
                >
                    <i className="bi bi-google me-2"></i>Đăng nhập với Google
                </button>
            )}
        />
    )
}

export default GoogleLoginButton
