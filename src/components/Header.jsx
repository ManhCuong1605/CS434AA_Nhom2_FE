import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo/Logooo.jpg"
const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("username"));

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(localStorage.getItem("username")); // Cập nhật user khi localStorage thay đổi
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        setUser(null);
        window.dispatchEvent(new Event("storage")); // Gửi sự kiện để cập nhật các component khác
        navigate("/", { replace: true });
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
                            <Nav.Link href="/tin-tuc">Tin tức</Nav.Link>
                            <Nav.Link href="/gioi-thieu">Giới thiệu</Nav.Link>
                            <Nav.Link href="/du-an">Dự án</Nav.Link>
                           
                            <Nav.Link href="/wiki">Wiki BĐS</Nav.Link>
                            <Nav.Link href="/ban-dat">Bán đất</Nav.Link>
                            <Nav.Link href="/form-bai-viet">Đăng bài viết</Nav.Link>

                        </Nav>
                        <div className="d-flex ms-3">
                            {user ? (
                                <NavDropdown title={<span className="fw-bold fs-5">{user}</span>} id="user-dropdown">

                                    <NavDropdown.Item onClick={() => navigate("/profile")}>Hồ sơ</NavDropdown.Item>
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
