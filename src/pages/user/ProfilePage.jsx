import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBreadcrumb,
} from "mdb-react-ui-kit";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editField, setEditField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) return;
            try {
                const response = await axios.get("http://localhost:5000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };
        fetchProfile();
    }, []);

    if (!user) {
        return <div className="text-center mt-5">Đang tải thông tin cá nhân...</div>;
    }

    const handleChangePassword = async () => {
        setError("");
        if (!oldPassword || !newPassword) {
            setError("Vui lòng nhập đầy đủ mật khẩu cũ và mới");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                "http://localhost:5000/api/change-password",
                { currentPassword: oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Nếu BE trả status 200 -> hiển thị toast thành công
            if (response.status === 200) {
                toast.success(response.data.message || "Đổi mật khẩu thành công", {
                    position: "top-right",
                    autoClose: 3000,
                });

                setShowModal(false);
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.message || "Đổi mật khẩu thất bại");
        }
        setLoading(false);
    };

    const handleEditClick = (field) => {
        setEditField(field);
        setTempValue(user[field] || "");
    };
    const fieldMap = {
        HoTen: "HoTen",
        email: "Email",
        SoDienThoai: "SoDienThoai",
        DiaChi: "DiaChi",
    };
    const handleSave = async (field) => {
        try {
            const token = localStorage.getItem("accessToken");
            const backendField = fieldMap[field];
            const payload = { [backendField]: tempValue };
            await axios.put("http://localhost:5000/api/profile", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser((prev) => ({ ...prev, [field]: tempValue }));
            setEditField(null);
            toast.success("Cập nhật thành công!");
        } catch (err) {
            const message = err.response?.data?.error || "Cập nhật thất bại";
            toast.error(message); // hiển thị message dễ hiểu
        }
    };
    const handleCancel = () => {
        setEditField(null);
        setTempValue("");
    };
    return (
        <section style={{ backgroundColor: "#eee" }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol>
                        <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4 d-flex justify-content-center">
                            <h3 className="fw-bold text- m-0">Thông tin cá nhân</h3>
                        </MDBBreadcrumb>
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: "150px" }}
                                    fluid
                                />
                                <p className="text-muted mb-1">Khách hàng</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button
                                        className="btn btn-dark text-white"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                {["HoTen", "email", "SoDienThoai", "DiaChi"].map((field, idx) => (
                                    <React.Fragment key={field}>
                                        <MDBRow className="align-items-center mb-2">
                                            <MDBCol sm="3">
                                                <MDBCardText className="mb-0">
                                                    {field === "HoTen"
                                                        ? "Họ Tên"
                                                        : field === "SoDienThoai"
                                                            ? "Số điện thoại"
                                                            : field === "DiaChi"
                                                                ? "Địa chỉ"
                                                                : "Email"}
                                                </MDBCardText>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    {editField === field ? (
                                                        <div className="d-flex align-items-center flex-grow-1 me-2">
                                                            <input
                                                                type="text"
                                                                value={tempValue}
                                                                onChange={(e) => setTempValue(e.target.value)}
                                                                className="form-control form-control-sm me-2"
                                                                style={{ height: "30px" }}
                                                            />
                                                            <FaSave
                                                                style={{ cursor: "pointer", fontSize: "1rem" }}
                                                                onClick={() => handleSave(field)}
                                                            />
                                                            <FaTimes
                                                                style={{ cursor: "pointer", fontSize: "1rem", marginLeft: "5px" }}
                                                                onClick={handleCancel}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <MDBCardText className="text-muted mb-0 flex-grow-1 me-2">
                                                                {user[field] || "-"}
                                                            </MDBCardText>
                                                            <FaEdit
                                                                style={{ cursor: "pointer", fontSize: "1rem" }}
                                                                onClick={() => handleEditClick(field)}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </MDBCol>
                                        </MDBRow>
                                        {idx < 3 && <hr />} {/* thêm đường kẻ giữa các dòng trừ dòng cuối */}
                                    </React.Fragment>
                                ))}
                            </MDBCardBody>

                        </MDBCard>
                    </MDBCol>
                </MDBRow>

                {/* Modal đổi mật khẩu */}
                {showModal && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Đổi mật khẩu</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Mật khẩu cũ</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-danger">{error}</p>}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="btn btn-dark text-white"
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                    >
                                        {loading ? "Đang xử lý..." : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ToastContainer */}
                <ToastContainer position="top-right" autoClose={3000} />
            </MDBContainer>
        </section>
    );
}
