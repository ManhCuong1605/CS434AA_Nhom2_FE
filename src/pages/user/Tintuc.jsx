import React, { useEffect, useState } from "react";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import { Card, Button, Spinner, Pagination, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PAGE_SIZE = 6;

const TinTuc = () => {
    const [baiViets, setBaiViets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBaiViets();
        // eslint-disable-next-line
    }, [page]);

    const fetchBaiViets = async () => {
        setLoading(true);
        try {
            const res = await quanLyBaiVietApi.layBaiVietDaDuyet({ page, limit: PAGE_SIZE });
            setBaiViets(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setBaiViets([]);
            setTotalPages(1);
        }
        setLoading(false);
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
        <Container className="mt-5 mb-5">
            <h2 className="text-center mb-4">Tin tức bất động sản mới nhất từ khách hàng</h2>
            <Row>
                <Col md={8} sm={12} style={{paddingRight: '40px'}}>
                    {loading ? (
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
                                    <Row key={bv.id || idx} className="align-items-center py-4" style={{borderBottom: '1px solid #eee', marginBottom: 24}}>
                                        <Col md={4} sm={12} className="mb-3 mb-md-0">
                                            <img
                                                src={bv.hinhAnh && bv.hinhAnh.length > 0 ? bv.hinhAnh[0].url : '/no-image.png'}
                                                alt={bv.tieuDe}
                                                style={{width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}
                                            />
                                        </Col>
                                        <Col md={8} sm={12}>
                                            <div style={{fontSize:14, color:'#888', marginBottom: 4}}>
                                                {bv.ngayDang ? new Date(bv.ngayDang).toLocaleDateString('vi-VN') : '--'} * Tin tức
                                            </div>
                                            <div style={{fontWeight:700, fontSize:'1.6rem', marginBottom: 8}}>{bv.tieuDe}</div>
                                            <div style={{fontSize:15, marginBottom: 4}}>
                                                <span style={{fontWeight:600}}>{bv.noiDung?.substring(0, 80)}{bv.noiDung && bv.noiDung.length > 80 ? '...' : ''}</span>
                                            </div>
                                            <div style={{color:'#e74c3c', fontWeight:700, fontSize:'1.1rem', marginBottom: 8}}>
                                                {bv.gia ? Number(bv.gia).toLocaleString() + ' VNĐ' : '---'}
                                            </div>
                                            <div style={{fontSize:14, color:'#666', marginBottom: 4}}>
                                                Người đăng: {bv.nguoiDang?.HoTen || 'Ẩn danh'}
                                            </div>
                                            <div style={{fontSize:14, color: bv.nguoiDang?.SoDienThoai ? '#198754' : '#e74c3c', fontWeight:600, marginBottom: 8}}>
                                                <span role="img" aria-label="phone">📞</span> {bv.nguoiDang?.SoDienThoai || 'Chưa có số điện thoại'}
                                            </div>
                                            <Button 
                                                variant="outline-primary" 
                                                size="md"
                                                onClick={() => navigate(`/bai-viet/${bv.id}`)}
                                                style={{fontSize: '0.95rem', minWidth: '120px'}}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <Row className="justify-content-center" style={{marginTop: '80px', marginBottom: '24px'}}>
                                    <Col md={8} className="d-flex justify-content-center">
                                        <Pagination>{paginationItems}</Pagination>
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                </Col>
                <Col md={4} className="d-none d-md-block" style={{paddingLeft: '0px'}}>
                    <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',padding:'24px',marginLeft:40,marginBottom:32}}>
                        <h5 style={{fontWeight:700,marginBottom:20}}>Bài viết được xem nhiều nhất</h5>
                        <ul style={{listStyle:'none',padding:0,margin:0}}>
                            {["Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất Tháng 7/2025",
                              "Tổng Hợp Dự Án Chung Cư TP.HCM Mở Bán Quý 3/2025: Dồi Dào Nguồn Cung Hậu Sáp Nhập",
                              "Thị Trường Bất Động Sản Tháng 4/2025: Giảm Nhẹ Một Số Phân Khúc",
                              "Môi Giới Đất Nền Đồng Loạt Quay Lại Với Nghề",
                              "Giá Chung Cư Hà Nội Trên Thị Trường Thứ Cấp Đang Tăng Trở Lại"
                            ].map((title, i) => (
                                <li key={i} style={{display:'flex',alignItems:'flex-start',marginBottom:20}}>
                                    <span style={{display:'inline-block',minWidth:28,height:28,background:'#ffeaea',color:'#e74c3c',borderRadius:'50%',textAlign:'center',lineHeight:'28px',fontWeight:700,marginRight:14,fontSize:17}}>{i+1}</span>
                                    <span style={{fontSize:16,lineHeight:'22px',fontWeight:500}}>{title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Box 1: Thị trường BĐS tại các tỉnh/thành sôi động nhất */}
                    <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',padding:'24px',marginLeft:40,marginBottom:32}}>
                        <h5 style={{fontWeight:700,marginBottom:20}}>Thị trường BĐS tại các tỉnh / thành sôi động nhất</h5>
                        <div style={{display:'flex',gap:16}}>
                            {[
                                {name:'Hà Nội',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hanoi.6a457985.png'},
                                {name:'Hồ Chí Minh',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hcmc.fcaa9c3c.png'}
                            ].map((item,i)=>(
                                <div key={i} style={{position:'relative',flex:1}}>
                                    <img src={item.img} alt={item.name} style={{width:'100%',height:80,objectFit:'cover',borderRadius:10}}/>
                                    <span style={{position:'absolute',left:0,right:0,bottom:10,color:'#fff',fontWeight:700,fontSize:18,textShadow:'0 2px 8px #000',textAlign:'center'}}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Box 2: Thị trường BĐS tại 10 tỉnh/thành phố lớn */}
                    <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',padding:'24px',marginLeft:40}}>
                        <h5 style={{fontWeight:700,marginBottom:20}}>Thị trường BĐS tại 10 tỉnh / thành phố lớn</h5>
                        <hr style={{margin:'12px 0'}}/>
                        <ul style={{listStyle:'none',padding:0,margin:0}}>
                            {[
                                {name:'Bà Rịa - Vũng Tàu',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/baRiaVungTau.371959d8.png'},
                                {name:'Bình Dương',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/binhDuong.54a38560.png'},
                                {name:'Đà Nẵng',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/daNang.2c9d1a7f.png'},
                                {name:'Đồng Nai',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/dongNai.1b3d35bd.png'},
                                {name:'Hải Phòng',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/haiPhong.652be04a.png'},
                                {name:'Hưng Yên',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hungYen.51aa190a.png'},
                                {name:'Hà Nội',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hanoi.6a457985.png'},
                                {name:'Hồ Chí Minh',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/hcmc.fcaa9c3c.png'},
                                {name:'Khánh Hòa',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/khanhHoa.294e8d36.png'},
                                {name:'Quảng Ninh',img:'https://cdn-assets-angel.batdongsan.com.vn/_next/static/media/quangNinh.3bd99372.png'}
                            ].map((item,i)=>(
                                <li key={i} style={{display:'flex',alignItems:'center',marginBottom:14}}>
                                    <img src={item.img} alt={item.name} style={{width:38,height:38,objectFit:'cover',borderRadius:8,marginRight:12}}/>
                                    <span style={{fontSize:16,fontWeight:500}}>{item.name}</span>
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
