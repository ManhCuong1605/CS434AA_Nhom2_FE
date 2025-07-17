import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import { useChat } from "../../context/ChatContext";
import "../../style/ChiTietBaiViet.css";

const ChiTietBaiViet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsChatOpen } = useChat();
    const [baiViet, setBaiViet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchChiTiet = async () => {
            try {
                setLoading(true);
                console.log("Đang lấy chi tiết bài viết ID:", id);
                const res = await quanLyBaiVietApi.getById(id);
                console.log("Dữ liệu bài viết:", res.data);
                setBaiViet(res.data);
                if (res.data.hinhAnh && res.data.hinhAnh.length > 0) {
                    setSelectedImage(0);
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bài viết:", error);
                alert("Không thể tải thông tin bài viết! Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchChiTiet();
        }
    }, [id]);

    if (loading) {
        return (
            <Container className="my-5">
                <div className="text-center">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3">Đang tải thông tin...</p>
                </div>
            </Container>
        );
    }

    if (!baiViet) {
        return (
            <Container className="my-5">
                <div className="text-center">
                    <h3>Không tìm thấy bài viết</h3>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-5">

            <Row>
                {/* Hình ảnh */}
                <Col lg={8} md={12} className="mb-4">
                    <Card className="border-0 shadow-sm">
                        <div style={{ position: 'relative' }}>
                            {baiViet.hinhAnh && baiViet.hinhAnh.length > 0 ? (
                                <>
                                    <img
                                        src={baiViet.hinhAnh[selectedImage]?.url}
                                        alt={baiViet.tieuDe}
                                        className="w-100"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    {/* Navigation buttons */}
                                    {baiViet.hinhAnh.length > 1 && (
                                        <>
                                            <Button
                                                variant="light"
                                                size="sm"
                                                style={{
                                                    position: 'absolute',
                                                    left: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    opacity: 0.8
                                                }}
                                                onClick={() => setSelectedImage(prev => 
                                                    prev === 0 ? baiViet.hinhAnh.length - 1 : prev - 1
                                                )}
                                            >
                                                ‹
                                            </Button>
                                            <Button
                                                variant="light"
                                                size="sm"
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    opacity: 0.8
                                                }}
                                                onClick={() => setSelectedImage(prev => 
                                                    prev === baiViet.hinhAnh.length - 1 ? 0 : prev + 1
                                                )}
                                            >
                                                ›
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div 
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ height: '400px', backgroundColor: '#f8f9fa' }}
                                >
                                    <p className="text-muted">Không có hình ảnh</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnail images */}
                        {baiViet.hinhAnh && baiViet.hinhAnh.length > 1 && (
                            <div className="thumbnail-container">
                                {baiViet.hinhAnh.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt={`Ảnh ${index + 1}`}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Thông tin chi tiết */}
                <Col lg={4} md={12}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Thông tin chi tiết
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            <h2 className="mb-3" style={{ color: '#000000' }}>
                                {baiViet.tieuDe}
                            </h2>
                            
                            <div className="mb-4">
                                <h3 className="text-danger fw-bold">
                                    {baiViet.gia ? Number(baiViet.gia).toLocaleString() + ' VNĐ' : 'Liên hệ'}
                                </h3>
                            </div>

                            <div className="mb-4">
                                <h5>Thông tin liên hệ</h5>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-user me-2"></i>
                                    <span><strong>Người đăng:</strong> {baiViet.nguoiDang?.HoTen || 'Ẩn danh'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-phone me-2"></i>
                                    <span><strong>Số điện thoại:</strong> {baiViet.nguoiDang?.SoDienThoai || 'Chưa có'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-calendar me-2"></i>
                                    <span><strong>Ngày đăng:</strong> {baiViet.ngayDang ? new Date(baiViet.ngayDang).toLocaleDateString('vi-VN') : '--'}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Địa chỉ</h5>
                                <p className="mb-0">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    {baiViet.diaChi}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5>Thông tin bổ sung</h5>
                                <div className="row">
                                    <div className="col-6">
                                        <small className="text-muted">ID bài viết:</small>
                                        <p className="mb-1"><strong>#{baiViet.id}</strong></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Mô tả chi tiết</h5>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-0" style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>
                                        {baiViet.noiDung}
                                    </p>
                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <Button 
                                    variant="success" 
                                    size="lg"
                                    onClick={() => setIsChatOpen(true)}
                                >
                                    <i className="fas fa-phone me-2"></i>
                                    Liên hệ ngay
                                </Button>
                                
                                <Button 
                                    variant="outline-primary" 
                                    size="lg"
                                    onClick={() => {
                                        if (baiViet.nguoiDang?.SoDienThoai) {
                                            window.open(`https://zalo.me/${baiViet.nguoiDang.SoDienThoai}`, '_blank');
                                        } else {
                                            alert('Không có số điện thoại liên hệ!');
                                        }
                                    }}
                                >
                                    <i className="fab fa-facebook-messenger me-2"></i>
                                    Chat Zalo
                                </Button>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Các bài viết liên quan */}
            <div className="mt-5">
                <h3 className="mb-4" style={{ color: '#198754' }}>Bài viết liên quan</h3>
                <p className="text-muted">Tính năng đang phát triển...</p>
            </div>
        </Container>
    );
};

export default ChiTietBaiViet; 