import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../style/Chitietsanpham.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";



// Danh sách bất động sản mẫu
const danhSachBatDongSan = [
    {
        id: 1,
        title: "BÁN BT NAM CƯỜNG DƯƠNG NỘI HÀ ĐÔNG 212M2",
        price: "34,13 tỷ",
        area: "212m²",
        pricePerM2: "161 tr/m²",
        bedrooms: 5,
        bathrooms: 4,
        location: "Hà Đông, Hà Nội",
        images: [
            require("../../assets/slide/banner1.jpg"),
            require("../../assets/slide/banner2.jpg"),
            require("../../assets/slide/banner3.jpg"),
            require("../../assets/slide/banner3.jpg")
        ],
        contact: "0969 524 ***",
        agent: "Nguyễn Bình Gkd",
        description: "Căn biệt thự cao cấp nằm trong khu đô thị Nam Cường Dương Nội, có diện tích 212m² với thiết kế hiện đại, gần trường học, bệnh viện, trung tâm thương mại và nhiều tiện ích khác."
    }
];

const ChiTietSanPham = () => {
    const { id } = useParams();
    const product = danhSachBatDongSan.find((p) => p.id === parseInt(id));

    const [selectedImage, setSelectedImage] = useState(product ? product.images[0] : "");
    if (!product) {
        return <div className="product-container">Sản phẩm không tồn tại.</div>;
    }

    return (
        <>
            <div className="product-container">
                <div className="product-content">

                    {/* Khu vực hiển thị ảnh */}
                    <div className="image-section">
                        <img
                            src={selectedImage}
                            alt="Ảnh chính"
                            className="main-image fade-in"
                        />
                        <div className="thumbnail-container">
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

                    {/* Thông tin sản phẩm */}
                    <div className="info-section">
                        <h2 className="product-title">{product.title}</h2>
                        <p className="product-location">{product.location}</p>
                        <p className="product-price"><strong>{product.price}</strong></p>
                        <p>{product.area} • {product.pricePerM2} • {product.bedrooms} PN • {product.bathrooms} WC</p>
                        <div className="contact-box">
                            <p><strong>Môi giới: {product.agent}</strong></p>
                            <p className="contact-number">☎ {product.contact}</p>
                            <button className="contact-button">Liên hệ ngay</button>
                        </div>
                    </div>

                    {/* Thêm phần mô tả chi tiết */}
                    <MoTaChiTiet description={product.description} />


                </div>
            </div>
        </>
    );
};

export default ChiTietSanPham;