import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import nhanVienApi from '../../api/NhanVienApi';
import dayjs from 'dayjs';
function NhanVien() {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        MaNV: '',
        HoTen: '',
        SoDienThoai: '',
        email: '',
        DiaChi: '',
        NgayLamViec: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await nhanVienApi.getAll();
            setEmployeeList(res.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách nhân viên', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const openModal = () => {
        setFormData({ id: '', MaNV: '', HoTen: '', SoDienThoai: '', email: '', DiaChi: '', username: '', password: '' });
        setIsEditing(false);
        setShowModal(true);
    };
    const handleSubmit = async () => {
        const { MaNV, username, password, email, SoDienThoai, NgayLamViec } = formData;
        if (!MaNV || !username || (!isEditing && !password) || !email || !SoDienThoai || !formData.NgayLamViec) {
            Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ các thông tin bắt buộc', 'error');
            return;
        }
        const formattedDate = NgayLamViec;
        const dataToSend = {
            ...formData,
            NgayLamViec: formattedDate
        };
        try {
            if (isEditing) {
                await nhanVienApi.update(formData.id, dataToSend);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await nhanVienApi.add(dataToSend);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            console.error('Add/Edit error:', error.response?.data || error);
            const msg = error.response?.data?.error || error.response?.data?.message || 'Vui lòng thử lại.';
            Swal.fire('Lỗi!', msg, 'error');
        }
    };

    const closeModal = () => setShowModal(false);
    const handleEdit = (employee) => {
        const date = new Date(employee.NgayLamViec);
        const formattedDate = date.toISOString().substring(0, 10); // yyyy-MM-dd
        setFormData({
            id: employee.id,
            MaNV: employee.MaNV,
            HoTen: employee.User?.HoTen || '',
            SoDienThoai: employee.User?.SoDienThoai || '',
            email: employee.User?.email || '',
            DiaChi: employee.User?.DiaChi || '',
            NgayLamViec: formattedDate,
            username: employee.User?.username || '',
            password: ''
        });
        setIsEditing(true);
        setShowModal(true);
    };
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa đi!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await nhanVienApi.delete(id);
                    Swal.fire('Đã xóa!', '', 'success');
                    loadData();
                } catch (err) {
                    console.error('Delete error:', err.response?.data || err);
                    const msg = err.response?.data?.error || 'Xóa không thành công.';
                    Swal.fire('Lỗi!', msg, 'error');
                }
            }
        });
    };
    return (
        <AdminPage>
            <h2 className="mb-4">Quản lý nhân viên</h2>
            <button className="btn btn-primary mb-3" onClick={openModal}>
                Thêm nhân viên
            </button>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã NV</th>
                            <th>Tên nhân viên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Ngày làm việc</th>
                            <th>Tên đăng nhập</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList.map((emp, idx) => (
                            <tr key={emp.id}>
                                <td>{idx + 1}</td>
                                <td>{emp.MaKH}</td>
                                <td>{emp.User?.HoTen}</td>
                                <td>{emp.User?.email}</td>
                                <td>{emp.User?.SoDienThoai}</td>
                                <td>{emp.User?.DiaChi}</td>
                                <td>{new Date(emp.NgayLamViec).toLocaleDateString('vi-VN')}</td>

                                <td>{emp.User?.username}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(emp)}>
                                        <i className="fas fa-edit"></i> Sửa
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>
                                        <i className="fas fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    {isEditing ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Mã NV *</label>
                                            <input type="text" className="form-control" name="MaNV" value={formData.MaNV} onChange={handleChange} required />

                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Họ và tên *</label>
                                            <input type="text" className="form-control" name="HoTen" value={formData.HoTen} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Số điện thoại *</label>
                                            <input type="text" className="form-control" name="SoDienThoai" value={formData.SoDienThoai} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <textarea className="form-control" name="DiaChi" value={formData.DiaChi} onChange={handleChange} rows="2"></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày làm việc *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="NgayLamViec"
                                            value={formData.NgayLamViec}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tên đăng nhập *</label>
                                            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Mật khẩu {isEditing ? '' : '*'}</label>
                                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}><i className="fas fa-times"></i> Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}><i className="fas fa-save"></i> {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminPage>
    );
}

export default NhanVien
