import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hoTen, setHoTen] = useState(""); // Thêm họ tên
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Vui lòng nhập tên tài khoản.";
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    if (!hoTen) newErrors.hoTen = "Vui lòng nhập họ và tên.";
    if (!soDienThoai) {
      newErrors.soDienThoai = "Vui lòng nhập số điện thoại.";
    } else if (!/^\d{10,11}$/.test(soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ.";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        username,
        password,
        HoTen: hoTen,
        SoDienThoai: soDienThoai,
        email: email
      };

      const response = await axios.post("http://localhost:5000/api/register", userData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      setTimeout(() => navigate("/dang-nhap"), 2000);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.response?.data || error.message);
      setMessage(`${error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="row bg-white shadow rounded overflow-hidden" style={{ maxWidth: "900px" }}>
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-center bg-light p-4">
          <img src={loginImage} alt="Register" className="mb-3" style={{ width: "200px" }} />
          <p className="text-danger text-center fw-bold">Nơi khởi nguồn tổ ấm, đầu tư vững bền.</p>
        </div>
        <div className="col-md-7 p-4">
          <h2 className="text-start fs-6 fw-bold">Xin chào bạn</h2>
          <h4 className="text-start fw-bold mb-4 fs-4">Đăng ký tài khoản</h4>

          {message && (
            <div className={`alert ${message.includes("thành công") ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                placeholder="Nhập tên tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <div className="text-danger mb-2">{errors.username}</div>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-danger mb-2">{errors.password}</div>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <div className="text-danger mb-2">{errors.confirmPassword}</div>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${errors.hoTen ? "is-invalid" : ""}`}
                placeholder="Nhập họ và tên"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
              />
              {errors.hoTen && <div className="text-danger mb-2">{errors.hoTen}</div>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${errors.soDienThoai ? "is-invalid" : ""}`}
                placeholder="Nhập số điện thoại"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
              />
              {errors.soDienThoai && <div className="text-danger mb-2">{errors.soDienThoai}</div>}
            </div>

            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="text-danger mb-2">{errors.email}</div>}
            </div>

            <button type="submit" className="btn btn-danger w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            Đã có tài khoản?{" "}
            <button
              className="text-danger text-decoration-none btn btn-link"
              onClick={() => navigate("/dang-nhap")}
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
