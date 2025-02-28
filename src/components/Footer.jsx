import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebookF, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

import "../style/Footer.css";

function Footer() {
    return (
        <footer className="footer bg-dark text-white py-5">
            <div className="container">
                <div className="row">

                    {/* Cột 1 - Thông tin công ty */}
                    <div className="col-md-4">
                        <h5 className="footer-title">Công ty Bất Động Sản</h5>
                        <p className="footer-text">
                            Chúng tôi cung cấp dịch vụ mua bán, cho thuê nhà đất chuyên nghiệp với đội ngũ tư vấn tận tâm.
                        </p>
                        <p><FaMapMarkerAlt /> 123 Đường ABC, Quận 1, TP. HCM</p>
                    </div>

                    {/* Cột 2 - Liên hệ */}
                    <div className="col-md-4">
                        <h5 className="footer-title">Liên hệ</h5>
                        <p><FaPhoneAlt /> <a href="tel:0969524***" className="footer-link">0969 524 ***</a></p>
                        <p><FaEnvelope /> <a href="mailto:info@batdongsan.com" className="footer-link">info@batdongsan.com</a></p>
                    </div>

                    {/* Cột 3 - Mạng xã hội */}
                    <div className="col-md-4 text-center">
                        <h5 className="footer-title">Kết nối với chúng tôi</h5>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaPhoneAlt /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                        </div>
                    </div>
                </div>

                {/* Đường kẻ ngang */}
                <hr className="footer-divider" />

                {/* Dòng dưới cùng */}
                <div className="text-center">
                    <p className="mb-0 text-muted">© 2024 Bất Động Sản. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;