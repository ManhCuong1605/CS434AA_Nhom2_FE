import React from "react";
import { Card, Col, Row, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../style/Trangchu.css';
import bds1 from '../../assets/productImages/bds1.jpg';
import bds2 from '../../assets/productImages/bds2.jpg';
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

// Danh sách sản phẩm bất động sản
const trangChuSanPhamData = [
  {
    id: 1,
    title: "Biệt thự biển sang trọng",
    description: "Thanh Khê",
    price: "15 tỷ VNĐ",
    image: bds1
  },
  {
    id: 2,
    title: "Nhà phố hiện đại",
    description: "Sơn Trà",
    price: "7 tỷ VNĐ",
    image: bds2
  },
  {
    id: 3,
    title: "Biệt thự ven sông",
    description: "Hải Châu",
    price: "20 tỷ VNĐ",
    image: bds1
  },
  {
    id: 4,
    title: "Căn hộ cao cấp",
    description: "Hòa Vang",
    price: "10 tỷ VNĐ",
    image: bds2
  }
];

const Trangchu = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
      <Row gutter={[16, 16]}>
        {trangChuSanPhamData.map((item) => (
          <Col xs={24} sm={12} md={6} lg={6} key={item.id}>
            <Card
              hoverable
              cover={<img alt={item.title} src={item.image} className="img-fluid card-image" />}
              className="shadow-sm card-container"
            >
              <div className="card-content">
                <Meta
                  title={<span className="card-title">{item.title}</span>}
                  description={<span className="card-description">{item.description}</span>}
                />
                <p className="card-price">{item.price}</p>
                <div className="card-footer">
                  <Button type="primary" block className="card-button" onClick={() => navigate(`/product/${item.id}`)}>
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Trangchu;