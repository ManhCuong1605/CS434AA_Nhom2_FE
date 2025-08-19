import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import diaChiApi from "../../api/DiaChiApi.jsx";
import { useChat } from "../../context/ChatContext";
import "../../style/ChiTietBaiViet.css";

const ChiTietBaiViet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsChatOpen } = useChat();
    const [baiViet, setBaiViet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [addressNames, setAddressNames] = useState({ provinces: {}, districts: {}, wards: {} });
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Load address names for provinces
    useEffect(() => {
        let isMounted = true;
        const loadProvinces = async () => {
            try {
                setLoadingAddresses(true);
                const data = await diaChiApi.getAllProvinces();
                if (isMounted && data && Array.isArray(data) && data.length > 0) {
                    const provinceMap = data.reduce((acc, province) => {
                        acc[province.Id || province.code] = province.Name || province.name;
                        return acc;
                    }, {});
                    setAddressNames((prev) => ({ ...prev, provinces: provinceMap }));
                }
            } catch (error) {
                console.error("Lỗi khi load tỉnh/thành phố:", error);
            } finally {
                if (isMounted) setLoadingAddresses(false);
            }
        };
        loadProvinces();
        return () => {
            isMounted = false;
        };
    }, []);

    // Load chi tiết bài viết
    useEffect(() => {
        const fetchChiTiet = async () => {
            try {
                setLoading(true);
                const res = await quanLyBaiVietApi.getById(id);
                if (res.data.TrangThai !== 2) {
                    throw new Error("Bài viết chưa được duyệt hoặc không tồn tại.");
                }
                setBaiViet(res.data);
                if (res.data.hinhAnh && res.data.hinhAnh.length > 0) {
                    setSelectedImage(0);
                }

                if (res.data.ThanhPho) {
                    const districtsData = await diaChiApi.getDistrictsByProvince(res.data.ThanhPho);
                    const districtMap = districtsData.reduce((acc, district) => {
                        acc[district.Id || district.code] = district.Name || district.name;
                        return acc;
                    }, {});
                    setAddressNames((prev) => ({ ...prev, districts: { ...prev.districts, ...districtMap } }));

                    if (res.data.Quan) {
                        const wardsData = await diaChiApi.getWardsByDistrict(res.data.Quan);
                        const wardMap = wardsData.reduce((acc, ward) => {
                            acc[ward.Id || ward.code] = ward.Name || ward.name;
                            return acc;
                        }, {});
                        setAddressNames((prev) => ({ ...prev, wards: { ...prev.wards, ...wardMap } }));
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bài viết:", error);
                alert("Không thể tải thông tin bài viết! Bài viết có thể chưa được duyệt hoặc không tồn tại.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchChiTiet();
        }
    }, [id, navigate]);

    // Lấy bài viết liên quan
    useEffect(() => {
        const fetchRelated = async () => {
            if (!id) return;
            try {
                const res = await quanLyBaiVietApi.layBaiVietLienQuan(id);
                const approvedPosts = res.data.filter((post) => post.TrangThai === 2);
                setRelatedPosts(approvedPosts || []);
            } catch (e) {
                console.error("Lỗi khi lấy bài viết liên quan:", e);
                setRelatedPosts([]);
            }
        };
        fetchRelated();
    }, [id]);

    if (loading || loadingAddresses) {
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

    const getTitle = (post) => {
        if (post.TieuDe && post.TieuDe.trim()) {
            return post.TieuDe;
        }
        const address = [
            addressNames.wards[post.Phuong] || post.Phuong,
            addressNames.districts[post.Quan] || post.Quan,
            addressNames.provinces[post.ThanhPho] || post.ThanhPho,
        ].filter(Boolean).join(", ");
        return `Bất động sản tại ${address}`;
    };

    return (
        <Container className="my-5">
            <Row>
                {/* Hình ảnh */}
                <Col lg={6} md={12} className="mb-4 d-flex align-items-start">
                    <Card className="border-0 shadow-sm w-100">
                        <div style={{ position: 'relative' }}>
                            {baiViet.hinhAnh && baiViet.hinhAnh.length > 0 ? (
                                <>
                                    <img
                                        src={baiViet.hinhAnh[selectedImage]?.url}
                                        alt="Ảnh bất động sản"
                                        className="w-100"
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
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
                                                    opacity: 0.8,
                                                }}
                                                onClick={() =>
                                                    setSelectedImage((prev) =>
                                                        prev === 0 ? baiViet.hinhAnh.length - 1 : prev - 1
                                                    )
                                                }
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
                                                    opacity: 0.8,
                                                }}
                                                onClick={() =>
                                                    setSelectedImage((prev) =>
                                                        prev === baiViet.hinhAnh.length - 1 ? 0 : prev + 1
                                                    )
                                                }
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
                <Col lg={6} md={12}>
                    <Card className="border-0 shadow-sm h-100" style={{ minHeight: 600 }}>
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Thông tin chi tiết
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {/* Tiêu đề ngang với hình ảnh */}
                            <h2 className="mb-3" style={{ color: '#000000' }}>
                                {getTitle(baiViet)}
                            </h2>

                            <div className="mb-4">
                                <h3 className="text-danger fw-bold">
                                    {baiViet.GiaBan
                                        ? Number(baiViet.GiaBan).toLocaleString('vi-VN') + ' VNĐ'
                                        : 'Liên hệ'}
                                </h3>
                            </div>

                            {/* ĐÃ ẨN phần mô tả chi tiết */}

                            <div className="mb-4">
                                <h5>Thông tin bất động sản</h5>
                                <div className="row">
                                    <div className="col-6">
                                        <small className="text-muted">Diện tích:</small>
                                        <p className="mb-1">
                                            <strong>{baiViet.DienTich ? `${baiViet.DienTich} m²` : 'Chưa có'}</strong>
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted">Hướng:</small>
                                        <p className="mb-1">
                                            <strong>{baiViet.Huong || 'Không xác định'}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Địa chỉ</h5>
                                <p className="mb-0">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    {[
                                        baiViet.DiaChi,
                                        addressNames.wards[baiViet.Phuong] || baiViet.Phuong,
                                        addressNames.districts[baiViet.Quan] || baiViet.Quan,
                                        addressNames.provinces[baiViet.ThanhPho] || baiViet.ThanhPho,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5>Thông tin liên hệ</h5>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-user me-2"></i>
                                    <span>
                                        <strong>Người đăng:</strong> {baiViet.nguoiDang?.HoTen || 'Ẩn danh'}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-phone me-2"></i>
                                    <span>
                                        <strong>Số điện thoại:</strong>{' '}
                                        {baiViet.nguoiDang?.SoDienThoai || 'Chưa có'}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-calendar me-2"></i>
                                    <span>
                                        <strong>Ngày đăng:</strong>{' '}
                                        {baiViet.ngayDang
                                            ? new Date(baiViet.ngayDang).toLocaleDateString('vi-VN')
                                            : '--'}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-calendar-check me-2"></i>
                                    <span>
                                        <strong>Ngày duyệt:</strong>{' '}
                                        {baiViet.ngayDuyet
                                            ? new Date(baiViet.ngayDuyet).toLocaleDateString('vi-VN')
                                            : 'Chưa duyệt'}
                                    </span>
                                </div>
                            </div>

                           

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
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
                                            window.open(
                                                `https://zalo.me/${baiViet.nguoiDang.SoDienThoai}`,
                                                '_blank'
                                            );
                                        } else {
                                            alert('Không có số điện thoại liên hệ!');
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: 22,
                                            height: 22,
                                        }}
                                    >
                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect width="48" height="48" rx="12" fill="#0180DE" />
                                            <path
                                                d="M24 13C17.3726 13 12 17.4772 12 23C12 25.7614 13.3431 28.2386 15.5147 29.9992C15.1862 31.0932 14.3932 32.3932 13.5 33.5C13.5 33.5 16.5 33 19.5 31.5C21.0192 31.8202 22.4841 32 24 32C30.6274 32 36 27.5228 36 22C36 16.4772 30.6274 13 24 13Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </span>
                                    <span style={{ display: 'inline-block' }}>Chat Zalo</span>
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Các bài viết liên quan */}
            <div className="mt-5">
                <h3 className="mb-4" style={{ color: '#198754' }}>Bài viết liên quan</h3>
                {relatedPosts.length === 0 ? (
                    <p className="text-muted">Không có bài viết liên quan.</p>
                ) : (
                    <Row>
                        {relatedPosts.map((bv, idx) => (
                            <Col md={4} sm={6} xs={12} key={bv.id || idx} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={bv.hinhAnh?.[0]?.url || '/no-image.png'}
                                        style={{ height: 140, objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                            {getTitle(bv)}
                                        </Card.Title>
                                        <div
                                            style={{
                                                color: '#e74c3c',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                marginBottom: 8,
                                            }}
                                        >
                                            {bv.GiaBan
                                                ? Number(bv.GiaBan).toLocaleString('vi-VN') + ' VNĐ'
                                                : 'Liên hệ'}
                                        </div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => navigate(`/bai-viet/${bv.id}`)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Container>
    );
};

export default ChiTietBaiViet;
