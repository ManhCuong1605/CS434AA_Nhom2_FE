import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import banner1 from "../../assets/slide/banner1.jpg";
import TimKiem from "../../components/TimKiem";
import { fetchNhaDatListUser } from "../../services/fetchData";
import PhanTrang from "../../components/PhanTrang";
import { addFavorite, removeFavorite, getFavorites } from "../../api/DanhMucYeuThichApi";
import { toast, ToastContainer } from "react-toastify";

function Batdongsan() {
  const [yeuThich, setYeuThich] = useState([]);
  const [nhaDatList, setNhaDatList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popupList, setPopupList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      const list = response.data || [];

      // Không cần ánh xạ lại từ diaChiApi vì đã lưu tên
      const mappedList = list.map((item) => ({
        ...item,
      }));

      setOriginalList(mappedList);
      setNhaDatList(mappedList);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy danh sách BĐS:", error);
      setNhaDatList([]);
    }
  };

  const applyFilters = (filters) => {
    let filteredList = [...originalList];
    const priceFilters = [
      "Dưới 500 triệu",
      "500 - 800 triệu",
      "800 triệu - 1 tỷ",
      "1 - 2 tỷ",
      "2 - 3 tỷ",
      "3 - 5 tỷ",
      "5 - 7 tỷ",
      "7 - 10 tỷ",
      "10 - 20 tỷ",
      "20 - 30 tỷ",
      "30 - 40 tỷ",
      "40 - 60 tỷ",
      "Trên 60 tỷ",
    ];
    const areaFilters = [
      "Dưới 30 m²",
      "30 - 50 m²",
      "50 - 80 m²",
      "80 - 100 m²",
      "100 - 150 m²",
      "150 - 200 m²",
      "200 - 250 m²",
      "Trên 250 m²",
    ];

    // Get the active price and area filters
    const activePriceFilter = filters.find((f) => priceFilters.includes(f));
    const activeAreaFilter = filters.find((f) => areaFilters.includes(f));

    // Apply price filter first if it exists
    if (activePriceFilter) {
      switch (activePriceFilter) {
        case "Dưới 500 triệu":
          filteredList = filteredList.filter((x) => x.GiaBan <= 500_000_000);
          break;
        case "500 - 800 triệu":
          filteredList = filteredList.filter((x) => x.GiaBan >= 500_000_000 && x.GiaBan <= 800_000_000);
          break;
        case "800 triệu - 1 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 800_000_000 && x.GiaBan <= 1_000_000_000);
          break;
        case "1 - 2 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 1_000_000_000 && x.GiaBan <= 2_000_000_000);
          break;
        case "2 - 3 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 2_000_000_000 && x.GiaBan <= 3_000_000_000);
          break;
        case "3 - 5 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 3_000_000_000 && x.GiaBan <= 5_000_000_000);
          break;
        case "5 - 7 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 5_000_000_000 && x.GiaBan <= 7_000_000_000);
          break;
        case "7 - 10 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 7_000_000_000 && x.GiaBan <= 10_000_000_000);
          break;
        case "10 - 20 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 10_000_000_000 && x.GiaBan <= 20_000_000_000);
          break;
        case "20 - 30 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 20_000_000_000 && x.GiaBan <= 30_000_000_000);
          break;
        case "30 - 40 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 30_000_000_000 && x.GiaBan <= 40_000_000_000);
          break;
        case "40 - 60 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan >= 40_000_000_000 && x.GiaBan <= 60_000_000_000);
          break;
        case "Trên 60 tỷ":
          filteredList = filteredList.filter((x) => x.GiaBan > 60_000_000_000);
          break;
      }
    }

    // Apply area filter next if it exists, intersecting with the price-filtered list
    if (activeAreaFilter) {
      switch (activeAreaFilter) {
        case "Dưới 30 m²":
          filteredList = filteredList.filter((x) => x.DienTich <= 30);
          break;
        case "30 - 50 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 30 && x.DienTich <= 50);
          break;
        case "50 - 80 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 50 && x.DienTich <= 80);
          break;
        case "80 - 100 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 80 && x.DienTich <= 100);
          break;
        case "100 - 150 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 100 && x.DienTich <= 150);
          break;
        case "150 - 200 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 150 && x.DienTich <= 200);
          break;
        case "200 - 250 m²":
          filteredList = filteredList.filter((x) => x.DienTich >= 200 && x.DienTich <= 250);
          break;
        case "Trên 250 m²":
          filteredList = filteredList.filter((x) => x.DienTich > 250);
          break;
      }
    }

    setNhaDatList(filteredList);
  };

  const addFilter = (label) => {
    if (!appliedFilters.includes(label)) {
      const newFilters = [...appliedFilters, label];
      setAppliedFilters(newFilters);
      applyFilters(newFilters);
    }
  };

  const handleFilterByPrice = (priceLabel) => {
    const priceFilters = [
      "Dưới 500 triệu",
      "500 - 800 triệu",
      "800 triệu - 1 tỷ",
      "1 - 2 tỷ",
      "2 - 3 tỷ",
      "3 - 5 tỷ",
      "5 - 7 tỷ",
      "7 - 10 tỷ",
      "10 - 20 tỷ",
      "20 - 30 tỷ",
      "30 - 40 tỷ",
      "40 - 60 tỷ",
      "Trên 60 tỷ",
    ];
    const updatedFilters = appliedFilters.filter((f) => !priceFilters.includes(f));

    const newAppliedFilters = [...updatedFilters, priceLabel];
    setAppliedFilters(newAppliedFilters);
    applyFilters(newAppliedFilters);
  };

  const handleFilterByArea = (areaLabel) => {
    const areaFilters = [
      "Dưới 30 m²",
      "30 - 50 m²",
      "50 - 80 m²",
      "80 - 100 m²",
      "100 - 150 m²",
      "150 - 200 m²",
      "200 - 250 m²",
      "Trên 250 m²",
    ];
    const updatedFilters = appliedFilters.filter((f) => !areaFilters.includes(f));

    const newAppliedFilters = [...updatedFilters, areaLabel];
    setAppliedFilters(newAppliedFilters);
    applyFilters(newAppliedFilters);
  };

  const handleSort = (sortType) => {
    let sortedList = [...nhaDatList];

    switch (sortType) {
      case "verified":
        sortedList.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));
        break;
      case "priceAsc":
        sortedList.sort((a, b) => (a.GiaBan || 0) - (b.GiaBan || 0));
        break;
      case "priceDesc":
        sortedList.sort((a, b) => (b.GiaBan || 0) - (a.GiaBan || 0));
        break;
      case "sqmAsc":
        sortedList.sort(
          (a, b) =>
            (a.GiaBan && a.DienTich ? a.GiaBan / a.DienTich : Infinity) -
            (b.GiaBan && b.DienTich ? b.GiaBan / b.DienTich : Infinity)
        );
        break;
      case "sqmDesc":
        sortedList.sort(
          (a, b) =>
            (b.GiaBan && b.DienTich ? b.GiaBan / b.DienTich : 0) -
            (a.GiaBan && a.DienTich ? a.GiaBan / a.DienTich : 0)
        );
        break;
      case "areaAsc":
        sortedList.sort((a, b) => (a.DienTich || 0) - (b.DienTich || 0));
        break;
      case "areaDesc":
        sortedList.sort((a, b) => (b.DienTich || 0) - (a.DienTich || 0));
        break;
      default:
        sortedList = [...originalList];
        break;
    }

    setNhaDatList(sortedList);
  };

  const toggleYeuThich = async (item) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
      return;
    }
    try {
      if (yeuThich.includes(item.id)) {
        await removeFavorite(item.id);
        setYeuThich((prev) => prev.filter((id) => id !== item.id));
        setPopupList((prev) => prev.filter((p) => p.id !== item.id));
        toast.info("Đã xóa khỏi danh sách yêu thích!");
      } else {
        await addFavorite(item.id);
        setYeuThich((prev) => [...prev, item.id]);

        const newPopupItem = {
          id: item.id,
          title: item.TenNhaDat,
          img: item.hinhAnh?.[0]?.url || banner1,
          time: "Vừa lưu xong",
        };
        setPopupList((prev) => [newPopupItem, ...prev.slice(0, 2)]);

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        toast.success("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi toggle yêu thích:", error);
    }
  };

  const handleSearch = (filter) => {
    const value = Object.values(filter)[0];
    if (!appliedFilters.includes(value)) {
      addFilter(value);
    }
  };

  const removeFilter = (label) => {
    const newFilters = appliedFilters.filter((f) => f !== label);
    setAppliedFilters(newFilters);

    if (newFilters.length === 0) {
      setNhaDatList(originalList);
    } else {
      applyFilters(newFilters);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <TimKiem onSearch={handleSearch} />

      {showPopup && (
        <div
          style={{
            marginTop: "100px",
            position: "fixed",
            top: "70px",
            right: "20px",
            width: "320px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflow: "hidden",
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
                borderBottom: "1px solid #f0f0f0",
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
                  marginRight: "10px",
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
                    textOverflow: "ellipsis",
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
              cursor: "pointer",
            }}
            onClick={() => navigate("/danh-muc-yeu-thich")}
          >
            Xem tất cả →
          </div>
        </div>
      )}

      <div className="container mt-4">
        <h2 className="text-center fw-bold fs-4">Danh sách bất động sản</h2>

        <div className="row mt-3">
          <div className="col-lg-9 d-flex flex-column align-items-center">
            <div style={{ maxWidth: "850px", width: "100%" }}>
              <div className="d-flex justify-content-end mb-3 pb-2 border-bottom">
                <select className="form-select w-auto" onChange={(e) => handleSort(e.target.value)}>
                  <option value="">Mặc định</option>
                  <option value="verified">Tin xác thực xếp trước</option>
                  <option value="priceAsc">Giá thấp đến cao</option>
                  <option value="priceDesc">Giá cao đến thấp</option>
                  <option value="sqmAsc">Giá/m² thấp đến cao</option>
                  <option value="sqmDesc">Giá/m² cao đến thấp</option>
                  <option value="areaAsc">Diện tích nhỏ đến lớn</option>
                  <option value="areaDesc">Diện tích lớn đến nhỏ</option>
                </select>
              </div>
            </div>

            {nhaDatList.length === 0 ? (
              <div className="text-center my-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                  alt="No Data"
                  style={{ width: "120px", opacity: 0.6 }}
                />
                <h5 className="mt-3 fw-bold text-muted">Không có kết quả nào phù hợp</h5>
                <p className="text-secondary">Gợi ý: hãy thử nới lỏng bớt tiêu chí tìm kiếm</p>
                {appliedFilters.length > 0 && (
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    {appliedFilters.map((filter, idx) => (
                      <span
                        key={idx}
                        className="badge bg-light text-dark border d-flex align-items-center"
                        style={{ fontSize: "14px" }}
                      >
                        {filter}
                        <button
                          className="btn-close ms-2"
                          style={{ fontSize: "10px" }}
                          onClick={() => removeFilter(filter)}
                        ></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              nhaDatList.map((item) => (
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
                        {item.GiaBan?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <p className="text-muted small mb-1 fs-6">
                        {item.DienTich} m² • {item.Huong}
                      </p>
                      <p className="small fs-6">
                        {item.SoNha ? `${item.SoNha}, ` : ""}
                        {item.Duong ? `${item.Duong}, ` : ""}
                        {item.Phuong ? `Phường ${item.Phuong}, ` : ""}
                        {item.Quan ? `Quận ${item.Quan}, ` : ""}
                        {item.ThanhPho ? item.ThanhPho : ""}
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
              ))
            )}

            <PhanTrang
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          <div className="col-lg-3">
            <div className="border rounded p-3 mb-3">
              <h6 className="fw-bold mb-2">Lọc theo khoảng giá</h6>
              {[
                "Dưới 500 triệu",
                "500 - 800 triệu",
                "800 triệu - 1 tỷ",
                "1 - 2 tỷ",
                "2 - 3 tỷ",
                "3 - 5 tỷ",
                "5 - 7 tỷ",
                "7 - 10 tỷ",
                "10 - 20 tỷ",
                "20 - 30 tỷ",
                "30 - 40 tỷ",
                "40 - 60 tỷ",
                "Trên 60 tỷ",
              ].map((price, idx) => (
                <div
                  key={idx}
                  className="text-primary small mb-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFilterByPrice(price)}
                >
                  {price}
                </div>
              ))}
            </div>

            <div className="border rounded p-3">
              <h6 className="fw-bold mb-2">Lọc theo diện tích</h6>
              {[
                "Dưới 30 m²",
                "30 - 50 m²",
                "50 - 80 m²",
                "80 - 100 m²",
                "100 - 150 m²",
                "150 - 200 m²",
                "200 - 250 m²",
                "Trên 250 m²",
              ].map((area, idx) => (
                <div
                  key={idx}
                  className="text-primary small mb-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFilterByArea(area)}
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Batdongsan;