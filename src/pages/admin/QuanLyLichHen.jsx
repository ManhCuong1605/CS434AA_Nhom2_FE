import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import datLichHenApi from "../../api/DatLichHenApi";
import nhanVienApi from "../../api/NhanVienApi";
import Swal from "sweetalert2";
function QuanLyLichHen() {
    const [lichHenList, setLichHenList] = useState([]);
    const [nhanVienList, setNhanVienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNhanVien, setSelectedNhanVien] = useState({});
    const [activeTab, setActiveTab] = useState("all"); // tab trạng thái

    useEffect(() => {
        fetchLichHen();
        fetchNhanVien();
    }, []);

    const fetchLichHen = async () => {
        try {
            setLoading(true);
            const response = await datLichHenApi.getAll();
            setLichHenList(response.data);
        } catch (error) {
            Swal.fire("Lỗi", "Không thể tải danh sách lịch hẹn", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchNhanVien = async () => {
        try {
            const res = await nhanVienApi.getAll();
            setNhanVienList(res.data); // giữ nguyên
        } catch (error) {
            Swal.fire("Lỗi", "Không thể tải danh sách nhân viên", "error");
        }
    };
    const getLichHenCount = (status) => {
        if (status === "all") return lichHenList.length;
        if (status === "pending") return lichHenList.filter(l => l.TrangThai === 0).length;
        if (status === "approved") return lichHenList.filter(l => l.TrangThai === 1).length;
        if (status === "rejected") return lichHenList.filter(l => l.TrangThai === 2).length;
        return 0;
    };
    const filteredLichHen = lichHenList
        .filter(l => {
            if (activeTab === "all") return true;
            if (activeTab === "pending") return l.TrangThai === 0;
            if (activeTab === "approved") return l.TrangThai === 1;
            if (activeTab === "rejected") return l.TrangThai === 2;
            return true;
        })
        .sort((a, b) => {
            if (a.TrangThai === 2 && b.TrangThai !== 2) return 1;
            if (a.TrangThai !== 2 && b.TrangThai === 2) return -1;
            return 0;
        });


    const handleDuyet = async (lichHenId) => {
        const nhanVienId = selectedNhanVien[lichHenId];
        if (!nhanVienId) {
            Swal.fire("Cảnh báo", "Vui lòng chọn nhân viên", "warning");
            return;
        }
        try {
            await datLichHenApi.duyetLichHen(lichHenId, nhanVienId);
            Swal.fire("Thành công", "Đã duyệt lịch hẹn", "success");
            fetchLichHen();
        } catch (error) {
            Swal.fire("Lỗi", error.response?.data?.message || "Không thể duyệt lịch", "error");
        }
    };

    const handleHuy = async (id) => {
        const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn hủy?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Hủy",
            cancelButtonText: "Đóng"
        });

        if (result.isConfirmed) {
            try {
                await datLichHenApi.huyLichHen(id);
                Swal.fire("Thành công", "Đã hủy lịch hẹn", "success");
                fetchLichHen();
            } catch (error) {
                Swal.fire("Lỗi", error.response?.data?.message || "Không thể hủy lịch", "error");
            }
        }
    };
    return (
        <AdminPage>
            <h2 className="mb-4">Quản lý lịch hẹn</h2>

            {/* Tab lọc trạng thái */}
            <div className="mb-4">
                <ul className="nav nav-tabs" style={{ borderBottom: "2px solid #dee2e6" }}>
                    {["all", "pending", "approved", "rejected"].map(tab => (
                        <li className="nav-item" key={tab}>
                            <button
                                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    border: "none",
                                    borderBottom: activeTab === tab ? "3px solid" : "none",
                                    fontWeight: activeTab === tab ? 600 : 400,
                                    padding: "12px 20px",
                                    backgroundColor: "transparent",
                                }}
                            >
                                {tab === "all" && <>Tất cả <span className="badge bg-secondary">{getLichHenCount("all")}</span></>}
                                {tab === "pending" && <>Chờ duyệt <span className="badge bg-warning">{getLichHenCount("pending")}</span></>}
                                {tab === "approved" && <>Đã duyệt <span className="badge bg-success">{getLichHenCount("approved")}</span></>}
                                {tab === "rejected" && <>Đã hủy <span className="badge bg-danger">{getLichHenCount("rejected")}</span></>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : filteredLichHen.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Khách hàng</th>
                            <th>Ngày hẹn</th>
                            <th>Trạng thái</th>
                            <th>Nhân viên</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLichHen.map((lich, index) => (
                            <tr key={lich.id}>
                                <td>{index + 1}</td>

                                {/* Tên khách hàng */}
                                <td>
                                    {lich.KhachHang?.User?.HoTen || "Ẩn danh"}
                                    <br />
                                    <small className="text-muted">
                                        {lich.KhachHang?.User?.SoDienThoai || ""}
                                    </small>
                                </td>

                                {/* Ngày hẹn */}
                                <td>{new Date(lich.NgayHen).toLocaleString("vi-VN")}</td>

                                {/* Trạng thái */}
                                <td>
                                    {lich.TrangThai === 0 && (
                                        <span className="text-warning" style={{ fontWeight: 500 }}>
                                            Chờ duyệt
                                        </span>
                                    )}
                                    {lich.TrangThai === 1 && (
                                        <span className="text-success" style={{ fontWeight: 500 }}>
                                            Đã duyệt
                                        </span>
                                    )}
                                    {lich.TrangThai === 2 && (
                                        <span className="text-danger" style={{ fontWeight: 500 }}>
                                            Đã hủy
                                        </span>
                                    )}
                                </td>
                                {/* Tên nhân viên */}
                                <td>{lich.NhanVien?.User?.HoTen || "-"}</td>

                                {/* Hành động */}
                                <td>
                                    {lich.TrangThai === 0 && (
                                        <>
                                            <select
                                                className="form-select d-inline w-auto me-2"
                                                value={selectedNhanVien[lich.id] || ""}
                                                onChange={(e) =>
                                                    setSelectedNhanVien({
                                                        ...selectedNhanVien,
                                                        [lich.id]: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">-- Chọn nhân viên --</option>
                                                {nhanVienList.map((nv) => (
                                                    <option key={nv.id} value={nv.id}>
                                                        {nv.User?.HoTen}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={() => handleDuyet(lich.id)}
                                            >
                                                Duyệt
                                            </button>
                                        </>
                                    )}
                                    {lich.TrangThai !== 2 && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleHuy(lich.id)}
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            ) : (
                <p className="text-center text-muted">Chưa có lịch hẹn nào.</p>
            )}
        </AdminPage>
    );
}

export default QuanLyLichHen;
