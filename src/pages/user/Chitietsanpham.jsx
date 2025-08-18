import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/Chitietsanpham.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";
import { useChat } from "../../context/ChatContext"; 
import nhaDatApi from "../../api/NhaDatApi";


const ChiTietSanPham = () => {
    const { id } = useParams();
    const { setIsChatOpen } = useChat();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const res = await nhaDatApi.getById(id); // gọi API BE
          const data = res.data;
  
          const mappedData = {
            id: data.id,
            title: data.TenNhaDat,
            price: `${Number(data.GiaBan).toLocaleString()} VND`,
            area: `${data.DienTich} m²`,
           
            location: `${data.SoNha} ${data.Duong} ${data.Phuong} ${data.Quan} ${data.ThanhPho}`,
            huong: data.Huong,
            type: data.LoaiNhaDat?.TenLoaiDat || "Không rõ",
            images: data.hinhAnh?.map((img) => img.url) || [],
            contact: "0969 524 111", // sau này bạn lấy từ user
            agent: "Nguyễn Bình Gold", // sau này bạn lấy từ user
            description: data.MoTa,
          };
  
          setProduct(mappedData);
          setSelectedImage(mappedData.images[0] || "");
        } catch (error) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        }
      };
  
      fetchProduct();
    }, [id]);
  
    if (!product) {
      return <div className="product-container">Đang tải chi tiết sản phẩm...</div>;
    }
  
    return (
      <div className="product-container">
        <div className="product-top">
          {/* BÊN TRÁI - HÌNH ẢNH */}
          <div className="product-left">
            <div className="main-image-wrapper">
              <img src={selectedImage} alt="Ảnh chính" className="main-image" />
            </div>
  
            <div className="thumbnail-list">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Ảnh ${index + 1}`}
                  className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
  
          {/*  THÔNG TIN CHI TIẾT*/}
          <div className="product-right">
            <h2 className="product-title">{product.title}</h2>
            <p><strong>Loại bất động sản:</strong> {product.type}</p>
            <p><strong>Địa chỉ:</strong> {product.location}</p>
            <p><strong>Giá tiền:</strong> {product.price}</p>
            <p><strong>Diện tích:</strong> {product.area}</p>
            <p><strong>Hướng:</strong> {product.huong}</p>
  
            <div className="contact-box">
              <p><strong>Môi giới:</strong> {product.agent}</p>
              <p className="contact-number">☎ {product.contact}</p>
  
              <button className="contact-button" onClick={() => setIsChatOpen(true)}>
                Liên hệ ngay
              </button>
            </div>
          </div>
        </div>
  
        {/* PHẦN MÔ TẢ NẰM DƯỚI */}
        <div className="product-description">
          <h3>Mô tả chi tiết</h3>
          <MoTaChiTiet description={product.description} />
        </div>
      </div>
    );
  };
  
  export default ChiTietSanPham;