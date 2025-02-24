import React from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../style/Chitietsanpham.css";
import banner1 from "../../assets/slide/banner1.jpg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
        images: [banner1, banner1]
    },
    {
        id: 2,
        title: "VINHOMES WONDER CITY ĐAN PHƯỢNG",
        price: "50 tỷ",
        area: "200m²",
        pricePerM2: "250 tr/m²",
        bedrooms: 7,
        bathrooms: 6,
        location: "Đan Phượng, Hà Nội",
        images: [banner1, banner1]
    }
];

const ChiTietSanPham = () => {
    const { id } = useParams();
    const product = danhSachBatDongSan.find((p) => p.id === parseInt(id));

    if (!product) {
        return <div className="product-container">Sản phẩm không tồn tại.</div>;
    }

    return (
        <>
            <Header />
            <div className="product-container">
                <div className="product-detail-container">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        className="product-swiper"
                    >
                        {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img src={img} alt={`Ảnh ${index + 1}`} className="product-img" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="product-detail-info">
                        <h2 className="product-title">{product.title}</h2>
                        <p className="product-description">{product.location}</p>
                        <p className="product-price">Giá: <strong>{product.price}</strong></p>
                        <button className="buy-button">Liên hệ ngay</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

};

export default ChiTietSanPham;
