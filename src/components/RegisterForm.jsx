import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [tempData, setTempData] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Vui lòng nhập tên tài khoản.";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    if (!hoTen) newErrors.hoTen = "Vui lòng nhập họ và tên.";
    if (!soDienThoai) newErrors.soDienThoai = "Vui lòng nhập số điện thoại.";
    else if (!/^0\d{9}$/.test(soDienThoai)) newErrors.soDienThoai = "Số điện thoại không hợp lệ.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email không hợp lệ.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
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
        email,
        DiaChi: diaChi,
      };

      const res = await axios.post("http://localhost:5000/api/register/send-otp", userData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(res.data.message);
      setShowOTP(true);
      setTempData(userData); // lưu lại để dùng xác nhận
    } catch (error) {
      setMessage(error.response?.data?.error || "Lỗi khi gửi OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...tempData, otp };

      const res = await axios.post("http://localhost:5000/api/register/confirm", data, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/dang-nhap"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Xác nhận OTP thất bại.");
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
          <h4 className="fw-bold mb-4">Đăng ký tài khoản</h4>

          {message && (
            <div className={`alert ${message.includes("thành công") ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={showOTP ? handleConfirmOTP : handleSendOTP}>
            {/* Các ô nhập như username, password, họ tên,... */}
            {!showOTP && (
              <>
                <div className="mb-3">
                  <input type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} placeholder="Tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
                  {errors.username && <div className="text-danger">{errors.username}</div>}
                </div>
                <div className="mb-3">
                  <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
                <div className="mb-3">
                  <input type="password" className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                </div>
                <div className="mb-3">
                  <input type="text" className={`form-control ${errors.hoTen ? "is-invalid" : ""}`} placeholder="Họ và tên" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
                  {errors.hoTen && <div className="text-danger">{errors.hoTen}</div>}
                </div>
                <div className="mb-3">
                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <input type="text" className={`form-control ${errors.soDienThoai ? "is-invalid" : ""}`} placeholder="Số điện thoại" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />
                  {errors.soDienThoai && <div className="text-danger">{errors.soDienThoai}</div>}
                </div>


              </>
            )}

            {showOTP && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã OTP đã gửi đến email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-danger w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {showOTP ? "Xác nhận OTP..." : "Gửi mã OTP..."}
                </>
              ) : (
                showOTP ? "Xác nhận OTP" : "Đăng ký"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            Đã có tài khoản?{" "}
            <button className="btn btn-link text-danger" onClick={() => navigate("/dang-nhap")}>
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
