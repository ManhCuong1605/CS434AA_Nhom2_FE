import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function FormDangBai() {
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [gia, setGia] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tieuDe || !noiDung || !gia || !diaChi) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("tieuDe", tieuDe);
    formData.append("noiDung", noiDung);
    formData.append("gia", gia);
    formData.append("diaChi", diaChi);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("/api/bai-viet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Đăng bài thành công!");
      setTieuDe("");
      setNoiDung("");
      setGia("");
      setDiaChi("");
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đăng bài!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Đăng bài mới</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="tieuDe" className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            id="tieuDe"
            value={tieuDe}
            onChange={(e) => setTieuDe(e.target.value)}
            required
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="noiDung" className="form-label">Nội dung</label>
          <textarea
            className="form-control"
            id="noiDung"
            rows="5"
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            required
            placeholder="Nhập nội dung chi tiết"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gia" className="form-label">Giá</label>
          <input
            type="number"
            className="form-control"
            id="gia"
            value={gia}
            onChange={(e) => setGia(e.target.value)}
            required
            placeholder="Nhập giá"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="diaChi" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            id="diaChi"
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            required
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Đăng bài
        </button>
      </form>
    </div>
  );
}

export default FormDangBai;
