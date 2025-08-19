import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // thêm useNavigate
import { FaHeart } from "react-icons/fa";
import banner1 from "../../assets/slide/banner1.jpg";
import TimKiem from "../../components/TimKiem";
import { fetchNhaDatListUser } from "../../services/fetchData";
import nhaDatApi from "../../api/NhaDatApi";
import PhanTrang from "../../components/PhanTrang";
import { addFavorite, removeFavorite, getFavorites } from "../../api/DanhMucYeuThichApi";

function Batdongsan() {
  const [yeuThich, setYeuThich] = useState([]);
  const [nhaDatList, setNhaDatList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popupList, setPopupList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate(); // khởi tạo navigate

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!token) {
      setYeuThich([]);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const list = await getFavorites();
        const favoriteIds = list.map((item) => item.id);
        setYeuThich(favoriteIds);
      } catch (error) {
        console.error("Không thể lấy danh sách yêu thích", error);
      }
    };
    fetchFavorites();
  }, [token]);

  const loadData = async (page = 1) => {
    try {
      const response = await fetchNhaDatListUser(page, 8);
      setNhaDatList(response.data || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách BĐS:", error);
    }
  };

  const toggleYeuThich = async (item) => {
    if (!token) {
      alert("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
      return;
    }
    try {
      if (yeuThich.includes(item.id)) {
        await removeFavorite(item.id);
        setYeuThich((prev) => prev.filter((id) => id !== item.id));
        setPopupList((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        await addFavorite(item.id);
        setYeuThich((prev) => [...prev, item.id]);

        const newPopupItem = {
          id: item.id,
          title: item.TenNhaDat,
          img: item.hinhAnh?.[0]?.url || banner1,
          time: "Vừa lưu xong"
        };
        setPopupList((prev) => [newPopupItem, ...prev.slice(0, 2)]);

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
      }
    } catch (error) {
      console.error("Lỗi toggle yêu thích:", error);
    }
  };

  const handleSearch = async (filters) => {
    try {
      const res = await nhaDatApi.search(filters);
      setNhaDatList(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  return (
    <div>
      <TimKiem onSearch={handleSearch} />

      {/* POPUP thông báo */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            right: "20px",
            width: "320px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
            Tin đăng đã lưu
          </div>
          {popupList.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 15px",
                borderBottom: "1px solid #f0f0f0"
              }}
            >
              <img
                src={p.img}
                alt={p.title}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "10px"
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {p.title}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>{p.time}</div>
              </div>
            </div>
          ))}
          <div
            style={{
              padding: "8px 15px",
              textAlign: "center",
              color: "red",
              fontSize: "14px",
              cursor: "pointer"
            }}
            onClick={() => navigate("/danh-muc-yeu-thich")} // điều hướng khi bấm
          >
            Xem tất cả →
          </div>
        </div>
      )}

      <div className="container mt-4">
        <h2 className="text-center fw-bold fs-4">Danh sách bất động sản</h2>
        <div className="row mt-3">
          {nhaDatList.map((item) => (
            <div key={item.id} className="col-12 d-flex justify-content-center mb-4">
              <div
                className="card shadow-sm border-0 position-relative"
                style={{ maxWidth: "850px", width: "100%", minHeight: "550px" }}
              >
                <Link to={`/bat-dong-san/${item.id}`} className="text-decoration-none">
                  <img
                    src={item.hinhAnh?.[0]?.url || banner1}
                    className="card-img-top rounded-top"
                    alt={item.TenNhaDat}
                    style={{ height: "350px", objectFit: "cover" }}
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/bat-dong-san/${item.id}`} className="text-decoration-none">
                    <h4 className="fw-bold mt-2 fs-5 text-dark">{item.TenNhaDat}</h4>
                  </Link>
                  <p className="text-danger fw-bold mb-1 fs-6">
                    {item.GiaBan?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </p>
                  <p className="text-muted small mb-1 fs-6">
                    {item.DienTich} m² • {item.Huong}
                  </p>
                  <p className="text-primary small fs-6">
                    {item.SoNha}, {item.Duong}, {item.Phuong}, {item.Quan}, {item.ThanhPho}
                  </p>
                  <div className="mt-2 d-flex justify-content-end align-items-center">
                    <div
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: yeuThich.includes(item.id) ? "red" : "gray",
                      }}
                      onClick={() => toggleYeuThich(item)}
                    >
                      <FaHeart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <PhanTrang
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default Batdongsan;
