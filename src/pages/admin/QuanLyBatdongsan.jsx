import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import nhaDatApi from '../../api/NhaDatApi';
import { fetchNhaDatList, fetchLoaiNhaDatList } from '../../services/fetchData';
import Swal from 'sweetalert2';
import PhanTrang from '../../components/PhanTrang';
import diaChiApi from '../../api/DiaChiApi';

function Batdongsan() {
    const [showModal, setShowModal] = useState(false);
    const [nhaDatList, setNhaDatList] = useState([]);
    const [loaiDatList, setLoaiDatList] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

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

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        loadData(currentPage, 5);
        fetchProvinces();
    }, [currentPage]);

    const loadData = async (page = 1, limit = 5) => {
        try {
            const [nhaDat, loaiDat] = await Promise.all([
                fetchNhaDatList(page, limit),
                fetchLoaiNhaDatList()
            ]);

            setNhaDatList(nhaDat.data);
            if (Array.isArray(loaiDat.data)) {
                setLoaiDatList(loaiDat.data);
            } else if (Array.isArray(loaiDat)) {
                setLoaiDatList(loaiDat);
            } else {
                setLoaiDatList([]);
            }

            setCurrentPage(nhaDat.currentPage);
            setTotalPages(nhaDat.totalPages);
            setTotalItems(nhaDat.totalItems);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const data = await diaChiApi.getAllProvinces();
            setProvinces(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách tỉnh/thành:", error);
        }
    };

    const fetchDistricts = async (provinceCode) => {
        try {
            const data = await diaChiApi.getDistrictsByProvince(provinceCode);
            setDistricts(data);
            setSelectedDistrict(""); // Reset district and ward
            setSelectedWard("");
        } catch (error) {
            console.error("Lỗi khi tải danh sách quận/huyện:", error);
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            const data = await diaChiApi.getWardsByDistrict(districtCode);
            setWards(data);
            setSelectedWard("");
        } catch (error) {
            console.error("Lỗi khi tải danh sách xã/phường:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "LoaiNhaDat_id" ? (value ? Number(value) : null) : value
        }));
    };

    const handleSubmit = async () => {
        const { MaNhaDat, TenNhaDat, LoaiNhaDat_id } = formData;

        if (!MaNhaDat || !TenNhaDat || !LoaiNhaDat_id || !selectedProvince || !selectedDistrict || !selectedWard) {
            Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ các thông tin bắt buộc!', 'error');
            return;
        }
        if (MaNhaDat.length > 10) {
            Swal.fire('Lỗi!', 'Mã nhà đất quá dài. Vui lòng nhập lại (dưới 10 ký tự)!', 'error');
            return;
        }

        try {
            showLoading(); // <-- bật loading

            const formDataToSend = new FormData();
            Object.entries({
                ...formData,
                ThanhPho: selectedProvince,
                Quan: selectedDistrict,
                Phuong: selectedWard
            }).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            selectedImages.forEach(img => {
                formDataToSend.append("images", img);
            });

            if (isEditing) {
                await nhaDatApi.update(formData.id, formDataToSend);
                hideLoading(); // <-- tắt loading
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await nhaDatApi.add(formDataToSend);
                hideLoading();
                Swal.fire('Thêm thành công!', '', 'success');
            }

            window.location.reload();
            closeModal();
        } catch (error) {
            hideLoading();
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Vui lòng thử lại.';
            Swal.fire('Lỗi!', errorMessage, 'error');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            ...item,
            LoaiNhaDat_id: item.LoaiNhaDat?.id || null,
        });
        setSelectedProvince(item.ThanhPho || "");
        fetchDistricts(item.ThanhPho).then(() => {
            setSelectedDistrict(item.Quan || "");
            fetchWards(item.Quan).then(() => {
                setSelectedWard(item.Phuong || "");
            });
        });
        setSelectedImages([]);
        setCurrentImages(item.hinhAnh);
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
                showLoading(); // bật loading
                await nhaDatApi.delete(id);
                hideLoading(); // tắt loading
                Swal.fire('Đã xóa!', 'Bất động sản đã bị xóa.', 'success');
                window.location.reload();
            } catch (error) {
                hideLoading();
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
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setIsEditing(false);
        setShowModal(true);
        setSelectedImages([]);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            MaNhaDat: "",
            TenNhaDat: "",
            LoaiNhaDat_id: null,
            MoTa: "",
            GiaBan: "",
            DienTich: "",
            Huong: "",
            TrangThai: 1,
            ThanhPho: "",
            Quan: "",
            Phuong: "",
            Duong: "",
            SoNha: ""
        });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setSelectedImages([]);
        setCurrentImages([]);
        setIsEditing(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };
    const showLoading = () => {
        Swal.fire({
            title: 'Đang xử lý...',
            text: 'Vui lòng chờ trong giây lát',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };
    const hideLoading = () => {
        Swal.close();
    };
    return (
        <AdminPage>
            <h2 className="mb-4">Bất động sản</h2>
            <p className="text-muted">Tổng số bất động sản: {totalItems}</p>
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>Thêm bất động sản</button>
            {nhaDatList.length > 0 ? (
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
                                <td>{`${item.Duong}, ${item.Phuong}, ${item.Quan}, ${item.ThanhPho}`}</td>
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
            ) : (
                <p className="text-center text-muted">Chưa có dữ liệu nhà đất.</p>
            )}

            <PhanTrang
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
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
                                        <input type="text" className="form-control mt-2" name="Duong" value={formData.Duong} onChange={handleChange} placeholder="Đường" />
                                        <div className="mb-3 mt-2">
                                            <label className="form-label">Tỉnh/Thành *</label>
                                            <select
                                                className="form-select"
                                                value={selectedProvince}
                                                onChange={(e) => {
                                                    setSelectedProvince(e.target.value);
                                                    fetchDistricts(e.target.value);
                                                }}
                                            >
                                                <option value="">-- Chọn tỉnh/thành --</option>
                                                {provinces.map(province => (
                                                    <option key={province.code || province.Id} value={province.code || province.Id}>
                                                        {province.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Quận/Huyện *</label>
                                            <select
                                                className="form-select"
                                                value={selectedDistrict}
                                                onChange={(e) => {
                                                    setSelectedDistrict(e.target.value);
                                                    fetchWards(e.target.value);
                                                }}
                                                disabled={!selectedProvince}
                                            >
                                                <option value="">-- Chọn quận/huyện --</option>
                                                {districts.map(district => (
                                                    <option key={district.code || district.Id} value={district.code || district.Id}>
                                                        {district.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phường/Xã *</label>
                                            <select
                                                className="form-select"
                                                value={selectedWard}
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                                disabled={!selectedDistrict}
                                            >
                                                <option value="">-- Chọn phường/xã --</option>
                                                {wards.map(ward => (
                                                    <option key={ward.code || ward.Id} value={ward.code || ward.Id}>
                                                        {ward.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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