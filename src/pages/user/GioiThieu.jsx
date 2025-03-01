import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";


const GioiThieu = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero text-center text-white position-relative">
        <img
          src="https://static.wixstatic.com/media/5bf088_a013bde0a2c2478d871826fdcf115bb6~mv2.jpg/v1/fill/w_640,h_594,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5bf088_a013bde0a2c2478d871826fdcf115bb6~mv2.jpg"
          alt="Background image of buildings"
          className="img-fluid w-100"
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          <h1>Bất Động Sản.com</h1>
          <p className="fs-4">WEBSITE Hàng Đầu</p>
          <p className="fs-5">Luôn Sẵn Sàng Bên Bạn</p>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-5">
        <Container>
          <div className="border p-4 rounded" style={{ borderColor: "red",borderWidth: "3px", borderStyle: "solid" }}>
            <h2 className="text-center mb-4">Về Chúng Tôi</h2>
            <p className="text-center">
              Công ty Bất động sản là đơn vị uy tín trong lĩnh vực đầu tư, phát triển và phân phối bất động sản.
              Với sứ mệnh mang đến những giải pháp an cư và đầu tư hiệu quả, chúng tôi không ngừng đổi mới cam kết
              cung cấp các sản phẩm chất lượng, pháp lý minh bạch và dịch vụ chuyên nghiệp.
            </p>
            <Row className="mt-4">
              <Col md={6} className="border-end">
                <h3 className="text-center">
                  <i className="fas fa-bullseye"></i> Sứ Mệnh
                </h3>
                <p>
                  Công ty Bất động sản cam kết mang đến những giải pháp an cư và đầu tư tối ưu, cung cấp các sản phẩm
                  bất động sản chất lượng cao với pháp lý minh bạch, dịch vụ chuyên nghiệp. Chúng tôi không ngừng đổi mới
                  để kiến tạo những không gian sống hiện đại, bền vững, góp phần nâng cao chất lượng cuộc sống và gia tăng
                  giá trị cho khách hàng, đối tác.
                </p>
              </Col>
              <Col md={6}>
                <h3 className="text-center">
                  <i className="fas fa-eye"></i> Tầm Nhìn
                </h3>
                <p>
                  Trở thành đơn vị tiên phong và đáng tin cậy trong lĩnh vực bất động sản, chúng tôi hướng đến việc xây dựng
                  hệ sinh thái bất động sản toàn diện, phát triển những dự án mang tính biểu tượng, góp phần thay đổi diện
                  mạo đô thị. Với chiến lược phát triển bền vững, chúng tôi không chỉ mở rộng quy mô hoạt động mà còn tạo ra
                  những giá trị thực sự cho cộng đồng và xã hội.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default GioiThieu;
