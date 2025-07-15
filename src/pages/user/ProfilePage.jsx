import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb
} from 'mdb-react-ui-kit';
export default function ProfilePage() {

    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
    return (
        <section style={{ backgroundColor: '#eee' }}>
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
                                    style={{ width: '150px' }}
                                    fluid />
                                <p className="text-muted mb-1">Khách hàng</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <MDBBtn>Đổi mật khẩu</MDBBtn>
                                </div>
                            </MDBCardBody>
                        </MDBCard>


                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Họ Tên</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{user.HoTen}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{user.email}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Số điện thoại</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{user.SoDienThoai}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Địa chỉ</MDBCardText>
                                    </MDBCol>

                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{user.DiaChi}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>

                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                {/* <MDBBreadcrumb>
                    <button type="button" class="btn btn-danger">Lưu thay đổi</button>
                    <button type="button" class="btn btn-warning">Chỉnh sửa</button>
                </MDBBreadcrumb> */}
            </MDBContainer>

        </section>
    );
}