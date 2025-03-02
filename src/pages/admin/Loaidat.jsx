import React, { useEffect, useState } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import loaiNhaDatApi from '../../api/LoaiNhaDatApi';
import Swal from 'sweetalert2';
function Loaidat() {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loaiNhaDatList, setLoaiNhaDatList] = useState([]);
    const [formData, setFormData] = useState({ id: '', MaLoaiDat: '', TenLoaiDat: '' });

    useEffect(() => {
        fetchLoaiNhaDat();
    }, []);

    const fetchLoaiNhaDat = async () => {
        try {
            const response = await loaiNhaDatApi.getAll();
            setLoaiNhaDatList(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách loại đất:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await loaiNhaDatApi.update(formData.id, {
                    MaLoaiDat: formData.MaLoaiDat,
                    TenLoaiDat: formData.TenLoaiDat
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    text: 'Loại đất đã được cập nhật.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await loaiNhaDatApi.add({
                    MaLoaiDat: formData.MaLoaiDat,
                    TenLoaiDat: formData.TenLoaiDat
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm thành công!',
                    text: 'Loại đất đã được thêm vào danh sách.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            fetchLoaiNhaDat();
            closeModal();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra, vui lòng thử lại.',
            });
        }
    };

    const handleEdit = (loaiNhaDat) => {
        setFormData(loaiNhaDat);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Bạn có chắc chắn muốn xóa?",
                text: "Hành động này không thể hoàn tác!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });
            if (result.isConfirmed) {
                await loaiNhaDatApi.delete(id);
                fetchLoaiNhaDat();
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa thành công!',
                    text: 'Loại đất đã bị xóa.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể xóa loại đất này, vui lòng thử lại.',
            });
        }
    };

    const openModal = () => {
        setFormData({ id: '', MaLoaiDat: '', TenLoaiDat: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ id: '', MaLoaiDat: '', TenLoaiDat: '' });
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Loại đất</h2>
            <p>Quản lý các loại đất ở đây.</p>
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>
                Thêm
            </button>

            {loaiNhaDatList.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã loại đất</th>
                            <th scope="col">Tên loại đất</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loaiNhaDatList.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.MaLoaiDat}</td>
                                <td>{item.TenLoaiDat}</td>
                                <td>
                                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Sửa</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-muted">Chưa có dữ liệu loại đất.</p>
            )}

            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEditing ? "Sửa loại đất" : "Thêm loại đất"}</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Mã loại đất</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="MaLoaiDat"
                                                value={formData.MaLoaiDat}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tên loại đất</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="TenLoaiDat"
                                                value={formData.TenLoaiDat}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Đóng
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                        {isEditing ? "Cập nhật" : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminPage>
    );
}

export default Loaidat;
