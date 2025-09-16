import React, { useState, useEffect } from "react";
import AdminPage from "./AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";
import nhaDatApi from "../../api/NhaDatApi";
import { fetchNhaDatList, fetchLoaiNhaDatList } from "../../services/fetchData";
import Swal from "sweetalert2";
import PhanTrang from "../../components/PhanTrang";
import diaChiApi from "../../api/DiaChiApi";
import "../../style/QuanLyBatDongSan.css";
import SearchAdmin from "../../components/SearchAdmin";

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
        id: "",
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
        SoNha: "",
    });
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [filters, setFilters] = useState({
        searchText: "",
        ThanhPho: "",
        TenLoaiDat: "",
        GiaMin: "",
        GiaMax: "",
        DienTichMin: "",
        DienTichMax: "",
    });

    useEffect(() => {
        loadData(currentPage, 5, filters);
        fetchProvinces();
    }, [currentPage, filters]);

    const loadData = async (page = 1, limit = 5, filters = {}) => {
        try {
            const [nhaDat, loaiDat] = await Promise.all([
                fetchNhaDatList(page, limit, filters),
                fetchLoaiNhaDatList(),
            ]);

            setNhaDatList(nhaDat.data || []);
            if (Array.isArray(loaiDat.data)) {
                setLoaiDatList(loaiDat.data);
            } else if (Array.isArray(loaiDat)) {
                setLoaiDatList(loaiDat);
            } else {
                setLoaiDatList([]);
            }
            setCurrentPage(nhaDat.currentPage || 1);
            setTotalPages(nhaDat.totalPages || 1);
            setTotalItems(nhaDat.totalItems || 0);
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
            setSelectedDistrict("");
            setSelectedWard("");
            return data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách quận/huyện:", error);
            return [];
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            const data = await diaChiApi.getWardsByDistrict(districtCode);
            setWards(data);
            setSelectedWard("");
            return data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách xã/phường:", error);
            return [];
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSearch = (newFilters = filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        loadData(1, 5, newFilters);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "LoaiNhaDat_id" ? (value ? Number(value) : null) : value,
        }));
    };

    const handleSubmit = async () => {
        const { MaNhaDat, TenNhaDat, LoaiNhaDat_id } = formData;

        if (!MaNhaDat || !TenNhaDat || !LoaiNhaDat_id || !selectedProvince || !selectedDistrict) {
            Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ các thông tin bắt buộc!', 'error');
            return;
        }

        if (MaNhaDat.length > 10) {
            Swal.fire('Lỗi!', 'Mã nhà đất quá dài. Vui lòng nhập lại (dưới 10 ký tự)!', 'error');
            return;
        }

        try {
            showLoading();
            const provinceName = provinces.find(p => (p.code || p.Id) === selectedProvince)?.Name.replace(/Thành phố |Tỉnh /, "") || "";
            const districtName = districts.find(d => (d.code || d.Id) === selectedDistrict)?.Name.replace(/Quận |Huyện /, "") || "";
            const wardName = wards.find(w => (w.code || w.Id) === selectedWard)?.Name.replace(/Phường |Xã /, "") || "";
            const formDataToSend = new FormData();
            Object.entries({
                ...formData,
                ThanhPho: provinceName,
                Quan: districtName,
                Phuong: wardName,
            }).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            selectedImages.forEach(img => {
                formDataToSend.append("images", img);
            });

            if (isEditing) {
                await nhaDatApi.update(formData.id, formDataToSend);
                hideLoading();
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

    const handleEdit = async (item) => {
        setIsEditing(true);
        setShowModal(true);
        console.log("Editing item:", item);
        setFormData({
            id: item.id,
            MaNhaDat: item.MaNhaDat,
            TenNhaDat: item.TenNhaDat,
            LoaiNhaDat_id: item.LoaiNhaDat?.id || null,
            MoTa: item.MoTa,
            GiaBan: item.GiaBan,
            DienTich: item.DienTich,
            Huong: item.Huong,
            TrangThai: item.TrangThai,
            Duong: item.Duong || "",
            SoNha: item.SoNha || "",
            ThanhPho: item.ThanhPho || "",
            Quan: item.Quan || "",
            Phuong: item.Phuong || "",
        });

        const province = provinces.find(
            (p) => p.Name.replace("Thành phố ", "") === item.ThanhPho || p.Name === item.ThanhPho
        );
        const provinceCode = province?.code || province?.Id || "";
        setSelectedProvince(provinceCode);

        if (provinceCode) {
            const districtData = await fetchDistricts(provinceCode);
            const district = districtData.find(
                (d) =>
                    d.Name.replace("Quận ", "") === item.Quan ||
                    d.Name.replace("Huyện ", "") === item.Quan ||
                    d.Name === item.Quan
            );
            const districtCode = district?.code || district?.Id || "";
            setSelectedDistrict(districtCode);

            if (districtCode) {
                const wardData = await fetchWards(districtCode);
                const ward = wardData.find(
                    (w) =>
                        w.Name.replace("Phường ", "") === item.Phuong ||
                        w.Name.replace("Xã ", "") === item.Phuong ||
                        w.Name === item.Phuong
                );
                setSelectedWard(ward?.code || ward?.Id || "");
            }
        }

        setCurrentImages(item.hinhAnh || []);
        setSelectedImages([]);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Xác nhận xóa",
            text: "Bạn có chắc chắn muốn xóa bất động sản này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, xóa!",
            cancelButtonText: "Hủy",
        });

        if (confirm.isConfirmed) {
            try {
                showLoading();
                await nhaDatApi.delete(id);
                hideLoading();
                await Swal.fire({
                    title: "Đã xóa!",
                    text: "Bất động sản đã bị xóa.",
                    icon: "success",
                    timer: 1500, // Hiển thị thông báo trong 1.5 giây
                    showConfirmButton: false, // Ẩn nút xác nhận
                });
                window.location.reload(); // Reload sau khi thông báo hiển thị xong
            } catch (error) {
                hideLoading();
                console.error("Lỗi khi xóa bất động sản:", error); // Log lỗi để debug
                Swal.fire("Lỗi!", error?.response?.data?.error || "Không thể xóa.", "error");
            }
        }
    };

    const openModal = () => {
        setFormData({
            id: "",
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
            SoNha: "",
        });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setIsEditing(false);
        setShowModal(true);
        setSelectedImages([]);
        setCurrentImages([]);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            id: "",
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
            SoNha: "",
        });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setSelectedImages([]);
        setCurrentImages([]);
        setIsEditing(false);
    };

    const showLoading = () => {
        Swal.fire({
            title: "Đang xử lý...",
            text: "Vui lòng chờ trong giây lát",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    const hideLoading = () => {
        Swal.close();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prevImages) => [...prevImages, ...files]);
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Bất động sản</h2>
            <SearchAdmin
                filters={filters}
                handleSearchInputChange={handleSearchInputChange}
                onSearch={onSearch}
                provinces={provinces}
                loaiDatList={loaiDatList}
            />
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>
                Thêm bất động sản
            </button>
            {nhaDatList.length > 0 ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã nhà đất</th>
                                <th>Tên nhà đất</th>
                                <th>Loại</th>
                                <th>Mô tả</th>
                                <th>Thành phố</th>
                                <th>Quận/Huyện</th>
                                <th>Phường/Xã</th>
                                <th>Đường</th>
                                <th>Số nhà</th>
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
                                    <td>{item.ThanhPho || ""}</td>
                                    <td>{item.Quan || ""}</td>
                                    <td>{item.Phuong || ""}</td>
                                    <td>{item.Duong || ""}</td>
                                    <td>{item.SoNha || ""}</td>
                                    <td>{item.GiaBan.toLocaleString()} VNĐ</td>
                                    <td>{item.DienTich} m²</td>
                                    <td>{item.Huong || ""}</td>
                                    <td className={`${item.TrangThai === 1 ? "text-success" : "text-danger"} fw-bold`}>
                                        {item.TrangThai === 1 ? "Đang bán" : "Đã bán"}
                                    </td>
                                    <td>
                                        <div className="image-list">
                                            {item.hinhAnh?.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.url}
                                                    alt={`Hình ảnh ${idx + 1}`}
                                                    className="post-image"
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-warning action-btn edit-btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <i className="fas fa-edit icon-small"></i> Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger action-btn delete-btn"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="fas fa-trash icon-small"></i> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                <h5 className="modal-title">
                                    {isEditing ? "Cập nhật bất động sản" : "Thêm bất động sản"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Mã nhà đất *</label>
                                        <input
                                            type="text"
                                            maxLength="10"
                                            className="form-control"
                                            name="MaNhaDat"
                                            value={formData.MaNhaDat}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên nhà đất *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="TenNhaDat"
                                            value={formData.TenNhaDat}
                                            onChange={handleChange}
                                        />
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
                                            {loaiDatList.map((loai) => (
                                                <option key={loai.id} value={Number(loai.id)}>
                                                    {loai.TenLoaiDat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="MoTa"
                                            value={formData.MoTa}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <input
                                            type="text"
                                            className="form-control address-input"
                                            name="SoNha"
                                            value={formData.SoNha}
                                            onChange={handleChange}
                                            placeholder="Số nhà"
                                        />
                                        <input
                                            type="text"
                                            className="form-control address-input"
                                            name="Duong"
                                            value={formData.Duong}
                                            onChange={handleChange}
                                            placeholder="Đường"
                                        />
                                        <div className="mb-3 address-select">
                                            <label className="form-label">* Tỉnh/Thành</label>
                                            <select
                                                className="form-select"
                                                value={selectedProvince}
                                                onChange={(e) => {
                                                    setSelectedProvince(e.target.value);
                                                    fetchDistricts(e.target.value);
                                                }}
                                            >
                                                <option value="">-- Chọn tỉnh/thành --</option>
                                                {provinces.map((province) => (
                                                    <option
                                                        key={province.code || province.Id}
                                                        value={province.code || province.Id}
                                                    >
                                                        {province.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 address-select">
                                            <label className="form-label">* Quận/Huyện</label>
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
                                                {districts.map((district) => (
                                                    <option
                                                        key={district.code || district.Id}
                                                        value={district.code || district.Id}
                                                    >
                                                        {district.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3 address-select">
                                            <label className="form-label">* Phường/Xã</label>
                                            <select
                                                className="form-select"
                                                value={selectedWard}
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                                disabled={!selectedDistrict}
                                            >
                                                <option value="">-- Chọn phường/xã --</option>
                                                {wards.map((ward) => (
                                                    <option
                                                        key={ward.code || ward.Id}
                                                        value={ward.code || ward.Id}
                                                    >
                                                        {ward.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3 property-details">
                                        <div className="col-md-4">
                                            <label className="form-label">Giá</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="GiaBan"
                                                value={formData.GiaBan}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Diện tích</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="DienTich"
                                                value={formData.DienTich}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Hướng</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Huong"
                                                value={formData.Huong}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="mb-3">
                                            <label className="form-label">Trạng thái *</label>
                                            <select
                                                className="form-select"
                                                name="TrangThai"
                                                value={formData.TrangThai}
                                                onChange={handleChange}
                                            >
                                                <option value={1}>Đang bán</option>
                                                <option value={0}>Đã bán</option>
                                            </select>
                                        </div>
                                    )}
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
                                            <div className="image-preview-container">
                                                {currentImages.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={typeof img === "string" ? img : img.url}
                                                        alt={`Ảnh ${index}`}
                                                        className="image-preview"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {selectedImages.length > 0 && (
                                            <div className="image-preview-container">
                                                {selectedImages.map((file, index) => (
                                                    <img
                                                        key={index}
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index}`}
                                                        className="image-preview"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    {isEditing ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminPage>
    );
}

export default Batdongsan;