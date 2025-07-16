import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import "bootstrap/dist/css/bootstrap.min.css";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import Swal from "sweetalert2";

function QuanLyBaiViet() {
    const [baiViet, setBaiViet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id bài viết đang xử lý (duyệt/từ chối)
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // trạng thái thêm hay sửa
    const [formData, setFormData] = useState({
        id: null,
        tieuDe: "",
        noiDung: "",
        gia: "",
        diaChi: "",
        nguoiDangId: null,
        ngayDang: "",
        hinhAnh: [], // ảnh hiện tại (url từ server)
        TrangThai: 0,
    });
    const [selectedImages, setSelectedImages] = useState([]); // ảnh mới chọn (File)
    const [currentImages, setCurrentImages] = useState([]); // ảnh hiện tại khi sửa (url hoặc object)

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
                alert("Lỗi khi lấy danh sách bài viết!");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Xử lý thay đổi input trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            tieuDe: "",
            noiDung: "",
            gia: "",
            diaChi: "",
            nguoiDangId: null,
            ngayDang: "",
            hinhAnh: [],
            TrangThai: 0,
        });
        setSelectedImages([]);
        setCurrentImages([]);
        setIsEditing(false);
        setShowModal(true);
    };


    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedImages([]);
        setCurrentImages([]);
    };

    const handleSubmit = async () => {
        const { tieuDe, noiDung, gia, diaChi } = formData;
        if (!tieuDe || !noiDung || !gia || !diaChi) {
            Swal.fire('Lỗi!', 'Vui lòng điền đủ các trường bắt buộc!', 'error');
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('tieuDe', tieuDe);
            dataToSend.append('noiDung', noiDung);
            dataToSend.append('gia', gia);
            dataToSend.append('diaChi', diaChi);

            selectedImages.forEach(img => {
                dataToSend.append('images', img);
            });

            const token = localStorage.getItem('token');

            if (isEditing) {
                // Cập nhật bài viết
                await quanLyBaiVietApi.capNhatBaiViet(formData.id, dataToSend, token);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                // Thêm bài viết mới
                await quanLyBaiVietApi.taoBaiViet(dataToSend, token);
                Swal.fire('Thêm thành công!', '', 'success');
            }

            loadData(); // load lại danh sách sau khi thêm/sửa
            closeModal();

        } catch (error) {
            console.error(error);
            const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            Swal.fire('Lỗi!', errorMsg, 'error');
        }
    };

    // Gọi API tạo hoặc sửa bài viết
    const handleEdit = (bv) => {
        setFormData({
            id: bv.id,
            tieuDe: bv.tieuDe,
            noiDung: bv.noiDung,
            gia: bv.gia,
            diaChi: bv.diaChi,
            nguoiDangId: bv.nguoiDangId,
            ngayDang: bv.ngayDang,
            hinhAnh: bv.hinhAnh || [],
            TrangThai: bv.TrangThai,
        });
        setCurrentImages(bv.hinhAnh || []);
        setSelectedImages([]); // reset ảnh mới được chọn
        setIsEditing(true);
        setShowModal(true);
    };

    // Duyệt bài viết (confirm Swal)
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

    // Từ chối bài viết (confirm Swal)
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

    return (
        <AdminPage>
            <h2 className="mb-4">Quản lý bài viết</h2>
            <button onClick={openModalAdd} className="btn btn-primary mb-3">
                Thêm bài viết
            </button>

            {/* Modal Thêm/Sửa bài viết */}
            {showModal && (
                <div className="modal d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {isEditing ? "Cập nhật bài viết" : "Thêm bài viết"}
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
                                        <label className="form-label">
                                            Tiêu đề <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="tieuDe"
                                            value={formData.tieuDe}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Nội dung <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="noiDung"
                                            rows={3}
                                            value={formData.noiDung}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Giá <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gia"
                                            value={formData.gia}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Địa chỉ <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="diaChi"
                                            value={formData.diaChi}
                                            onChange={handleChange}
                                        />
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

                                        {/* Hiển thị ảnh hiện tại (khi sửa) */}
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

                                        {/* Hiển thị preview ảnh mới chọn */}
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
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng danh sách bài viết */}
            <div className="container-fluid mt-4">
                <div className="card-body" style={{ padding: 32 }}>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>STT</th>
                                    <th>Tiêu đề</th>
                                    <th>Nội dung</th>
                                    <th>Giá</th>
                                    <th>Địa chỉ</th>
                                    <th>Người đăng</th>
                                    <th>Ngày đăng</th>
                                    <th>Hình ảnh</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : baiViet.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center text-danger">
                                            Không có bài viết nào!
                                        </td>
                                    </tr>
                                ) : (
                                    baiViet.map((bv, idx) => (
                                        <tr key={bv.id}>
                                            <td>{idx + 1}</td>
                                            <td>{bv.tieuDe}</td>
                                            <td>{bv.noiDung}</td>
                                            <td>{bv.gia}</td>
                                            <td>{bv.diaChi}</td>
                                            <td>{bv.nguoiDang?.HoTen || "Ẩn danh"}</td>
                                            <td>{new Date(bv.ngayDang).toLocaleString()}</td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 8,
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {bv.hinhAnh && bv.hinhAnh.length > 0 ? (
                                                        bv.hinhAnh.map((img) => (
                                                            <div
                                                                key={img.id}
                                                                style={{
                                                                    border: "1px solid #eee",
                                                                    borderRadius: 8,
                                                                    padding: 2,
                                                                    background: "#fafbfc",
                                                                }}
                                                            >
                                                                <img
                                                                    src={img.url}
                                                                    alt="Ảnh bài viết"
                                                                    style={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        objectFit: "cover",
                                                                        borderRadius: 6,
                                                                    }}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span style={{ color: "#888" }}>
                                                            Không có ảnh
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {bv.TrangThai === 0 && (
                                                    <span
                                                        className="text-warning"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                                {bv.TrangThai === 1 && (
                                                    <span
                                                        className="text-success"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        Đã duyệt
                                                    </span>
                                                )}
                                                {bv.TrangThai === 2 && (
                                                    <span
                                                        className="text-danger"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        Đã từ chối
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {bv.TrangThai === 0 ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: 8,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            style={{
                                                                minWidth: 70,
                                                                fontWeight: 500,
                                                                transition: "none",
                                                            }}
                                                            disabled={actionLoading === bv.id}
                                                            onClick={() => handleDuyet(bv.id)}
                                                        >
                                                            {actionLoading === bv.id ? "Đang duyệt..." : "Duyệt"}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            style={{
                                                                minWidth: 70,
                                                                fontWeight: 500,
                                                                transition: "none",
                                                            }}
                                                            disabled={actionLoading === bv.id}
                                                            onClick={() => handleTuChoi(bv.id)}
                                                        >
                                                            {actionLoading === bv.id ? "Đang xử lý..." : "Từ chối"}
                                                        </button>
                                                    </div>
                                                ) : bv.TrangThai === 1 ? (
                                                    // Nếu đã duyệt thì có nút sửa
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleEdit(bv)}
                                                    >
                                                        Sửa
                                                    </button>
                                                ) : (
                                                    <span>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminPage>
    );
}

export default QuanLyBaiViet;

