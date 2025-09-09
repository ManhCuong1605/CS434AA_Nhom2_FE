import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/slide/banner1.jpg";
import { getFavorites, removeFavorite } from "../../api/DanhMucYeuThichApi";

function DanhMucYeuThich() {
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;
    fetchFavorites();
  }, [token]);

  const fetchFavorites = async () => {
    try {
      const list = await getFavorites();
      setFavorites(list);
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu thích:", error);
      setFavorites([]);
    }
  };

  const sortFavorites = (data) => {
    let sorted = [...data];
    switch (sortOption) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceAsc":
        sorted.sort((a, b) => a.GiaBan - b.GiaBan);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.GiaBan - a.GiaBan);
        break;
      case "areaAsc":
        sorted.sort((a, b) => a.DienTich - b.DienTich);
        break;
      case "areaDesc":
        sorted.sort((a, b) => b.DienTich - a.DienTich);
        break;
      default:
        break;
    }
    return sorted;
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;
    try {
      for (let id of selected) {
        await removeFavorite(id);
      }
      setFavorites((prev) => prev.filter((item) => !selected.includes(item.id)));
      setSelected([]);
    } catch (error) {
      console.error("Lỗi xóa yêu thích:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold fs-4 mb-4">Danh mục yêu thích</h2>

      {/* Thanh công cụ */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-danger btn-sm"
          onClick={removeSelected}
          disabled={selected.length === 0}
        >
          Xóa đã chọn ({selected.length})
        </button>

        {/* Dropdown sắp xếp ở góc phải */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="form-select form-select-sm"
          style={{ width: "200px" }}
        >
          <option value="newest">Lưu mới nhất</option>
          <option value="priceAsc">Giá thấp đến cao</option>
          <option value="priceDesc">Giá cao đến thấp</option>
          <option value="areaAsc">Diện tích bé đến lớn</option>
          <option value="areaDesc">Diện tích lớn đến bé</option>
        </select>
      </div>

      {/* Danh sách */}
      <div className="list-group">
        {favorites.length === 0 && (
          <p className="text-center">Chưa có bất động sản yêu thích</p>
        )}
        {sortFavorites(favorites).map((item) => (
          <div
            key={item.id}
            className="list-group-item d-flex align-items-center"
            style={{
              padding: "20px",
              minHeight: "140px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              className="form-check-input me-3"
              checked={selected.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
              style={{ transform: "scale(1.2)" }}
            />

            {/* Ảnh */}
            <Link to={`/bat-dong-san/${item.id}`}>
              <img
                src={item.hinhAnh?.[0]?.url || banner1}
                alt={item.TenNhaDat}
                style={{
                  width: "180px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
                className="me-3"
              />
            </Link>

            {/* Thông tin */}
            <div style={{ flex: 1 }}>
              <Link
                to={`/bat-dong-san/${item.id}`}
                className="text-decoration-none text-dark"
              >
                <h5 className="fw-bold mb-1">{item.TenNhaDat}</h5>
              </Link>
              <p className="text-danger fw-bold mb-1">
                {item.GiaBan?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p className="text-muted small mb-1">
                {item.DienTich} m² • {item.Huong}
              </p>
              <p className="text-primary small mb-0">
                {item.SoNha}, {item.Duong}, {item.Phuong}, {item.Quan},{" "}
                {item.ThanhPho}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DanhMucYeuThich;
