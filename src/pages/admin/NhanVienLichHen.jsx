import React, { useEffect, useState } from "react";
import datLichHenApi from "../../api/DatLichHenApi";
import Swal from "sweetalert2";
import AdminPage from './AdminPage'; // layout chính

const NhanVienLichHen = () => {
    const [lichHenList, setLichHenList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLichHen();
    }, []);

    const fetchLichHen = async () => {
        try {
            setLoading(true);
            const nhanVienId = localStorage.getItem("nhanVienId");
            const res = await datLichHenApi.getLichHenNhanVien(nhanVienId);
            setLichHenList(res.data);
        } catch (error) {
            Swal.fire("Lỗi", "Không thể tải danh sách lịch hẹn", "error");
        } finally {
            setLoading(false);
        }
    };

    // Hàm format ngày + giờ sáng/chiều
    const formatNgayHen = (ngayHen) => {
        const date = new Date(ngayHen);
        const options = {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
            hour12: false
        };
        const dateStr = date.toLocaleString("vi-VN", options);
        const hours = date.getUTCHours() + 7; // UTC -> GMT+7
        const period = hours < 12 ? "Sáng" : "Chiều";
        return `${dateStr} (${period})`;
    };

    return (
        <AdminPage>
            <div className="container mt-4">
                <h2 className="mb-4">📅 Lịch hẹn của tôi</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : lichHenList.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày hẹn</th>
                                    <th>Bất động sản</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lichHenList.map((lich, index) => (
                                    <tr key={lich.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{lich.KhachHang?.User?.HoTen || "Ẩn danh"}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {lich.KhachHang?.User?.SoDienThoai || ""}
                                            </small>
                                        </td>
                                        <td>{formatNgayHen(lich.NgayHen)}</td>
                                        <td>
                                            {lich.NhaDat && (
                                                <div className="d-flex align-items-center gap-2">
                                                    {lich.NhaDat.hinhAnh?.length > 0 && (
                                                        <img
                                                            src={lich.NhaDat.hinhAnh[0].url}
                                                            alt="hình nhà đất"
                                                            width={80}
                                                            height={60}
                                                            className="rounded"
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="fw-bold">{lich.NhaDat.TenNhaDat}</div>
                                                        <small className="text-muted">
                                                            {lich.NhaDat.Duong}, {lich.NhaDat.Phuong}, {lich.NhaDat.Quan}, {lich.NhaDat.ThanhPho}
                                                        </small>
                                                        <br />
                                                        <small>Giá: {lich.NhaDat.GiaBan.toLocaleString()} đ</small>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">Bạn chưa có lịch hẹn nào.</p>
                )}
            </div>
        </AdminPage>
    );
};

export default NhanVienLichHen;
