import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import diaChiApi from "../../api/DiaChiApi.jsx";
import Swal from "sweetalert2";

function QuanLyBaiViet() {
    const [baiViet, setBaiViet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [formData, setFormData] = useState({
        id: null,
        TieuDe: "",
        ThanhPho: "",
        Quan: "",
        Phuong: "",
        DiaChi: "",
        MoTa: "",
        GiaBan: "",
        DienTich: "",
        Huong: "",
        TrangThai: 1,
        hinhAnh: [],
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [giaHienThi, setGiaHienThi] = useState("");
    const [dienTichHienThi, setDienTichHienThi] = useState("");
    const [addressNames, setAddressNames] = useState({ provinces: {}, districts: {}, wards: {} });

    // Load provinces and address names on mount
    useEffect(() => {
        let isMounted = true;
        const loadProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const data = await diaChiApi.getAllProvinces();
                if (isMounted && data && Array.isArray(data) && data.length > 0) {
                    const formattedProvinces = data.map((province) => ({
                        code: province.Id || province.code,
                        name: province.Name || province.name,
                        districts: province.Districts || province.districts,
                    }));
                    const provinceMap = data.reduce((acc, province) => {
                        acc[province.Id || province.code] = province.Name || province.name;
                        return acc;
                    }, {});
                    setProvinces(formattedProvinces);
                    setAddressNames((prev) => ({ ...prev, provinces: provinceMap }));
                }
            } catch (error) {
                console.error("Lỗi khi load tỉnh/thành phố:", error);
            } finally {
                if (isMounted) setLoadingProvinces(false);
            }
        };
        loadProvinces();
        return () => {
            isMounted = false;
        };
    }, []);

    // Load districts when province changes
    useEffect(() => {
        let isMounted = true;
        if (formData.ThanhPho) {
            const loadDistricts = async () => {
                try {
                    setLoadingDistricts(true);
                    const data = await diaChiApi.getDistrictsByProvince(formData.ThanhPho);
                    const formattedDistricts = data.map((district) => ({
                        code: district.Id || district.code,
                        name: district.Name || district.name,
                        wards: district.Wards || district.wards,
                    }));
                    const districtMap = data.reduce((acc, district) => {
                        acc[district.Id || district.code] = district.Name || district.name;
                        return acc;
                    }, {});
                    if (isMounted) {
                        setDistricts(formattedDistricts);
                        setAddressNames((prev) => ({ ...prev, districts: { ...prev.districts, ...districtMap } }));
                    }
                } catch (error) {
                    console.error("Lỗi khi load quận/huyện:", error);
                } finally {
                    if (isMounted) setLoadingDistricts(false);
                }
            };
            loadDistricts();
        } else {
            setDistricts([]);
            setFormData((prev) => ({ ...prev, Quan: "", Phuong: "" }));
        }
        return () => {
            isMounted = false;
        };
    }, [formData.ThanhPho]);

    // Load wards when district changes
    useEffect(() => {
        let isMounted = true;
        if (formData.Quan) {
            const loadWards = async () => {
                try {
                    setLoadingWards(true);
                    const data = await diaChiApi.getWardsByDistrict(formData.Quan);
                    const formattedWards = data.map((ward) => ({
                        code: ward.Id || ward.code,
                        name: ward.Name || ward.name,
                    }));
                    const wardMap = data.reduce((acc, ward) => {
                        acc[ward.Id || ward.code] = ward.Name || ward.name;
                        return acc;
                    }, {});
                    if (isMounted) {
                        setWards(formattedWards);
                        setAddressNames((prev) => ({ ...prev, wards: { ...prev.wards, ...wardMap } }));
                    }
                } catch (error) {
                    console.error("Lỗi khi load phường/xã:", error);
                } finally {
                    if (isMounted) setLoadingWards(false);
                }
            };
            loadWards();
        } else {
            setWards([]);
            setFormData((prev) => ({ ...prev, Phuong: "" }));
        }
        return () => {
            isMounted = false;
        };
    }, [formData.Quan]);

    // Load danh sách bài viết
    const loadData = () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        quanLyBaiVietApi
            .getTatCa(token)
            .then((res) => {
                setBaiViet(res.data);
                setLoading(false);
            })
            .catch(() => {
                Swal.fire("Lỗi!", "Lỗi khi lấy danh sách bài viết!", "error");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Lọc bài viết theo trạng thái
    const getFilteredBaiViet = () => {
        switch (activeTab) {
            case "pending":
                return baiViet.filter((bv) => bv.TrangThai === 1);
            case "approved":
                return baiViet.filter((bv) => bv.TrangThai === 2);
            case "rejected":
                return baiViet.filter((bv) => bv.TrangThai === 3);
            default:
                return baiViet;
        }
    };

    // Tính số lượng bài viết theo trạng thái
    const getBaiVietCount = (status) => {
        switch (status) {
            case "pending":
                return baiViet.filter((bv) => bv.TrangThai === 1).length;
            case "approved":
                return baiViet.filter((bv) => bv.TrangThai === 2).length;
            case "rejected":
                return baiViet.filter((bv) => bv.TrangThai === 3).length;
            default:
                return baiViet.length;
        }
    };

    // Xử lý thay đổi input trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "GiaBan") {
            const rawValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
            const formatted = new Intl.NumberFormat("vi-VN").format(Number(rawValue || 0));
            setGiaHienThi(formatted);
            setFormData((prev) => ({ ...prev, GiaBan: rawValue }));
        } else if (name === "DienTich") {
            const rawValue = value.replace(/\./g, "").replace(/[^0-9.]/g, "");
            const formatted = new Intl.NumberFormat("vi-VN").format(Number(rawValue || 0));
            setDienTichHienThi(formatted);
            setFormData((prev) => ({ ...prev, DienTich: rawValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Xử lý chọn ảnh mới
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
    };

    // Mở modal thêm mới
    const openModalAdd = () => {
        setFormData({
            id: null,
            TieuDe: "",
            ThanhPho: "",
            Quan: "",
            Phuong: "",
            DiaChi: "",
            MoTa: "",
            GiaBan: "",
            DienTich: "",
            Huong: "",
            TrangThai: 1,
            hinhAnh: [],
        });
        setSelectedImages([]);
        setCurrentImages([]);
        setGiaHienThi("");
        setDienTichHienThi("");
        setDistricts([]);
        setWards([]);
        setIsEditing(false);
        setShowModal(true);
    };

    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedImages([]);
        setCurrentImages([]);
    };

    // Validation
    const validate = () => {
        let errors = {};
        if (!formData.TieuDe.trim()) errors.TieuDe = "Vui lòng nhập tiêu đề";
        if (!formData.ThanhPho) errors.ThanhPho = "Vui lòng chọn thành phố";
        if (!formData.Quan) errors.Quan = "Vui lòng chọn quận/huyện";
        if (!formData.Phuong) errors.Phuong = "Vui lòng chọn phường/xã";
        if (!formData.DiaChi.trim()) errors.DiaChi = "Vui lòng nhập địa chỉ";
        if (!formData.MoTa.trim()) errors.MoTa = "Vui lòng nhập mô tả";
        if (!formData.GiaBan) errors.GiaBan = "Vui lòng nhập giá";
        else if (isNaN(formData.GiaBan) || Number(formData.GiaBan) <= 0)
            errors.GiaBan = "Giá phải là số dương";
        if (!formData.DienTich) errors.DienTich = "Vui lòng nhập diện tích";
        else if (isNaN(formData.DienTich) || Number(formData.DienTich) <= 0)
            errors.DienTich = "Diện tích phải là số dương";
        return errors;
    };

    // Gọi API tạo hoặc sửa bài viết
    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            Swal.fire("Lỗi!", "Vui lòng điền đủ các trường bắt buộc!", "error");
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append("TieuDe", formData.TieuDe);
            dataToSend.append("ThanhPho", formData.ThanhPho);
            dataToSend.append("Quan", formData.Quan);
            dataToSend.append("Phuong", formData.Phuong);
            dataToSend.append("DiaChi", formData.DiaChi);
            dataToSend.append("MoTa", formData.MoTa);
            dataToSend.append("GiaBan", formData.GiaBan);
            dataToSend.append("DienTich", formData.DienTich);
            dataToSend.append("Huong", formData.Huong);
            dataToSend.append("TrangThai", formData.TrangThai);

            selectedImages.forEach((img) => {
                dataToSend.append("images", img);
            });

            const token = localStorage.getItem("token");

            if (isEditing) {
                await quanLyBaiVietApi.capNhatBaiViet(formData.id, dataToSend, token);
                Swal.fire("Cập nhật thành công!", "", "success");
            } else {
                await quanLyBaiVietApi.taoBaiViet(dataToSend, token);
                Swal.fire("Thêm thành công!", "Bài viết đang chờ duyệt.", "success");
            }

            loadData();
            closeModal();
        } catch (error) {
            console.error(error);
            const errorMsg = error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
            Swal.fire("Lỗi!", errorMsg, "error");
        }
    };

    // Sửa bài viết
    const handleEdit = (bv) => {
        setFormData({
            id: bv.id,
            TieuDe: bv.TieuDe || "",
            ThanhPho: bv.ThanhPho || "",
            Quan: bv.Quan || "",
            Phuong: bv.Phuong || "",
            DiaChi: bv.DiaChi || "",
            MoTa: bv.MoTa || "",
            GiaBan: bv.GiaBan || "",
            DienTich: bv.DienTich || "",
            Huong: bv.Huong || "",
            TrangThai: bv.TrangThai,
            hinhAnh: bv.hinhAnh || [],
        });
        setGiaHienThi(new Intl.NumberFormat("vi-VN").format(Number(bv.GiaBan || 0)));
        setDienTichHienThi(new Intl.NumberFormat("vi-VN").format(Number(bv.DienTich || 0)));
        setCurrentImages(bv.hinhAnh || []);
        setSelectedImages([]);
        setIsEditing(true);
        setShowModal(true);
    };

    // Duyệt bài viết
    const handleDuyet = async (id) => {
        const result = await Swal.fire({
            title: "Bạn có chắc muốn duyệt bài viết này?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Duyệt",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setActionLoading(id);
            const token = localStorage.getItem("token");
            try {
                await quanLyBaiVietApi.duyet(id, token);
                Swal.fire("Đã duyệt!", "Bài viết đã được duyệt thành công.", "success");
                loadData();
            } catch (err) {
                console.error("Lỗi khi duyệt bài viết:", err.response || err);
                Swal.fire("Lỗi", "Không thể duyệt bài viết. Vui lòng thử lại.", "error");
            }
            setActionLoading(null);
        }
    };

    // Từ chối bài viết
    const handleTuChoi = async (id) => {
        const result = await Swal.fire({
            title: "Bạn có chắc muốn từ chối bài viết này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Từ chối",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setActionLoading(id);
            const token = localStorage.getItem("token");
            try {
                await quanLyBaiVietApi.tuChoi(id, token);
                Swal.fire("Đã từ chối!", "Bài viết đã bị từ chối.", "success");
                loadData();
            } catch (err) {
                console.error("Lỗi khi từ chối bài viết:", err.response || err);
                Swal.fire("Lỗi", "Không thể từ chối bài viết. Vui lòng thử lại.", "error");
            }
            setActionLoading(null);
        }
    };

    // Xóa bài viết
    const handleXoa = async (id) => {
        const result = await Swal.fire({
            title: "Bạn có chắc muốn xóa bài viết này?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#d33",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setActionLoading(id);
            const token = localStorage.getItem("token");
            try {
                await quanLyBaiVietApi.xoaBaiViet(id, token);
                Swal.fire("Đã xóa!", "Bài viết đã được xóa thành công.", "success");
                loadData();
            } catch (err) {
                console.error("Lỗi khi xóa bài viết:", err.response || err);
                Swal.fire("Lỗi", "Không thể xóa bài viết. Vui lòng thử lại.", "error");
            }
            setActionLoading(null);
        }
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Quản lý bài viết</h2>
            <button onClick={openModalAdd} className="btn btn-primary mb-3">
                Thêm bài viết
            </button>

            {/* Tabs phân loại bài viết */}
            <div className="mb-4">
                <ul className="nav nav-tabs" id="baiVietTabs" role="tablist" style={{ borderBottom: "2px solid #dee2e6" }}>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                            type="button"
                            role="tab"
                            style={{
                                border: "none",
                                borderBottom: activeTab === "all" ? "3px solid #007bff" : "none",
                                color: activeTab === "all" ? "#007bff" : "#6c757d",
                                fontWeight: activeTab === "all" ? "600" : "400",
                                padding: "12px 20px",
                                backgroundColor: "transparent",
                            }}
                        >
                            <i className="fas fa-list me-2"></i>
                            Tất cả
                            <span className="badge bg-secondary ms-2">{getBaiVietCount("all")}</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                            onClick={() => setActiveTab("pending")}
                            type="button"
                            role="tab"
                            style={{
                                border: "none",
                                borderBottom: activeTab === "pending" ? "3px solid #ffc107" : "none",
                                color: activeTab === "pending" ? "#856404" : "#6c757d",
                                fontWeight: activeTab === "pending" ? "600" : "400",
                                padding: "12px 20px",
                                backgroundColor: "transparent",
                            }}
                        >
                            <i className="fas fa-clock me-2"></i>
                            Chờ duyệt
                            <span className="badge bg-warning ms-2">{getBaiVietCount("pending")}</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
                            onClick={() => setActiveTab("approved")}
                            type="button"
                            role="tab"
                            style={{
                                border: "none",
                                borderBottom: activeTab === "approved" ? "3px solid #28a745" : "none",
                                color: activeTab === "approved" ? "#155724" : "#6c757d",
                                fontWeight: activeTab === "approved" ? "600" : "400",
                                padding: "12px 20px",
                                backgroundColor: "transparent",
                            }}
                        >
                            <i className="fas fa-check-circle me-2"></i>
                            Đã duyệt
                            <span className="badge bg-success ms-2">{getBaiVietCount("approved")}</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "rejected" ? "active" : ""}`}
                            onClick={() => setActiveTab("rejected")}
                            type="button"
                            role="tab"
                            style={{
                                border: "none",
                                borderBottom: activeTab === "rejected" ? "3px solid #dc3545" : "none",
                                color: activeTab === "rejected" ? "#721c24" : "#6c757d",
                                fontWeight: activeTab === "rejected" ? "600" : "400",
                                padding: "12px 20px",
                                backgroundColor: "transparent",
                            }}
                        >
                            <i className="fas fa-times-circle me-2"></i>
                            Đã từ chối
                            <span className="badge bg-danger ms-2">{getBaiVietCount("rejected")}</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Modal Thêm/Sửa bài viết */}
            {showModal && (
                <div className="modal d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? "Cập nhật bài viết" : "Thêm bài viết"}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Tiêu đề <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="TieuDe"
                                            value={formData.TieuDe}
                                            onChange={handleChange}
                                            placeholder="Nhập tiêu đề bài viết"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Thành phố <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="ThanhPho"
                                                className="form-select"
                                                value={formData.ThanhPho}
                                                onChange={handleChange}
                                                disabled={loadingProvinces}
                                            >
                                                <option value="">Chọn thành phố</option>
                                                {provinces.map((province) => (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingProvinces && (
                                                <div className="mt-1">
                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                    Đang tải...
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Quận/Huyện <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="Quan"
                                                className="form-select"
                                                value={formData.Quan}
                                                onChange={handleChange}
                                                disabled={!formData.ThanhPho || loadingDistricts}
                                            >
                                                <option value="">Chọn quận/huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingDistricts && (
                                                <div className="mt-1">
                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                    Đang tải...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Phường/Xã <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="Phuong"
                                                className="form-select"
                                                value={formData.Phuong}
                                                onChange={handleChange}
                                                disabled={!formData.Quan || loadingWards}
                                            >
                                                <option value="">Chọn phường/xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingWards && (
                                                <div className="mt-1">
                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                    Đang tải...
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hướng</label>
                                            <select
                                                name="Huong"
                                                className="form-select"
                                                value={formData.Huong}
                                                onChange={handleChange}
                                            >
                                                <option value="">Chọn hướng</option>
                                                <option value="Đông">Đông</option>
                                                <option value="Tây">Tây</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Bắc">Bắc</option>
                                                <option value="Đông Nam">Đông Nam</option>
                                                <option value="Đông Bắc">Đông Bắc</option>
                                                <option value="Tây Nam">Tây Nam</option>
                                                <option value="Tây Bắc">Tây Bắc</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Địa chỉ chi tiết <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="DiaChi"
                                            value={formData.DiaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, khu vực...)"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Mô tả <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="MoTa"
                                            rows={4}
                                            value={formData.MoTa}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả chi tiết về bất động sản..."
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Giá bán <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="GiaBan"
                                                value={giaHienThi}
                                                onChange={handleChange}
                                                placeholder="Nhập giá bán"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Diện tích (m²) <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="DienTich"
                                                value={dienTichHienThi}
                                                onChange={handleChange}
                                                placeholder="Nhập diện tích"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="form-control"
                                            onChange={handleImageChange}
                                        />
                                        {isEditing && currentImages.length > 0 && (
                                            <div className="mt-2 d-flex flex-wrap gap-2">
                                                {currentImages.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={typeof img === "string" ? img : img.url}
                                                        alt={`Ảnh ${index}`}
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {selectedImages.length > 0 && (
                                            <div className="mt-2 d-flex flex-wrap gap-2">
                                                {selectedImages.map((file, index) => (
                                                    <img
                                                        key={index}
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index}`}
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal} type="button">
                                    Hủy
                                </button>
                                <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng danh sách bài viết */}
            <div className="container-fluid mt-4">
                {getFilteredBaiViet().length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tiêu đề</th>
                                    <th>Thành phố</th>
                                    <th>Quận/Huyện</th>
                                    <th>Phường/Xã</th>
                                    <th>Địa chỉ</th>
                                    <th>Giá bán</th>
                                    <th>Diện tích</th>
                                    <th>Hướng</th>
                                    <th>Mô tả</th>
                                    <th>Người đăng</th>
                                    <th>Ngày đăng</th>
                                    <th>Hình ảnh</th>
                                    <th>Trạng thái</th>
                                    <th style={{ minWidth: "200px" }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={15} className="text-center">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : getFilteredBaiViet().length === 0 ? (
                                    <tr>
                                        <td colSpan={15} className="text-center text-muted">
                                            {activeTab === "all" && "Không có bài viết nào!"}
                                            {activeTab === "pending" && "Không có bài viết nào chờ duyệt!"}
                                            {activeTab === "approved" && "Không có bài viết nào đã duyệt!"}
                                            {activeTab === "rejected" && "Không có bài viết nào đã từ chối!"}
                                        </td>
                                    </tr>
                                ) : (
                                    getFilteredBaiViet().map((bv, idx) => (
                                        <tr key={bv.id}>
                                            <td>{idx + 1}</td>
                                            <td style={{ maxWidth: "200px", whiteSpace: "pre-wrap" }}>
                                                {bv.TieuDe || "Chưa có tiêu đề"}
                                            </td>
                                            <td>{addressNames.provinces[bv.ThanhPho] || "Không xác định"}</td>
                                            <td>{addressNames.districts[bv.Quan] || "Không xác định"}</td>
                                            <td>{addressNames.wards[bv.Phuong] || "Không xác định"}</td>
                                            <td>{bv.DiaChi}</td>
                                            <td>{new Intl.NumberFormat("vi-VN").format(Number(bv.GiaBan || 0))}</td>
                                            <td>{new Intl.NumberFormat("vi-VN").format(Number(bv.DienTich || 0))}</td>
                                            <td>{bv.Huong || "Không xác định"}</td>
                                            <td style={{ maxWidth: "400px", whiteSpace: "pre-wrap" }}>{bv.MoTa}</td>
                                            <td>{bv.nguoiDang?.HoTen || "Ẩn danh"}</td>
                                            <td>{new Date(bv.ngayDang).toLocaleString()}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: "5px", overflowX: "auto", maxWidth: "150px" }}>
                                                    {bv.hinhAnh && bv.hinhAnh.length > 0 ? (
                                                        bv.hinhAnh.map((img) => (
                                                            <img
                                                                key={img.id}
                                                                src={img.url}
                                                                alt="Ảnh bài viết"
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "5px",
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <span style={{ color: "#888" }}>Không có ảnh</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {bv.TrangThai === 1 && (
                                                    <span className="text-warning" style={{ fontWeight: 500 }}>
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                                {bv.TrangThai === 2 && (
                                                    <span className="text-success" style={{ fontWeight: 500 }}>
                                                        Đã duyệt
                                                    </span>
                                                )}
                                                {bv.TrangThai === 3 && (
                                                    <span className="text-danger" style={{ fontWeight: 500 }}>
                                                        Đã từ chối
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "6px",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        minHeight: "60px",
                                                    }}
                                                >
                                                    {bv.TrangThai === 1 ? (
                                                        <>
                                                            <div style={{ display: "flex", gap: "6px" }}>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    style={{
                                                                        minWidth: "80px",
                                                                        height: "32px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 500,
                                                                        borderRadius: "6px",
                                                                        border: "none",
                                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                        transition: "all 0.2s ease",
                                                                    }}
                                                                    disabled={actionLoading === bv.id}
                                                                    onClick={() => handleDuyet(bv.id)}
                                                                    title="Duyệt bài viết"
                                                                    onMouseEnter={(e) => {
                                                                        if (!e.target.disabled) {
                                                                            e.target.style.transform = "translateY(-1px)";
                                                                            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.transform = "translateY(0)";
                                                                        e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                    }}
                                                                >
                                                                    {actionLoading === bv.id ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-check me-1"></i>
                                                                    )}
                                                                    {actionLoading === bv.id ? "Đang duyệt..." : "Duyệt"}
                                                                </button>
                                                                <button
                                                                    className="btn btn-warning btn-sm"
                                                                    style={{
                                                                        minWidth: "80px",
                                                                        height: "32px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 500,
                                                                        borderRadius: "6px",
                                                                        border: "none",
                                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                        transition: "all 0.2s ease",
                                                                    }}
                                                                    disabled={actionLoading === bv.id}
                                                                    onClick={() => handleTuChoi(bv.id)}
                                                                    title="Từ chối bài viết"
                                                                    onMouseEnter={(e) => {
                                                                        if (!e.target.disabled) {
                                                                            e.target.style.transform = "translateY(-1px)";
                                                                            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.transform = "translateY(0)";
                                                                        e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                    }}
                                                                >
                                                                    {actionLoading === bv.id ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-times me-1"></i>
                                                                    )}
                                                                    {actionLoading === bv.id ? "Đang xử lý..." : "Từ chối"}
                                                                </button>
                                                            </div>
                                                            <div style={{ display: "flex", gap: "6px" }}>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    style={{
                                                                        minWidth: "80px",
                                                                        height: "32px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 500,
                                                                        borderRadius: "6px",
                                                                        border: "none",
                                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                        transition: "all 0.2s ease",
                                                                    }}
                                                                    onClick={() => handleEdit(bv)}
                                                                    title="Sửa bài viết"
                                                                    onMouseEnter={(e) => {
                                                                        e.target.style.transform = "translateY(-1px)";
                                                                        e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.transform = "translateY(0)";
                                                                        e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                    }}
                                                                >
                                                                    <i className="fas fa-edit me-1"></i>
                                                                    Sửa
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    style={{
                                                                        minWidth: "80px",
                                                                        height: "32px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 500,
                                                                        borderRadius: "6px",
                                                                        border: "2px solid #dc3545",
                                                                        backgroundColor: "transparent",
                                                                        color: "#dc3545",
                                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                        transition: "all 0.2s ease",
                                                                    }}
                                                                    disabled={actionLoading === bv.id}
                                                                    onClick={() => handleXoa(bv.id)}
                                                                    title="Xóa bài viết"
                                                                    onMouseEnter={(e) => {
                                                                        if (!e.target.disabled) {
                                                                            e.target.style.backgroundColor = "#dc3545";
                                                                            e.target.style.color = "white";
                                                                            e.target.style.transform = "translateY(-1px)";
                                                                            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.backgroundColor = "transparent";
                                                                        e.target.style.color = "#dc3545";
                                                                        e.target.style.transform = "translateY(0)";
                                                                        e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                    }}
                                                                >
                                                                    {actionLoading === bv.id ? (
                                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    ) : (
                                                                        <i className="fas fa-trash me-1"></i>
                                                                    )}
                                                                    {actionLoading === bv.id ? "Đang xóa..." : "Xóa"}
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : bv.TrangThai === 2 ? (
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                style={{
                                                                    minWidth: "80px",
                                                                    height: "32px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 500,
                                                                    borderRadius: "6px",
                                                                    border: "none",
                                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                    transition: "all 0.2s ease",
                                                                }}
                                                                onClick={() => handleEdit(bv)}
                                                                title="Sửa bài viết"
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.transform = "translateY(-1px)";
                                                                    e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.transform = "translateY(0)";
                                                                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                }}
                                                            >
                                                                <i className="fas fa-edit me-1"></i>
                                                                Sửa
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                style={{
                                                                    minWidth: "80px",
                                                                    height: "32px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 500,
                                                                    borderRadius: "6px",
                                                                    border: "2px solid #dc3545",
                                                                    backgroundColor: "transparent",
                                                                    color: "#dc3545",
                                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                    transition: "all 0.2s ease",
                                                                }}
                                                                disabled={actionLoading === bv.id}
                                                                onClick={() => handleXoa(bv.id)}
                                                                title="Xóa bài viết"
                                                                onMouseEnter={(e) => {
                                                                    if (!e.target.disabled) {
                                                                        e.target.style.backgroundColor = "#dc3545";
                                                                        e.target.style.color = "white";
                                                                        e.target.style.transform = "translateY(-1px)";
                                                                        e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = "transparent";
                                                                    e.target.style.color = "#dc3545";
                                                                    e.target.style.transform = "translateY(0)";
                                                                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                }}
                                                            >
                                                                {actionLoading === bv.id ? (
                                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                                ) : (
                                                                    <i className="fas fa-trash me-1"></i>
                                                                )}
                                                                {actionLoading === bv.id ? "Đang xóa..." : "Xóa"}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                style={{
                                                                    minWidth: "80px",
                                                                    height: "32px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 500,
                                                                    borderRadius: "6px",
                                                                    border: "2px solid #dc3545",
                                                                    backgroundColor: "transparent",
                                                                    color: "#dc3545",
                                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                                    transition: "all 0.2s ease",
                                                                }}
                                                                disabled={actionLoading === bv.id}
                                                                onClick={() => handleXoa(bv.id)}
                                                                title="Xóa bài viết"
                                                                onMouseEnter={(e) => {
                                                                    if (!e.target.disabled) {
                                                                        e.target.style.backgroundColor = "#dc3545";
                                                                        e.target.style.color = "white";
                                                                        e.target.style.transform = "translateY(-1px)";
                                                                        e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = "transparent";
                                                                    e.target.style.color = "#dc3545";
                                                                    e.target.style.transform = "translateY(0)";
                                                                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                                                }}
                                                            >
                                                                {actionLoading === bv.id ? (
                                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                                ) : (
                                                                    <i className="fas fa-trash me-1"></i>
                                                                )}
                                                                {actionLoading === bv.id ? "Đang xóa..." : "Xóa"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">Chưa có dữ liệu bài viết.</p>
                )}
            </div>
        </AdminPage>
    );
}

export default QuanLyBaiViet;