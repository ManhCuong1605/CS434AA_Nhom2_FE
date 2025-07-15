import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function DoiMatKhau() {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const email = location.state?.email || '';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/reset-password',
                { email, otp, newPassword, }
            )
            setMessage(res.data.message);
            setTimeout(() => navigate('/dang-nhap'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi hệ thống');
        }
    }
    if (!email) return <div className="text-center mt-5">Không tìm thấy email. Hãy thử lại từ đầu.</div>;
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form onSubmit={handleSubmit}>
                <div className="card text-center shadow bg-white w-100" style={{ maxWidth: '420px' }}>
                    <div className="card-header h5 text-dark bg-white border-bottom">Xác thực OTP</div>
                    <div className="card-body px-4 py-4">
                        <p className="card-text">Nhập mã OTP và mật khẩu mới</p>
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-dark w-100">Xác nhận</button>
                        {message && <div className="alert alert-success mt-2">{message}</div>}
                        {error && <div className="alert alert-danger mt-2">{error}</div>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default DoiMatKhau
