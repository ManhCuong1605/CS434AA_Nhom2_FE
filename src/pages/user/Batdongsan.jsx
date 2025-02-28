import React from "react";
import banner1 from "../../assets/slide/banner1.jpg";
import Header from "../../components/Header";
import TimKiem from "../../components/TimKiem";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Batdongsan() {
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
            image: banner1,
            agent: {
                name: "Nguyễn Bình Gkd",
                phone: "0969 524 ***",
            }
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
            image: banner1,
            agent: {
                name: "Global Property",
                phone: "0987 761 ***",
            }
        }
    ];

    return (
        <div>
            <Header />
            <TimKiem />
            <div className="container mt-4">
                <h2 className="text-center fw-bold fs-4">Danh sách bất động sản</h2>
                <div className="row mt-3">
                    {danhSachBatDongSan.map((item) => (
                        <div key={item.id} className="col-12 d-flex justify-content-center mb-4">
                            <div className="card shadow-sm border-0" style={{ maxWidth: "850px", width: "100%", minHeight: "550px" }}>
                                {/* Bọc hình ảnh bằng Link */}
                                <Link to={`/bat-dong-san/${item.id}`} className="text-decoration-none">
                                    <img src={item.image} className="card-img-top rounded-top" alt={item.title} style={{ height: "350px", objectFit: "cover" }} />
                                </Link>
                                <div className="p-4">
                                    {/* Bọc tiêu đề bằng Link */}
                                    <Link to={`/bat-dong-san/${item.id}`} className="text-decoration-none">
                                        <h4 className="fw-bold mt-2 fs-5 text-dark">{item.title}</h4>
                                    </Link>
                                    <p className="text-danger fw-bold mb-1 fs-6">{item.price}</p>
                                    <p className="text-muted small mb-1 fs-6">
                                        {item.area} • {item.pricePerM2} • {item.bedrooms} PN • {item.bathrooms} WC
                                    </p>
                                    <p className="text-primary small fs-6">{item.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default Batdongsan;