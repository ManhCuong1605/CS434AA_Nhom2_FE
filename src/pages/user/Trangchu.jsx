import React from "react";
import { Card, Col, Row, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../style/Trangchu.css';
import bds1 from '../../assets/productImages/bds1.jpg'
import bds2 from '../../assets/productImages/bds2.jpg'
const { Meta } = Card;

// Danh sách sản phẩm bất động sản
const trangChuSanPhamData = [
  {
    id: 1,
    title: "Biệt thự biển sang trọng",
    description: "Hướng biển, đầy đủ tiện ích cao cấp.",
    price: "15 tỷ VNĐ",
    image: bds1 // Đường dẫn tuyệt đối từ thư mục public
  },
  {
    id: 2,
    title: "Nhà phố hiện đại",
    description: "Nằm ngay trung tâm thành phố.",
    price: "7 tỷ VNĐ",
    image: bds2 // Đường dẫn tuyệt đối từ thư mục public
  },
  {
    id: 3,
    title: "Biệt thự ven sông",
    description: "Khung cảnh tuyệt đẹp, không gian sống thư giãn.",
    price: "20 tỷ VNĐ",
    image: bds1
  },
  {
    id: 4,
    title: "Căn hộ cao cấp",
    description: "Vị trí thuận tiện, tiện nghi đầy đủ.",
    price: "10 tỷ VNĐ",
    image: bds2
  },
  {
    id: 5,
    title: "Nhà phố hiện đại",
    description: "Nằm ngay trung tâm thành phố.",
    price: "7 tỷ VNĐ",
    image: bds2
  },
  {
    id: 6,
    title: "Biệt thự biển sang trọng",
    description: "Hướng biển, đầy đủ tiện ích cao cấp.",
    price: "15 tỷ VNĐ",
    image: bds1
  },
  {
    id: 7,
    title: "Nhà phố hiện đại",
    description: "Nằm ngay trung tâm thành phố.",
    price: "7 tỷ VNĐ",
    image: bds2
  },
  {
    id: 8,
    title: "Biệt thự biển sang trọng",
    description: "Hướng biển, đầy đủ tiện ích cao cấp.",
    price: "15 tỷ VNĐ",
    image: bds1
  }
];

const Trangchu = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
      <Row gutter={[16, 16]}>
        {trangChuSanPhamData.map((item) => (
          <Col xs={24} sm={12} md={6} lg={6} key={item.id}> {/* Thay đổi này để hiển thị 4 sản phẩm mỗi dòng */}
            <Card
              hoverable
              cover={<img alt={item.title} src={item.image} className="img-fluid" />}
              className="shadow-sm card-container"
            >
              <Meta
                title={<span className="card-title">{item.title}</span>}
                description={<span className="card-description">{item.description}</span>}
              />
              <p className="card-price">{item.price}</p>
              <Button type="primary" block className="card-button">
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Trangchu;
