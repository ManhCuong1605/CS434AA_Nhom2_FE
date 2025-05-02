import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import NguoiDungApi from '../../api/NguoiDungApi';

function NguoiDung() {
    const [showModal, setShowModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        HoTen: '',
        SoDienThoai: '',
        email: '',
        DiaChi: '',
        TrangThai: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            const res = await NguoiDungApi.getAll(token); // Gửi token vào API
            setUserList(res.data.sort((a, b) => b.TrangThai - a.TrangThai));
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách người dùng', 'error');
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "TrangThai" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await NguoiDungApi.update(formData.id, formData);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await NguoiDungApi.add(formData);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            console.log(error);
            Swal.fire('Lỗi!', 'Vui lòng thử lại.', 'error');
        }
    };

    const handleEdit = (user) => {
        setFormData({
            id: user.id,
            username: user.username,
            password: user.password,
            HoTen: user.HoTen,
            SoDienThoai: user.SoDienThoai,
            email: user.email,
            DiaChi: user.DiaChi,
            TrangThai: user.TrangThai
        });
        setIsEditing(true);
        setShowModal(true);
    };


    const openModal = () => {
        setFormData({
            id: '',
            username: '',
            password: '',
            HoTen: '',
            SoDienThoai: '',
            email: '',
            DiaChi: '',
            TrangThai: 1
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Quản lý Người dùng</h2>
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>Thêm người dùng</button>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table">
                        <tr>
                            <th>STT</th>
                            <th>Tên đăng nhập</th>
                            <th>Mật khẩu</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.password}</td>
                                <td>{user.HoTen}</td>
                                <td>{user.email}</td>
                                <td>{user.SoDienThoai}</td>
                                <td>{user.DiaChi}</td>
                                <td>

                                    {user.TrangThai === 1 ? 'Hoạt động' : 'Khóa'}

                                </td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>
                                        <i className="fas fa-edit"></i> Sửa
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal thêm/sửa người dùng */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    {isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tên đăng nhập *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Mật khẩu *</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Họ và tên *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="HoTen"
                                                value={formData.HoTen}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="SoDienThoai"
                                                value={formData.SoDienThoai}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Trạng thái *</label>
                                            <select
                                                className="form-select"
                                                name="TrangThai"
                                                value={formData.TrangThai}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="1">Hoạt động</option>
                                                <option value="0">Khóa</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <textarea
                                            className="form-control"
                                            name="DiaChi"
                                            value={formData.DiaChi}
                                            onChange={handleChange}
                                            rows="2"
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i> Đóng
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    <i className="fas fa-save"></i> {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminPage>
    );
}

export default NguoiDung;