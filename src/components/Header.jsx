import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo/logo.png";
import axios from "axios";
const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("username"));

    useEffect(() => {
        // Cập nhật khi localStorage thay đổi
        const handleStorageChange = () => {
            setUser(localStorage.getItem("username"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await axios.post("http://localhost:5000/api/logout", { refreshToken });
            }
        } catch (err) {
            console.error("Logout lỗi:", err);
        } finally {
            // Xoá tất cả token và thông tin người dùng
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            localStorage.removeItem("userId");
            localStorage.removeItem("nhanVienId");

            setUser(null);
            window.dispatchEvent(new Event("storage")); // Cập nhật các component khác
            navigate("/", { replace: true });
        }
    };
    return (
        <header>
            <Navbar bg="light" expand="lg" className="border-bottom">
                <Container>
                    <Navbar.Brand href="/" className="d-flex align-items-center">
                        <img src={Logo} alt="Logo" className="me-2" style={{ width: '50px', height: 'auto' }} />
                        <div >
                            <strong>BlackS City</strong>

                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link onClick={() => navigate("/")}>Trang Chủ</Nav.Link>
                            <Nav.Link onClick={() => navigate("/bat-dong-san")}>Bất động sản</Nav.Link>
                            <Nav.Link href="/tin-tuc">Bài viết</Nav.Link>
                            <Nav.Link href="/gioi-thieu">Giới thiệu</Nav.Link>
                            <Nav.Link href="/form-bai-viet">Đăng bài viết</Nav.Link>

                        </Nav>
                        <div className="d-flex ms-3">
                            {user ? (
                                <NavDropdown title={<span className="fw-bold fs-5">{user}</span>} id="user-dropdown">

                                    <NavDropdown.Item onClick={() => navigate("/profile")}>Hồ sơ</NavDropdown.Item>

                                    <NavDropdown.Item onClick={() => navigate("/danh-muc-yeu-thich")}>
                                        Danh mục yêu thích
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Button variant="outline-primary" className="me-2" onClick={() => navigate("/dang-nhap")}>
                                        Đăng nhập
                                    </Button>
                                    <Button variant="danger" onClick={() => navigate("/dang-ky")}>
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
