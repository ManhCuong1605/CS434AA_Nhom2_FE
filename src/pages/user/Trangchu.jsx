import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Form, Button, Spinner, Pagination, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";

const PAGE_SIZE = 8;

const Trangchu = () => {
    const navigate = useNavigate();
    const [baiViets, setBaiViets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({});
    const [totalPages, setTotalPages] = useState(1);

    // Lấy danh sách bài viết
    const fetchBaiViets = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: PAGE_SIZE,
                search,
                ...filter
            };
            console.log("Gọi API với params:", params);
            const res = await quanLyBaiVietApi.layBaiVietDaDuyet(params);
            console.log("Response từ API:", res.data);
            // Response từ controller: { currentPage, totalPages, totalItems, data }
            setBaiViets(res.data.data || []);
            setTotal(res.data.totalItems || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách bài viết:", err);
            setBaiViets([]);
            setTotal(0);
            setTotalPages(1);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBaiViets();
        // eslint-disable-next-line
    }, [page, search, filter]);

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBaiViets();
    };

    // Xử lý filter
    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
        setPage(1);
    };

    // Render phân trang
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <>
            {/* Banner/Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '60px 0',
                textAlign: 'center'
            }}>
                <Container>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                        Chào mừng đến với BlackS City
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                        Nền tảng bất động sản uy tín - Kết nối người mua và người bán
                    </p>
                    <Button variant="light" size="lg" style={{ marginRight: '10px' }}>
                        Tìm kiếm ngay
                    </Button>
                    <Button variant="outline-light" size="lg">
                        Đăng tin miễn phí
                    </Button>
                </Container>
            </div>

            {/* Giới thiệu */}
            <Container style={{ marginTop: '60px', marginBottom: '40px' }}>
                <Row className="text-center">
                    <Col md={4}>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ color: '#198754' }}>🏠 Đa dạng bất động sản</h3>
                            <p>Nhà đất, căn hộ, biệt thự, đất nền với đầy đủ thông tin chi tiết</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ color: '#198754' }}>✅ Thông tin xác thực</h3>
                            <p>Tất cả bài đăng đều được kiểm duyệt và xác thực thông tin</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ color: '#198754' }}>💰 Giá cả minh bạch</h3>
                            <p>Thông tin giá cả rõ ràng, không ẩn phí, không môi giới</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Tìm kiếm và filter cải tiến */}
            <Container style={{ marginTop: 40, marginBottom: 40 }}>
                <h2 className="mb-4 text-center" style={{ color: '#198754' }}>Bất động sản dành cho bạn</h2>
                
                {/* Tìm kiếm chính */}
                <Form onSubmit={handleSearch} className="mb-4">
                    <Row className="g-2 align-items-center justify-content-center">
                        <Col md={6} sm={12}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm nhà đất"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    size="lg"
                                />
                                <Button type="submit" variant="danger" size="lg">Tìm kiếm</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    
                    {/* Filter nâng cao */}
                    <Row className="g-2 mt-3 justify-content-center">
                        <Col md={2} sm={6}>
                            <Form.Select name="thanhPho" onChange={handleFilterChange} defaultValue="" size="lg">
                                <option value="">-- Chọn Thành Phố --</option>
                                <option value="hanoi">Hà Nội</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="danang">Đà Nẵng</option>
                                <option value="cantho">Cần Thơ</option>
                                <option value="haiphong">Hải Phòng</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} sm={6}>
                            <Form.Select name="loaiDat" onChange={handleFilterChange} defaultValue="" size="lg">
                                <option value="">-- Chọn Loại Đất --</option>
                                <option value="nha">Nhà riêng</option>
                                <option value="canho">Căn hộ</option>
                                <option value="bietthu">Biệt thự</option>
                                <option value="datnen">Đất nền</option>
                                <option value="vanphong">Văn phòng</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} sm={6}>
                            <Form.Select name="khoangGia" onChange={handleFilterChange} defaultValue="" size="lg">
                                <option value="">-- Chọn khoảng giá --</option>
                                <option value="1">Dưới 1 tỷ</option>
                                <option value="2">1-3 tỷ</option>
                                <option value="3">3-5 tỷ</option>
                                <option value="4">5-10 tỷ</option>
                                <option value="5">Trên 10 tỷ</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} sm={6}>
                            <Form.Select name="dienTich" onChange={handleFilterChange} defaultValue="" size="lg">
                                <option value="">-- Chọn diện tích --</option>
                                <option value="1">Dưới 50m²</option>
                                <option value="2">50-100m²</option>
                                <option value="3">100-200m²</option>
                                <option value="4">200-500m²</option>
                                <option value="5">Trên 500m²</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>

                {/* Danh sách bài viết */}
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="success" />
                    </div>
                ) : baiViets.length === 0 ? (
                    <div className="text-center text-muted my-5">
                        <h4>Không có bài viết nào phù hợp.</h4>
                        <p>Vui lòng thử lại với tiêu chí tìm kiếm khác.</p>
                    </div>
                ) : (
                    <>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {baiViets.map((bv, idx) => (
                                <Col key={bv.id || idx}>
                                    <Card className="h-100 shadow-sm">
                                        <div style={{height:180,overflow:'hidden',borderTopLeftRadius:8,borderTopRightRadius:8}}>
                                            <Card.Img
                                                variant="top"
                                                src={bv.hinhAnh && bv.hinhAnh.length > 0 ? bv.hinhAnh[0].url : '/no-image.png'}
                                                alt={bv.tieuDe}
                                                style={{objectFit:'cover',width:'100%',height:180}}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title style={{fontSize:'1.1rem',fontWeight:600}}>{bv.tieuDe}</Card.Title>
                                            <div style={{color:'#198754',fontWeight:700}}>
                                                {bv.gia ? Number(bv.gia).toLocaleString() + ' VNĐ' : '---'}
                                            </div>
                                            <div style={{fontSize:13,margin:'6px 0'}}>
                                                <span>Nội dung: <b>{bv.noiDung?.substring(0, 50)}...</b></span><br/>
                                                <span>Địa chỉ: <b>{bv.diaChi}</b></span>
                                            </div>
                                            <div style={{fontSize:12,color:'#888'}}>
                                                Ngày đăng: {bv.ngayDang ? new Date(bv.ngayDang).toLocaleDateString() : '--'}
                                            </div>
                                            <div style={{fontSize:12,color:'#666'}}>
                                                Người đăng: {bv.nguoiDang?.HoTen || 'Ẩn danh'}
                                            </div>
                                            <div style={{fontSize:12,color:'#198754',fontWeight:600}}>
                                                📞 {bv.nguoiDang?.SoDienThoai || 'Chưa có số điện thoại'}
                                            </div>
                                        </Card.Body>
                                        <Card.Footer style={{background:'none',border:'none'}}>
                                            <div className="d-flex justify-content-center">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="md"
                                                    onClick={() => navigate(`/bai-viet/${bv.id}`)}
                                                    style={{fontSize: '0.9rem', minWidth: '120px'}}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>{paginationItems}</Pagination>
                            </div>
                        )}
                    </>
                )}
            </Container>

            {/* Thống kê */}
            <div style={{ background: '#f8f9fa', padding: '60px 0', marginTop: '60px' }}>
                <Container>
                    <h3 className="text-center mb-5" style={{ color: '#198754' }}>Thống kê bất động sản</h3>
                    <Row className="text-center">
                        <Col md={3} sm={6}>
                            <div style={{ padding: '20px' }}>
                                <h2 style={{ color: '#198754', fontSize: '2.5rem' }}>1,234</h2>
                                <p>Bài đăng mới</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={{ padding: '20px' }}>
                                <h2 style={{ color: '#198754', fontSize: '2.5rem' }}>567</h2>
                                <p>Giao dịch thành công</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={{ padding: '20px' }}>
                                <h2 style={{ color: '#198754', fontSize: '2.5rem' }}>89</h2>
                                <p>Đối tác tin cậy</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6}>
                            <div style={{ padding: '20px' }}>
                                <h2 style={{ color: '#198754', fontSize: '2.5rem' }}>99%</h2>
                                <p>Khách hàng hài lòng</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Tin tức và dự án nổi bật */}
            <Container style={{ marginTop: '60px', marginBottom: '40px' }}>
                <Row>
                    <Col md={8}>
                        <h3 className="mb-4" style={{ color: '#198754' }}>Tin tức bất động sản</h3>
                        <Row>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Img variant="top" src="/news1.jpg" style={{height: 150, objectFit: 'cover'}} />
                                    <Card.Body>
                                        <Card.Title style={{fontSize: '1rem'}}>Thị trường bất động sản 2024</Card.Title>
                                        <Card.Text style={{fontSize: '0.9rem'}}>
                                            Xu hướng mới trong thị trường bất động sản Việt Nam...
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Img variant="top" src="/news2.jpg" style={{height: 150, objectFit: 'cover'}} />
                                    <Card.Body>
                                        <Card.Title style={{fontSize: '1rem'}}>Dự án mới tại Hà Nội</Card.Title>
                                        <Card.Text style={{fontSize: '0.9rem'}}>
                                            Giới thiệu các dự án bất động sản mới tại thủ đô...
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <h3 className="mb-4" style={{ color: '#198754' }}>Dự án nổi bật</h3>
                        <Card className="mb-3">
                            <Card.Img variant="top" src="/project1.jpg" style={{height: 120, objectFit: 'cover'}} />
                            <Card.Body>
                                <Card.Title style={{fontSize: '1rem'}}>Sunshine City</Card.Title>
                                <Card.Text style={{fontSize: '0.9rem'}}>
                                    Dự án căn hộ cao cấp tại quận 7, TP.HCM
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Img variant="top" src="/project2.jpg" style={{height: 120, objectFit: 'cover'}} />
                            <Card.Body>
                                <Card.Title style={{fontSize: '1rem'}}>Vinhomes Central Park</Card.Title>
                                <Card.Text style={{fontSize: '0.9rem'}}>
                                    Khu đô thị hiện đại tại quận 1, TP.HCM
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Trangchu; 