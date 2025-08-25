import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from '../assets/login.png';
import { Link } from "react-router-dom";
import axios from "axios";
function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                username,
                password
            });

            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", username);
                localStorage.setItem("roles", JSON.stringify(response.data.roles || []));

                // Lưu nhanVienId nếu có
                if (response.data.nhanVienId) {
                    localStorage.setItem("nhanVienId", response.data.nhanVienId);
                }

                window.dispatchEvent(new Event("storage")); // Cập nhật Header ngay lập tức

                alert("Đăng nhập thành công!");

                if (response.data.roles?.some(role => ["ADMIN", "NHANVIEN"].includes(role))) {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } else {
                setError("Dữ liệu phản hồi không hợp lệ!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setError(error.response?.data?.error || "Đăng nhập thất bại!");
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="row bg-white shadow rounded overflow-hidden" style={{ maxWidth: "900px" }}>
                    {/* Left Side */}
                    <div className="col-md-5 d-flex flex-column justify-content-center align-items-center bg-light p-4">
                        <img
                            src={loginImage} // Thay link này bằng logo của bạn
                            alt="Login"
                            className="mb-3"
                            style={{ width: "200px" }}
                        />
                        <p className="text-danger text-center fw-bold">
                            Nơi khởi nguồn tổ ấm, đầu tư vững bền.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="col-md-7 p-4">
                        <h2 className="text-start fs-6 fw-bold">Xin chào bạn</h2>
                        <h4 className="text-start fw-bold mb-4 fs-4">Đăng nhập để tiếp tục</h4>

                        <form onSubmit={handleLogin}>
                            {/* Số điện thoại hoặc email */}
                            <div className="mb-3">

                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Nhập tài khoản"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                            </div>

                            {/* Mật khẩu */}
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button className="btn btn-outline-secondary" type="button">
                                        <i className="bi bi-eye"></i>
                                    </button>
                                </div>
                                {error && <div className="text-danger mt-1">{error}</div>}
                            </div>

                            {/* Nhớ tài khoản và quên mật khẩu */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <input type="checkbox" id="rememberMe" />
                                    <label htmlFor="rememberMe" className="ms-2">
                                        Nhớ tài khoản
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-danger text-decoration-none">
                                    Quên mật khẩu?
                                </Link>
                            </div>


                            {/* Đăng nhập */}
                            <button type="submit" className="btn btn-danger w-100 mb-3">
                                Đăng nhập
                            </button>

                            {/* Hoặc đăng nhập với Google */}
                            <div className="text-center text-muted mb-3">Hoặc</div>
                            <button type="button" className="btn btn-outline-primary w-100">
                                <i className="bi bi-google me-2"></i>Đăng nhập với Google
                            </button>
                        </form>

                        {/* Đăng ký */}
                        <p className="text-center mt-3">
                            Chưa là thành viên?{" "}
                            <span
                                className="text-danger text-decoration-none"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/dang-ky")}
                            >
                                Đăng ký
                            </span>{" "}tại đây
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm; 
