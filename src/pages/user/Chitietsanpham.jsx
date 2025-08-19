import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap"; // Import React Bootstrap
import "../../style/Chitietsanpham.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";
import { useChat } from "../../context/ChatContext";
import nhaDatApi from "../../api/NhaDatApi";
import datLichHenApi from "../../api/DatLichHenApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChiTietSanPham = () => {
    const { id } = useParams();
    const { setIsChatOpen } = useChat();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    // State modal
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await nhaDatApi.getById(id);
                const data = res.data;

                const mappedData = {
                    title: data.TenNhaDat,
                    price: `${Number(data.GiaBan).toLocaleString()} VND`,
                    area: `${data.DienTich}m²`,
                    pricePerM2: data.GiaBan && data.DienTich ? `${Math.round(data.GiaBan / data.DienTich).toLocaleString()} VND/m²` : "",
                    location: `${data.Duong}, ${data.Phuong}, ${data.Quan}, ${data.ThanhPho}`,
                    images: data.hinhAnh?.map(img => img.url) || [],
                    contact: "0969 524 111",
                    agent: "Nguyễn Bình Gold",
                    description: data.MoTa,
                    type: "nhaDat" // giả sử mặc định là nhà đất
                };

                setProduct(mappedData);
                setSelectedImage(mappedData.images[0] || "");
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="product-container">Đang tải chi tiết sản phẩm...</div>;
    }

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Vui lòng chọn ngày và giờ hẹn!");
            return;
        }

        const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
        const now = new Date();

        if (selectedDateTime < now) {
            toast.error("Ngày giờ hẹn không được nhỏ hơn hiện tại!");
            return;
        }

        try {
            const res = await datLichHenApi.datLichHen(id, selectedDateTime.toISOString());
            toast.success(res.data.message); // thông báo thành công
            setShowModal(false);
            setSelectedDate("");
            setSelectedTime("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt lịch thất bại");
        }
    };
    return (
        <div className="product-container">
            <div className="product-top">
                {/* BÊN TRÁI - HÌNH ẢNH */}
                <div className="product-left">
                    <div className="main-image-wrapper">
                        <img src={selectedImage} alt="Ảnh chính" className="main-image" />
                    </div>
                    <div className="thumbnail-list">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Ảnh ${index + 1}`}
                                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* BÊN PHẢI - THÔNG TIN */}
                <div className="product-right">
                    <h2 className="product-title">{product.title}</h2>
                    <p className="product-location">Địa chỉ: {product.location}</p>
                    <p className="product-price">Giá Tiền: {product.price}</p>
                    {product.type === "nhaDat" && (
                        <p className="product-meta">
                            Diện tích {product.area} • {product.pricePerM2}
                        </p>
                    )}

                    <div className="contact-box">
                        <p><strong>Môi giới: {product.agent}</strong></p>
                        <p className="contact-number">☎ {product.contact}</p>

                        <div className="d-flex">
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => setIsChatOpen(true)}
                            >
                                Liên hệ ngay
                            </button>

                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setShowModal(true)}
                            >
                                Đặt lịch hẹn
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN MÔ TẢ NẰM DƯỚI */}
            <div className="product-description">
                <MoTaChiTiet description={product.description} />
            </div>

            {/* Modal đặt lịch hẹn */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đặt lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn ngày hẹn</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn giờ hẹn</Form.Label>
                            <Form.Control
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleBookAppointment}>
                        Đặt lịch
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} />

        </div>
    );
};

export default ChiTietSanPham;