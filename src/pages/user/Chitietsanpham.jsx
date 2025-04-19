import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/Chitietsanpham.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";
import { useChat } from "../../context/ChatContext"; // Import context
import nhaDatApi from "../../api/NhaDatApi";


const ChiTietSanPham = () => {
    const { id } = useParams();
    const { setIsChatOpen } = useChat();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await nhaDatApi.getById(id); // Gọi API BE
                const data = res.data;

                // Mapping dữ liệu BE sang UI
                const mappedData = {
                    title: data.TenNhaDat,
                    price: `${Number(data.GiaBan).toLocaleString()} VND`,
                    area: `${data.DienTich}m²`,
                    pricePerM2: data.GiaBan && data.DienTich ? `${Math.round(data.GiaBan / data.DienTich).toLocaleString()} VND/m²` : "",
                    location: `${data.Duong}, ${data.Phuong}, ${data.Quan}, ${data.ThanhPho}`,
                    images: data.hinhAnh?.map(img => img.url) || [],
                    contact: "0969 524 111", // tạm thời hardcode
                    agent: "Nguyễn Bình Gold", // tạm thời hardcode
                    description: data.MoTa,
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
                    <p className="product-meta">
                        Diện tích {product.area} • {product.pricePerM2}
                    </p>

                    <div className="contact-box">
                        <p><strong>Môi giới: {product.agent}</strong></p>
                        <p className="contact-number">☎ {product.contact}</p>
                        <button className="contact-button" onClick={() => setIsChatOpen(true)}>Liên hệ ngay</button>
                    </div>
                </div>
            </div>

            {/* PHẦN MÔ TẢ NẰM DƯỚI */}
            <div className="product-description">
                <MoTaChiTiet description={product.description} />
            </div>
        </div>

    );
}
export default ChiTietSanPham;