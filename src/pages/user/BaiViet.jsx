import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Spinner, Toast, ToastContainer } from "react-bootstrap";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";

const BaiViet = () => {
    const [form, setForm] = useState({
        tieuDe: "",
        noiDung: "",
        gia: "",
        diaChi: "",
    });
    const [images, setImages] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState(""); // "success" hoặc "error"
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Hiển thị toast khi có statusMessage
    React.useEffect(() => {
        if (statusMessage) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const validate = () => {
        let newErrors = {};
        if (!form.tieuDe.trim()) newErrors.tieuDe = "Vui lòng nhập tiêu đề";
        if (!form.noiDung.trim()) newErrors.noiDung = "Vui lòng nhập nội dung";
        if (!form.gia) newErrors.gia = "Vui lòng nhập giá";
        else if (isNaN(form.gia) || Number(form.gia) <= 0) newErrors.gia = "Giá phải là số dương";
        if (!form.diaChi.trim()) newErrors.diaChi = "Vui lòng nhập địa chỉ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setStatusType("");
        setLoading(true);

        if (validate()) {
            const token = localStorage.getItem("token");
            if (!token) {
                setStatusMessage("Thất bại: Bạn cần đăng nhập để đăng bài viết.");
                setStatusType("error");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("tieuDe", form.tieuDe);
            formData.append("noiDung", form.noiDung);
            formData.append("gia", form.gia);
            formData.append("diaChi", form.diaChi);
            images.forEach(img => {
                formData.append("images", img);
            });

            try {
                const response = await quanLyBaiVietApi.taoBaiViet(formData, token);
                const resData = response.data;

                setStatusMessage(resData.message || "Thành công: Gửi bài viết thành công! Đang chờ admin duyệt.");
                setStatusType("success");
                setForm({ tieuDe: "", noiDung: "", gia: "", diaChi: "" });
                setImages([]);
                setErrors({});
            } catch (error) {
                const message = error?.response?.data?.message || "Thất bại: Không thể kết nối tới server!";
                setStatusMessage(message.startsWith("Thất bại:") ? message : `Thất bại: ${message}`);
                setStatusType("error");
            }
        }

        setLoading(false);
    };

    return (
        <>
            {/* Toast message ở góc phải trên màn hình */}
            <ToastContainer
                position="top-end"
                className="custom-toast-container"
                style={{ zIndex: 9999, top: 100, right: 24, position: 'fixed' }}
            >
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    className="custom-toast"
                >
                    <Toast.Body className="custom-toast-body">
                        {statusMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <Container style={{ marginTop: 40, marginBottom: 40 }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={7}>
                        <Card className="shadow-lg">
                            <Card.Body>
                                <h3 className="mb-4 text-center" style={{ color: '#0d6efd' }}>Đăng bài viết bất động sản</h3>
                                {/* KHÔNG dùng Alert nữa */}
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Form.Group className="mb-3" controlId="tieuDe">
                                        <Form.Label>Tiêu đề <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="tieuDe"
                                            value={form.tieuDe}
                                            onChange={handleChange}
                                            placeholder="Nhập tiêu đề bài viết"
                                            isInvalid={!!errors.tieuDe}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.tieuDe}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="noiDung">
                                        <Form.Label>Nội dung <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="noiDung"
                                            value={form.noiDung}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Nhập nội dung chi tiết về nhà đất"
                                            isInvalid={!!errors.noiDung}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.noiDung}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="gia">
                                        <Form.Label>Giá (VNĐ) <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="gia"
                                            value={form.gia}
                                            onChange={handleChange}
                                            placeholder="Nhập giá bán hoặc cho thuê"
                                            isInvalid={!!errors.gia}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.gia}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="diaChi">
                                        <Form.Label>Địa chỉ <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="diaChi"
                                            value={form.diaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ nhà đất"
                                            isInvalid={!!errors.diaChi}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.diaChi}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="images">
                                        <Form.Label>Hình ảnh (có thể chọn nhiều ảnh)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="files"
                                            multiple
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </Form.Group>
                                    {images.length > 0 && (
                                        <div className="mb-3">
                                            <div>Ảnh đã chọn:</div>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={URL.createObjectURL(img)}
                                                        alt="preview"
                                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="d-grid">
                                        <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                            {loading && <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />}
                                            {loading ? "Đang xử lý..." : "Gửi bài viết"}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <style>{`
            .custom-toast-container {
                top: 100px !important;
                right: 24px !important;
                position: fixed !important;
            }
            .custom-toast {
                min-width: 340px;
                max-width: 420px;
                min-height: 60px;
                font-size: 1.05rem;
                border-radius: 12px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                background-color: #f8f9fa !important; /* màu nền nhạt */
                color: #212529 !important; /* màu chữ cơ bản */
                border: 1px solid #dee2e6 !important; /* viền nhẹ */
                padding: 16px 24px !important;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .custom-toast-body {
                font-weight: 500;
                letter-spacing: 0.3px;
                text-align: center;
                width: 100%;
            }
            .toast-success {
                border-left: 5px solid #198754 !important; /* viền xanh lá */
            }
            .toast-error {
                border-left: 5px solid #dc3545 !important; /* viền đỏ */
            }
            `}</style>

        </>
    );
};

export default BaiViet;
