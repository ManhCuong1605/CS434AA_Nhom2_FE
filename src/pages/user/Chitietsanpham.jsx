import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/Chitietsanpham.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";
import { useChat } from "../../context/ChatContext";
import nhaDatApi from "../../api/NhaDatApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatLichHenModal from "../../components/DatLichHenModal";

const ChiTietSanPham = () => {
    const { id } = useParams();
    const { setIsChatOpen } = useChat();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [showModal, setShowModal] = useState(false);



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


    return (
        <div className="product-container">
            <div className="product-top">
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
                                onClick={() => {
                                    const token = localStorage.getItem("token"); // kiểm tra token
                                    if (!token) {
                                        toast.error("Vui lòng đăng nhập để đặt lịch hẹn!");
                                    } else {
                                        setShowModal(true); // mở modal nếu đã đăng nhập
                                    }
                                }}
                            >
                                Đặt lịch hẹn
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-description">
                <MoTaChiTiet description={product.description} />
            </div>

            {/* Modal đặt lịch hẹn */}
            <DatLichHenModal
                show={showModal}
                onClose={() => setShowModal(false)}
                nhaDatId={id}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};



export default ChiTietSanPham;