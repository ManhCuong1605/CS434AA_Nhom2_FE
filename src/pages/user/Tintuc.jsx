import React, { useEffect, useState } from "react";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import diaChiApi from "../../api/DiaChiApi.jsx";
import { Button, Spinner, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PhanTrang from "../../components/PhanTrang.jsx";

const PAGE_SIZE = 6;

const TinTuc = () => {
    const [baiViets, setBaiViets] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [addressNames, setAddressNames] = useState({ provinces: {}, districts: {}, wards: {} });
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const navigate = useNavigate();

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

    // Load posts and address names for districts and wards
    useEffect(() => {
        const fetchBaiViets = async () => {
            setLoading(true);
            try {
                const res = await quanLyBaiVietApi.layBaiVietDaDuyet({ page, limit: PAGE_SIZE });
                const posts = res.data.data || [];
                const approvedPosts = posts.filter((post) => post.TrangThai === 2);
                setBaiViets(approvedPosts);
                setTotalPages(res.data.totalPages || 1);

                const uniqueProvinces = [...new Set(approvedPosts.map((post) => post.ThanhPho))];
                const uniqueDistricts = [...new Set(approvedPosts.map((post) => post.Quan))];

                for (const provinceId of uniqueProvinces) {
                    if (provinceId && !addressNames.districts[provinceId]) {
                        try {
                            const districtsData = await diaChiApi.getDistrictsByProvince(provinceId);
                            const districtMap = districtsData.reduce((acc, district) => {
                                acc[district.Id || district.code] = district.Name || district.name;
                                return acc;
                            }, {});
                            setAddressNames((prev) => ({
                                ...prev,
                                districts: { ...prev.districts, ...districtMap },
                            }));
                        } catch (error) {
                            console.error(`Lỗi khi load quận/huyện cho tỉnh ${provinceId}:`, error);
                        }
                    }
                }

                for (const districtId of uniqueDistricts) {
                    if (districtId && !addressNames.wards[districtId]) {
                        try {
                            const wardsData = await diaChiApi.getWardsByDistrict(districtId);
                            const wardMap = wardsData.reduce((acc, ward) => {
                                acc[ward.Id || ward.code] = ward.Name || ward.name;
                                return acc;
                            }, {});
                            setAddressNames((prev) => ({
                                ...prev,
                                wards: { ...prev.wards, ...wardMap },
                            }));
                        } catch (error) {
                            console.error(`Lỗi khi load phường/xã cho quận ${districtId}:`, error);
                        }
                    }
                }
            } catch (err) {
                console.error("Lỗi khi lấy bài viết:", err);
                setBaiViets([]);
                setTotalPages(1);
            }
            setLoading(false);
        };

        fetchBaiViets();
        // eslint-disable-next-line
    }, [page]);

    // Generate title from address as fallback
    const generateTitle = (post) => {
        const address = [
            addressNames.wards[post.Phuong] || post.Phuong,
            addressNames.districts[post.Quan] || post.Quan,
            addressNames.provinces[post.ThanhPho] || post.ThanhPho,
        ].filter(Boolean).join(", ");
        return `Bất động sản tại ${address}`;
    };

    // Handle navigation to detail page
    const handleNavigate = (id) => {
        navigate(`/bai-viet/${id}`);
    };

    return (
        <Container className="mt-5 mb-5">
            <h2 className="text-center mb-4">Tin tức bất động sản mới nhất từ khách hàng</h2>
            <Row>
                <Col md={8} sm={12} style={{ paddingRight: '40px' }}>
                    {loading || loadingAddresses ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="success" />
                        </div>
                    ) : baiViets.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <h4>Không có bài viết nào phù hợp.</h4>
                        </div>
                    ) : (
                        <>
                            <div>
                                {baiViets.map((bv, idx) => (
                                    <Row
                                        key={bv.id || idx}
                                        className="align-items-center py-4"
                                        style={{ borderBottom: '1px solid #eee', marginBottom: 24 }}
                                    >
                                        {/* Ảnh bất động sản - Clickable */}
                                        <Col
                                            md={4}
                                            sm={12}
                                            className="mb-3 mb-md-0 d-flex align-items-start"
                                            onClick={() => handleNavigate(bv.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={
                                                    bv.hinhAnh && bv.hinhAnh.length > 0
                                                        ? bv.hinhAnh[0].url
                                                        : '/no-image.png'
                                                }
                                                alt="Ảnh bất động sản"
                                                style={{
                                                    width: '100%',
                                                    height: 220,
                                                    objectFit: 'cover',
                                                    borderRadius: 12,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                                }}
                                            />
                                        </Col>

                                        {/* Nội dung bài viết */}
                                        <Col md={8} sm={12}>
                                            <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>
                                                {bv.ngayDang
                                                    ? new Date(bv.ngayDang).toLocaleDateString('vi-VN')
                                                    : '--'}{' '}
                                                * Tin tức
                                            </div>

                                            {/* Tiêu đề - Clickable */}
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: '1.6rem',
                                                    marginBottom: 8,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleNavigate(bv.id)}
                                            >
                                                {bv.TieuDe || generateTitle(bv)}
                                            </div>

                                            <div
                                                style={{
                                                    color: '#e74c3c',
                                                    fontWeight: 700,
                                                    fontSize: '1.1rem',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {bv.GiaBan
                                                    ? Number(bv.GiaBan).toLocaleString('vi-VN') + ' VNĐ'
                                                    : 'Liên hệ'}
                                            </div>

                                            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                {[
                                                    bv.DiaChi,
                                                    addressNames.wards[bv.Phuong] || bv.Phuong,
                                                    addressNames.districts[bv.Quan] || bv.Quan,
                                                    addressNames.provinces[bv.ThanhPho] || bv.ThanhPho,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            </div>

                                            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                                Người đăng: {bv.nguoiDang?.HoTen || 'Ẩn danh'}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    color: bv.nguoiDang?.SoDienThoai ? '#198754' : '#e74c3c',
                                                    fontWeight: 600,
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <span role="img" aria-label="phone">📞</span>{' '}
                                                {bv.nguoiDang?.SoDienThoai || 'Chưa có số điện thoại'}
                                            </div>

                                            <Button
                                                variant="outline-primary"
                                                size="md"
                                                onClick={() => handleNavigate(bv.id)}
                                                style={{ fontSize: '0.95rem', minWidth: '120px' }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <Row className="justify-content-center mt-5">
                                    <Col md={8} className="d-flex justify-content-center">
                                        <PhanTrang
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
                                        />
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                </Col>
                <Col md={4} className="d-none d-md-block" style={{ paddingLeft: '0px' }}>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            padding: '24px',
                            marginLeft: 40,
                            marginBottom: 32,
                        }}
                    >
                        <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Bài viết được xem nhiều nhất</h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                "Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất Tháng 7/2025",
                                "Tổng Hợp Dự Án Chung Cư TP.HCM Mở Bán Quý 3/2025: Dồi Dào Nguồn Cung Hậu Sáp Nhập",
                                "Thị Trường Bất Động Sản Tháng 4/2025: Giảm Nhẹ Một Số Phân Khúc",
                                "Môi Giới Đất Nền Đồng Loạt Quay Lại Với Nghề",
                                "Giá Chung Cư Hà Nội Trên Thị Trường Thứ Cấp Đang T Ascending",
                            ].map((title, i) => (
                                <li
                                    key={i}
                                    style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20 }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            minWidth: 28,
                                            height: 28,
                                            background: '#ffeaea',
                                            color: '#e74c3c',
                                            borderRadius: '50%',
                                            textAlign: 'center',
                                            lineHeight: '28px',
                                            fontWeight: 700,
                                            marginRight: 14,
                                            fontSize: 17,
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}>
                                        {title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            padding: '24px',
                            marginLeft: 40,
                            marginBottom: 32,
                        }}
                    >
                        <h5 style={{ fontWeight: 700, marginBottom: 20 }}>
                            Thị trường BĐS tại các tỉnh / thành sôi động nhất
                        </h5>
                        <div style={{ display: 'flex', gap: 16 }}>
                            {[
                                {
                                    name: 'Hà Nội',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hanoi.6a457985.png',
                                },
                                {
                                    name: 'Hồ Chí Minh',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hcmc.fcaa9c3c.png',
                                },
                            ].map((item, i) => (
                                <div key={i} style={{ position: 'relative', flex: 1 }}>
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: 10,
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            bottom: 10,
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: 18,
                                            textShadow: '0 2px 8px #000',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            padding: '24px',
                            marginLeft: 40,
                        }}
                    >
                        <h5 style={{ fontWeight: 700, marginBottom: 20 }}>
                            Thị trường BĐS tại 10 tỉnh / thành phố lớn
                        </h5>
                        <hr style={{ margin: '12px 0' }} />
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                {
                                    name: 'Bà Rịa - Vũng Tàu',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/baRiaVungTau.371959d8.png',
                                },
                                {
                                    name: 'Bình Dương',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/binhDuong.54a38560.png',
                                },
                                {
                                    name: 'Đà Nẵng',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/daNang.2c9d1a7f.png',
                                },
                                {
                                    name: 'Đồng Nai',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/dongNai.1b3d35bd.png',
                                },
                                {
                                    name: 'Hải Phòng',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/haiPhong.652be04a.png',
                                },
                                {
                                    name: 'Hưng Yên',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hungYen.51aa190a.png',
                                },
                                {
                                    name: 'Hà Nội',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hanoi.6a457985.png',
                                },
                                {
                                    name: 'Hồ Chí Minh',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hcmc.fcaa9c3c.png',
                                },
                                {
                                    name: 'Khánh Hòa',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/khanhHoa.294e8d36.png',
                                },
                                {
                                    name: 'Quảng Ninh',
                                    img: 'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/quangNinh.3bd99372.png',
                                },
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            marginRight: 12,
                                        }}
                                    />
                                    <span style={{ fontSize: 16, fontWeight: 500 }}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default TinTuc;