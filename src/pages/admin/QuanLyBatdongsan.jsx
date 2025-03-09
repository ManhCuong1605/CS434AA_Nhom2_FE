import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import nhaDatApi from '../../api/NhaDatApi';
import loaiNhaDatApi from '../../api/LoaiNhaDatApi';
import Swal from 'sweetalert2';

function Batdongsan() {
    const [showModal, setShowModal] = useState(false);
    const [nhaDatList, setNhaDatList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loaiDatList, setLoaiDatList] = useState([]);
    const [formData, setFormData] = useState({
        MaNhaDat: "",
        TenNhaDat: "",
        LoaiNhaDat_id: null,
        MoTa: "",
        GiaBan: "",
        DienTich: "",
        Huong: "",
        TrangThai: 1,
        HinhAnh: "",
        ThanhPho: "",
        Quan: "",
        Phuong: "",
        Duong: "",
        SoNha: ""
    });

    useEffect(() => {
        fetchNhaDat();
        fetchLoaiDat(); // Gọi hàm fetch loại nhà đất
    }, []);

    const fetchNhaDat = async () => {
        try {
            const response = await nhaDatApi.getAll();
            setNhaDatList(response.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const fetchLoaiDat = async () => {
        try {
            const response = await loaiNhaDatApi.getAll();
            setLoaiDatList(response.data);
        } catch (error) {
            console.error("Lỗi khi tải loại đất:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "LoaiNhaDat_id" ? Number(value) : value, // Chuyển đổi sang số nếu là LoaiNhaDat_id
        }));
    };

    const handleSubmit = async () => {
        console.log("Form Data trước khi gửi:", formData); // Kiểm tra giá trị formData
        try {
            if (isEditing) {
                await nhaDatApi.update(formData.id, formData);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await nhaDatApi.add(formData);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            fetchNhaDat();
            closeModal();
        } catch (error) {
            Swal.fire('Lỗi!', 'Vui lòng thử lại.', 'error');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            ...item,
            LoaiNhaDat_id: item.LoaiNhaDat_id || null,
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa bất động sản này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Hủy'
        });

        if (confirm.isConfirmed) {
            try {
                await nhaDatApi.delete(id);
                Swal.fire('Đã xóa!', 'Bất động sản đã bị xóa.', 'success');
                fetchNhaDat();
            } catch (error) {
                Swal.fire('Lỗi!', 'Không thể xóa.', 'error');
            }
        }
    };

    const openModal = () => {
        setFormData({
            MaNhaDat: "",
            TenNhaDat: "",
            LoaiNhaDat_id: null,
            MoTa: "",
            GiaBan: "",
            DienTich: "",
            Huong: "",
            TrangThai: 1,
            HinhAnh: "",
            ThanhPho: "",
            Quan: "",
            Phuong: "",
            Duong: "",
            SoNha: ""
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Bất động sản</h2>
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>Thêm bất động sản</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã nhà đất</th>
                        <th>Tên nhà đất</th>
                        <th>Loại</th>
                        <th>Mô tả</th>
                        <th>Địa chỉ</th>
                        <th>Giá</th>
                        <th>Diện tích</th>
                        <th>Hướng</th>
                        <th>Trạng thái</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {nhaDatList.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.MaNhaDat}</td>
                            <td>{item.TenNhaDat}</td>
                            <td>{item.LoaiNhaDat_id}</td>
                            <td>{item.MoTa}</td>
                            <td>{`${item.SoNha}, ${item.Duong}, ${item.Phuong}, ${item.Quan}, ${item.ThanhPho}`}</td>
                            <td>{item.GiaBan.toLocaleString()} VNĐ</td>
                            <td>{item.DienTich} m²</td>
                            <td>{item.Huong}</td>
                            <td>{item.TrangThai === 1 ? 'Đang bán' : 'Đã bán'}</td>
                            <td><img src={item.HinhAnh} alt="Hình ảnh" width="50" /></td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Sửa</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Cập nhật bất động sản' : 'Thêm bất động sản'}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Mã nhà đất</label>
                                        <input type="text" className="form-control" name="MaNhaDat" value={formData.MaNhaDat} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên nhà đất</label>
                                        <input type="text" className="form-control" name="TenNhaDat" value={formData.TenNhaDat} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Loại nhà đất</label>
                                        <select
                                            className="form-select"
                                            name="LoaiNhaDat_id"
                                            value={formData.LoaiNhaDat_id || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Chọn loại nhà đất --</option>
                                            {loaiDatList.map(loai => (
                                                <option key={loai.id} value={loai.id}>
                                                    {loai.TenLoaiDat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <input type="text" className="form-control" name="MoTa" value={formData.MoTa} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <input type="text" className="form-control" name="SoNha" value={formData.SoNha} onChange={handleChange} placeholder="Số nhà" />
                                        <input type="text" className="form-control mt-2" name="Duong" value={formData.Duong} onChange={handleChange} placeholder="Đường" />
                                        <input type="text" className="form-control mt-2" name="Phuong" value={formData.Phuong} onChange={handleChange} placeholder="Phường" />
                                        <input type="text" className="form-control mt-2" name="Quan" value={formData.Quan} onChange={handleChange} placeholder="Quận" />
                                        <input type="text" className="form-control mt-2" name="ThanhPho" value={formData.ThanhPho} onChange={handleChange} placeholder="Thành phố" />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Giá</label>
                                            <input type="text" className="form-control" name="GiaBan" value={formData.GiaBan} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Diện tích</label>
                                            <input type="text" className="form-control" name="DienTich" value={formData.DienTich} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Hướng</label>
                                            <input type="text" className="form-control" name="Huong" value={formData.Huong} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input type="file" className="form-control" name="HinhAnh" onChange={handleChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>{isEditing ? 'Cập nhật' : 'Thêm'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminPage>
    );
}

export default Batdongsan;