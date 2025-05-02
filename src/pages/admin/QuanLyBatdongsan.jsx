import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import nhaDatApi from '../../api/NhaDatApi';
import { fetchNhaDatList, fetchLoaiNhaDatList } from "../../services/fetchData";
import Swal from 'sweetalert2';

function Batdongsan() {
    const [showModal, setShowModal] = useState(false);
    const [nhaDatList, setNhaDatList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loaiDatList, setLoaiDatList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

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
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [nhaDat, loaiDat] = await Promise.all([fetchNhaDatList(), fetchLoaiNhaDatList()]);
            setNhaDatList(nhaDat);
            setLoaiDatList(loaiDat);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "LoaiNhaDat_id" ? (value ? Number(value) : null) : value,
        }));
    };

    const handleSubmit = async () => {
        const { MaNhaDat, TenNhaDat, LoaiNhaDat_id } = formData;
        if (!MaNhaDat || !TenNhaDat || !LoaiNhaDat_id) {
            Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ các thông tin bắt buộc!', 'error');
            return;
        }
        if (MaNhaDat.length > 10) {
            Swal.fire('Lỗi!', 'Mã nhà đất quá dài. Vui lòng nhập lại(dưới 10 ký tự)!', 'error');
            return;
        }
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            selectedImages.forEach((img) => {
                formDataToSend.append("images", img);
            });

            if (isEditing) {
                await nhaDatApi.update(formData.id, formDataToSend); // dùng FormData
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await nhaDatApi.add(formDataToSend);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            const updatedList = await fetchNhaDatList();
            setNhaDatList(updatedList);
            closeModal();
        } catch (error) {
            console.log(error);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Vui lòng thử lại.';

            Swal.fire('Lỗi!', errorMessage, 'error');
        }
    }
    const handleEdit = (item) => {
        setFormData({
            ...item,
            LoaiNhaDat_id: item.LoaiNhaDat?.id || null,
        });
        setCurrentImages(item.hinhAnh || []);
        setSelectedImages([]); // reset ảnh mới được chọn
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
                const updatedList = await fetchNhaDatList();
                setNhaDatList(updatedList);
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
        setSelectedImages([]);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImages([]);
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
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
                            <td>{item.LoaiNhaDat?.TenLoaiDat || "Không xác định"}</td>
                            <td>{item.MoTa}</td>
                            <td>{`${item.SoNha}, ${item.Duong}, ${item.Phuong}, ${item.Quan}, ${item.ThanhPho}`}</td>
                            <td>{item.GiaBan.toLocaleString()} VNĐ</td>
                            <td>{item.DienTich} m²</td>
                            <td>{item.Huong}</td>
                            <td>{item.TrangThai === 1 ? 'Đang bán' : 'Đã bán'}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', maxWidth: '150px' }}>
                                    {item.hinhAnh?.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img.url}
                                            alt={`Hình ảnh ${idx + 1}`}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    ))}
                                </div>
                            </td>
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
                                        <label className="form-label">Mã nhà đất *</label>
                                        <input type="text" maxLength="10" className="form-control" name="MaNhaDat" value={formData.MaNhaDat} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên nhà đất *</label>
                                        <input type="text" className="form-control" name="TenNhaDat" value={formData.TenNhaDat} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Loại nhà đất *</label>
                                        <select
                                            className="form-select"
                                            name="LoaiNhaDat_id"
                                            value={formData.LoaiNhaDat_id || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Chọn loại nhà đất --</option>
                                            {loaiDatList.map(loai => (
                                                <option key={loai.id} value={Number(loai.id)}>
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
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="images"
                                            onChange={handleImageChange}
                                            multiple
                                            accept="image/*"
                                        />

                                        {/* Hiển thị ảnh hiện tại (khi edit) */}
                                        {isEditing && currentImages.length > 0 && (
                                            <div className="mt-2">
                                                <div className="d-flex flex-wrap gap-2">
                                                    {currentImages.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={typeof img === 'string' ? img : img.url}
                                                            alt={`Ảnh ${index}`}
                                                            style={{ width: "80px", height: "80px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "4px" }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hiển thị preview ảnh mới chọn */}
                                        <div className="mt-2 d-flex flex-wrap gap-2">
                                            {selectedImages.map((file, index) => (
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index}`}
                                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                />
                                            ))}
                                        </div>
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