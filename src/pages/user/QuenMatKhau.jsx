import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function QuenMatKhau() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
            setMessage(res.data.message);
            setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi hệ thống');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form onSubmit={handleSubmit}>
                <div className="card text-center shadow" style={{ width: '400px' }}>
                    <div className="card-header h5 text-dark bg-white border-bottom">Quên mật khẩu</div>

                    <div className="card-body px-4 py-5">

                        <p className="card-text py-2">
                            Nhập địa chỉ email để xác thực OTP.
                        </p>
                        <div className="form-outline mb-3">
                            <input
                                type="email"
                                className="form-control my-2"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Lấy lại mật khẩu</button>

                        {message && <div className="alert alert-success mt-2">{message}</div>}
                        {error && <div className="alert alert-danger mt-2">{error}</div>}

                    </div>
                </div>
            </form>
        </div>
    );
}

export default QuenMatKhau;
