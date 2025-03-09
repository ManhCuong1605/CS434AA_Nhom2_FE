import React from "react";
import { Card, Col, Row, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../style/Trangchu.css';
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

// Danh sách sản phẩm bất động sản
const trangChuSanPhamData = [
  {
    id: 1,
    title: "Biệt thự biển sang trọng",
    description: "Thanh Khê",
    price: "15 tỷ VNĐ",
    image: require("../../assets/productImages/bds1.jpg")
  },
  {
    id: 2,
    title: "Nhà phố hiện đại",
    description: "Sơn Trà",
    price: "7 tỷ VNĐ",
    image: require("../../assets/productImages/bds2.jpg")
  },
  {
    id: 3,
    title: "Biệt thự ven sông",
    description: "Hải Châu",
    price: "20 tỷ VNĐ",
    image: require("../../assets/productImages/bds3.jpg")
  },
  {
    id: 4,
    title: "Căn hộ cao cấp",
    description: "Hòa Vang",
    price: "10 tỷ VNĐ",
    image: require("../../assets/productImages/bds4.jpg")
  },
  {
    id: 5,
    title: "Biệt thự biển sang trọng",
    description: "Thanh Khê",
    price: "15 tỷ VNĐ",
    image: require("../../assets/productImages/bds5.jpg")
  },
  {
    id: 6,
    title: "Nhà phố hiện đại",
    description: "Sơn Trà",
    price: "7 tỷ VNĐ",
    image: require("../../assets/productImages/bds6.jpg")
  },
  {
    id: 7,
    title: "Biệt thự ven sông",
    description: "Hải Châu",
    price: "20 tỷ VNĐ",
    image: require("../../assets/productImages/bds7.jpg")
  }
];
const diaDiemData = [
  { id: 1, title: "Thành Phố Hồ Chí Minh", image: require("../../assets/locations/hcm.jpg"), large: true },
  { id: 2, title: "Hà Nội", image: require("../../assets/locations/hn.jpg") },
  { id: 3, title: "Hải Phòng", image: require("../../assets/locations/hp.jpg") },
  { id: 4, title: "Cần Thơ", image: require("../../assets/locations/ct.jpg") },
  { id: 5, title: "Đà Nẵng", image: require("../../assets/locations/dn.jpg") }
];

const realEstateFeatures = [
  { title: "Bất động sản bán", description: "Tìm kiếm cơ hội đầu tư và an cư lý tưởng.", img: require("../../assets/locations/bdsBan.png") },
  { title: "Bất động sản cho thuê", description: "Cập nhật nhà cho thuê mới nhất.", img: require("../../assets/locations/bdsThue.png") },
  { title: "Đánh giá dự án", description: "Xem nhận xét từ chuyên gia BĐS.", img: require("../../assets/locations/duan.png") },
  { title: "Wiki BĐS", description: "Học hỏi kinh nghiệm và kiến thức BĐS.", img: require("../../assets/locations/wikibds.png") }
];

const Trangchu = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
      <Row gutter={[16, 16]}>
        {trangChuSanPhamData.map((item) => (
          <Col xs={24} sm={12} md={6} lg={6} key={item.id}>
            <Card hoverable cover={<img alt={item.title} src={item.image} className="img-fluid card-image" />} className="shadow-sm card-container">
              <Meta title={<span className="card-title">{item.title}</span>} description={item.description} />
              <p className="card-price">{item.price}</p>
              <Button type="primary" block onClick={() => navigate(`/product/${item.id}`)}>Xem chi tiết</Button>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="container mt-4">
        <h2 className="text-center my-4">Bất Động Sản Theo Địa Điểm</h2>
        <div className="real-estate-container">
          {diaDiemData.map((item) => (
            <div key={item.id} className={`real-estate-card ${item.large ? 'large' : ''}`}>
              <img src={item.image} alt={item.title} />
              <div className="location-name">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-center my-4">Tìm hiểu thêm về Bất động sản</h2>
        <Row gutter={[16, 16]} className="text-center">
          {realEstateFeatures.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="feature-card shadow-sm">
                <img src={feature.img} alt={feature.title} className="feature-icon mb-3" />
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
export default Trangchu;