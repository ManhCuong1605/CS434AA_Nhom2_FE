import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TinTuc = () => {
    return (
        <div
            style={{
                transform: "scale(0.9)",
                transformOrigin: "top center",
                maxWidth: "100%",
                margin: "auto"
            }}
        >
            <main className="bg-light py-5">
                <div className="container-fluid">
                    <h1 className="text-center mb-4">Tin tức bất động sản mới nhất</h1>
                    <p className="text-center text-muted mb-5">
                        Thông tin mới, đầy đủ, hấp dẫn về thị trường bất động sản Việt Nam thông qua dữ liệu lớn về giá, giao dịch, nguồn cung – cầu và khảo sát thực tế của đội ngũ phóng viên, biên tập của BlackS.com.
                    </p>

                    <div className="row">
                        {/* Bài viết nổi bật */}
                        <div className="col-md-8">
                            <div className="card mb-4 position-relative">
                                <img
                                    src="https://www.kiena.vn/vi-vn/images/autosize-730x0/upload/media/M613a0629f0636/so-sanh-bank.png"
                                    className="card-img-top"
                                    style={{ opacity: "0.7" }}
                                    alt="Thị trường chung cư Hà Nội"
                                />
                                <div className="card-body position-absolute bottom-0 left-0 text-black overlay">
                                    <small className="text-muted">17/02/2025 08:09 * Tin tức</small>
                                    <h4 className="card-title mt-2">
                                        Thị Trường Chung Cư Hà Nội Vắng Bóng Nhà Đầu Tư
                                    </h4>
                                    <p className="card-text">
                                        Thị trường chung cư Hà Nội trong năm 2024 là cuộc hội tụ đông đảo của cả người mua ở thực và giới đầu tư do mặt bằng giá liên tục lập đỉnh. Tuy nhiên, ngay từ đầu năm 2025, thị trường này đã có sự thay đổi khi nhà đầu tư vắng bóng và chỉ còn thu hút mối quan tâm của người mua ở thực.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách tin tức nhỏ */}
                        <div className="col-md-4">
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <small className="text-muted">10/01/2025 14:30 * Tin tức</small>
                                    <h6 className="mt-1">
                                        Thách thức và giải pháp nào cho thị trường BĐS trong kỉ nguyên mới?
                                    </h6>
                                </li>
                                <li className="mb-3">
                                    <small className="text-muted">10/01/2025 14:00 * Tin tức</small>
                                    <h6 className="mt-1">
                                        Lời tri ân sâu sắc, sao Việt tặng quà và thưởng tết tưng bừng
                                    </h6>
                                </li>
                            </ul>
                        </div>

                        {/* Danh sách các bài viết khác */}
                        <div className="mt-4">
                            <div className="row">
                                {/* Bài viết 1 */}
                                <div className="col-md-4 mb-4">
                                    <div className="card">
                                        <img
                                            src="https://img.iproperty.com.my/angel/520x300-crop/wp-content/uploads/sites/7/2025/02/hinh-1-_.jpg"
                                            className="card-img-top"
                                            alt="Bất động sản Hải Phòng"
                                        />
                                        <div className="card-body">
                                            <small className="text-muted">19/02/2025 08:00 * Tin tức</small>
                                            <h5 className="card-title mt-2">
                                                Hải Phòng: Đòn Bẩy Hạ Tầng "Làm Nóng" Thị Trường Bất Động Sản?
                                            </h5>
                                            <p className="card-text">
                                                Năm 2024 với hàng loạt dự án hạ tầng giao thông được triển khai đã làm thay đổi bộ mặt đô thị của Hải Phòng. Liệu sang năm 2025, thị trường này có tiếp tục “nóng” với sự quan tâm từ giới đầu tư?
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bài viết 2 */}
                                <div className="col-md-4 mb-4">
                                    <div className="card">
                                        <img
                                            src="https://img.iproperty.com.my/angel/520x300-crop/wp-content/uploads/sites/7/2025/02/image-5.png"
                                            className="card-img-top"
                                            alt="BĐS Khu Đông TP.HCM"
                                        />
                                        <div className="card-body">
                                            <small className="text-muted">19/02/2025 10:00 * Tin tức</small>
                                            <h5 className="card-title mt-2">
                                                BĐS Khu Đông Tăng Nhiệt Khi Biểu Tượng Mới Sắp Thành Hình?
                                            </h5>
                                            <p className="card-text">
                                                Khu Đông Sài Gòn (TP Thủ Đức) tiếp tục là điểm sáng của thị trường bất động sản TP.HCM năm 2025, nơi đây được kỳ vọng sẽ trở thành biểu tượng phát triển mới của toàn khu vực.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bài viết 3 */}
                                <div className="col-md-4 mb-4">
                                    <div className="card">
                                        <img
                                            src="https://img.iproperty.com.my/angel/520x300-crop/wp-content/uploads/sites/7/2025/02/image-6.jpeg"
                                            className="card-img-top"
                                            alt="Everland Group du lịch"
                                        />
                                        <div className="card-body">
                                            <small className="text-muted">19/02/2025 15:00 * Tin tức</small>
                                            <h5 className="card-title mt-2">
                                                Everland Group Nỗ Lực Kiến Tạo Hệ Sinh Thái Du Lịch Vịnh Biển Từ Long
                                            </h5>
                                            <p className="card-text">
                                                Tận dụng lợi thế đường bờ biển dài, Everland Group không ngừng mở rộng chuỗi dự án du lịch nghỉ dưỡng và giải trí, hướng đến việc tạo ra hệ sinh thái du lịch đẳng cấp.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default TinTuc;
