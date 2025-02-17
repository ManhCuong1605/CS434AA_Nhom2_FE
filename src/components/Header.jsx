import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = ({ onLoginClick, onRegisterClick, resetForm }) => {
    return (
        <header>
            <Navbar bg="light" expand="lg" className="border-bottom">
                <Container>
                    <Navbar.Brand href="/" className="d-flex align-items-center" onClick={resetForm}>
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Logo"
                            className="me-2"
                        />
                        <div>
                            <strong>Bất động sản</strong>
                            <small className="text-muted d-block">.com</small>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/bat-dong-san" onClick={resetForm}>Bất động sản</Nav.Link>
                            <Nav.Link href="/gioi-thieu" onClick={resetForm}>Giới thiệu</Nav.Link>
                            <Nav.Link href="/du-an" onClick={resetForm}>Dự án</Nav.Link>
                            <Nav.Link href="/tin-tuc" onClick={resetForm}>Tin tức</Nav.Link>
                            <Nav.Link href="/wiki" onClick={resetForm}>Wiki BĐS</Nav.Link>
                            <Nav.Link href="/ban-dat" onClick={resetForm}>Bán đất</Nav.Link>
                            <Nav.Link href="/danh-ba" onClick={resetForm}>Danh bạ</Nav.Link>
                        </Nav>
                        <div className="d-flex ms-3">
                            <Button variant="outline-primary" className="me-2" onClick={onLoginClick}>
                                Đăng nhập
                            </Button>
                            <Button variant="danger" onClick={onRegisterClick}>
                                Đăng ký
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;