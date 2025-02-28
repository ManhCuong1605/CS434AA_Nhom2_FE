import React, { useState } from "react";
import Footer from "./Footer";
import loginImage from "../assets/login.png";  // Sử dụng cùng hình ảnh như LoginForm

function RegisterForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    }
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("https://your-api-endpoint.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Đăng ký thành công:", data);
          // Tự động chuyển qua form đăng nhập sau khi đăng ký thành công
          toggleForm();
        } else {
          console.error("Đăng ký thất bại:", data.message);
          alert(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="row bg-white shadow rounded overflow-hidden" style={{ maxWidth: "900px" }}>
          <div className="col-md-5 d-flex flex-column justify-content-center align-items-center bg-light p-4">
            <img src={loginImage} alt="Register" className="mb-3" style={{ width: "200px" }} />
            <p className="text-danger text-center fw-bold">Nơi khởi nguồn tổ ấm, đầu tư vững bền.</p>
          </div>
          <div className="col-md-7 p-4">
            <h2 className="text-start fs-6 fw-bold">Xin chào bạn</h2>
            <h4 className="text-start fw-bold mb-4 fs-4">Đăng ký tài khoản</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="text-danger mb-2">{errors.email}</div>}
              </div><div className="mb-3">
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
              <button type="submit" className="btn btn-danger w-100 mb-3">Đăng ký</button>
            </form>
            <p className="text-center mt-3">
              Đã có tài khoản?{" "}
              <button
                className="text-danger text-decoration-none btn btn-link"
                onClick={() => toggleForm("login")}
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;