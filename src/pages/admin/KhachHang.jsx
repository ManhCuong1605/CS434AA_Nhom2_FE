import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import khachHangApi from '../../api/KhachHangApi';

function KhachHang() {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [customerList, setCustomerList] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        MaKH: '',
        HoTen: '',
        SoDienThoai: '',
        email: '',
        DiaChi: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await khachHangApi.getAll();
            setCustomerList(res.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách khách hàng', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = () => {
        setFormData({ id: '', MaKH: '', HoTen: '', SoDienThoai: '', email: '', DiaChi: '', username: '', password: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleSubmit = async () => {
        // Validate required fields
        const { MaKH, username, password, email, SoDienThoai } = formData;
        if (!MaKH || !username || (!isEditing && !password) || !email || !SoDienThoai) {
            Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ các thông tin bắt buộc', 'error');
            return;
        }

        try {
            if (isEditing) {
                await khachHangApi.update(formData.id, formData);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await khachHangApi.add(formData);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'Vui lòng thử lại.';
            Swal.fire('Lỗi!', msg, 'error');
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            id: customer.id,
            MaKH: customer.MaKH,
            HoTen: customer.User?.HoTen || customer.HoTen,
            SoDienThoai: customer.User?.SoDienThoai || customer.SoDienThoai,
            email: customer.User?.email || customer.email,
            DiaChi: customer.User?.DiaChi || customer.DiaChi,
            username: customer.User?.username || '',
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
                    await khachHangApi.delete(id);
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
            <h2 className="mb-4">Quản lý Khách hàng</h2>
            <button className="btn btn-primary mb-3" onClick={openModal}>
                Thêm khách hàng
            </button>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã KH</th>
                            <th>Tên khách hàng</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Tên đăng nhập</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerList.map((cust, idx) => (
                            <tr key={cust.id}>
                                <td>{idx + 1}</td>
                                <td>{cust.MaKH}</td>
                                <td>{cust.User?.HoTen}</td>
                                <td>{cust.User?.email}</td>
                                <td>{cust.User?.SoDienThoai}</td>
                                <td>{cust.User?.DiaChi}</td>
                                <td>{cust.User?.username}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cust)}>
                                        <i className="fas fa-edit"></i> Sửa
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cust.id)}>
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
                                    {isEditing ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Mã KH *</label>
                                            <input type="text" className="form-control" name="MaKH" value={formData.MaKH} onChange={handleChange} required />
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

export default KhachHang;
