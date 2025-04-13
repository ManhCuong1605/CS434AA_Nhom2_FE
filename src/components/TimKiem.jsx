import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchLoaiNhaDatList } from "../services/fetchData";
function TimKiem({ onSearch }) {
    const [filters, setFilters] = useState({
        TenNhaDat: "",
        TenLoaiDat: "",
        ThanhPho: "",
        Quan: "",
        Phuong: "",
        Duong: "",
        GiaMin: "",
        GiaMax: "",
        DienTichMin: "",
        DienTichMax: "",
        searchText: ""
    });

    const thanhPhoVN = [
        "Hà Nội",
        "Hồ Chí Minh",
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "An Giang",
        "Bà Rịa - Vũng Tàu",
        "Bắc Giang",
        "Bắc Kạn",
        "Bạc Liêu",
        "Bắc Ninh",
        "Bến Tre",
        "Bình Định",
        "Bình Dương",
        "Bình Phước",
        "Bình Thuận",
        "Cà Mau",
        "Cao Bằng",
        "Đắk Lắk",
        "Đắk Nông",
        "Điện Biên",
        "Đồng Nai",
        "Đồng Tháp",
        "Gia Lai",
        "Hà Giang",
        "Hà Nam",
        "Hà Tĩnh",
        "Hải Dương",
        "Hậu Giang",
        "Hòa Bình",
        "Hưng Yên",
        "Khánh Hòa",
        "Kiên Giang",
        "Kon Tum",
        "Lai Châu",
        "Lâm Đồng",
        "Lạng Sơn",
        "Lào Cai",
        "Long An",
        "Nam Định",
        "Nghệ An",
        "Ninh Bình",
        "Ninh Thuận",
        "Phú Thọ",
        "Phú Yên",
        "Quảng Bình",
        "Quảng Nam",
        "Quảng Ngãi",
        "Quảng Ninh",
        "Quảng Trị",
        "Sóc Trăng",
        "Sơn La",
        "Tây Ninh",
        "Thái Bình",
        "Thái Nguyên",
        "Thanh Hóa",
        "Thừa Thiên Huế",
        "Tiền Giang",
        "Trà Vinh",
        "Tuyên Quang",
        "Vĩnh Long",
        "Vĩnh Phúc",
        "Yên Bái"
    ];
    const [loaiDatList, setLoaiDatList] = useState([]);
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [loaiDat] = await Promise.all([fetchLoaiNhaDatList()]);
            setLoaiDatList(loaiDat);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "GiaBan" && value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            setFilters((prev) => ({
                ...prev,
                GiaMin: min,
                GiaMax: max,
            }));
        } else if (name === "DienTich" && value.includes("-")) {
            const [min, max] = value.split("-").map(Number);
            setFilters((prev) => ({
                ...prev,
                DienTichMin: min,
                DienTichMax: max,
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleSearchInputChange = (e) => {
        const { value } = e.target;
        setFilters((prev) => ({
            ...prev,
            searchText: value
        }));
    };


    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm nhà đất"
                            name="searchText"
                            value={filters.searchText}
                            onChange={handleSearchInputChange}
                        />
                        <button className="btn btn-danger" type="button" onClick={() => onSearch(filters)}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="col-md-8 mx-auto">
                    <div className="d-flex gap-2">
                        <select className="form-select" name="ThanhPho" onChange={handleChange}>
                            <option value="">-- Chọn Thành Phố --</option>
                            {thanhPhoVN.map((tp, idx) => (
                                <option key={idx} value={tp}>{tp}</option>
                            ))}
                        </select>

                        <select className="form-select" name="TenLoaiDat" onChange={handleChange}>
                            <option value="">-- Chọn Loại Đất --</option>
                            {loaiDatList.map(loai => (
                                <option key={loai.id} value={loai.TenLoaiDat}>
                                    {loai.TenLoaiDat}
                                </option>
                            ))}
                        </select>



                        <select className="form-select" name="GiaBan" onChange={handleChange}>
                            <option value="">-- Chọn khoảng giá --</option>
                            <option value="0-1000000000">Dưới 1 tỷ</option>
                            <option value="1000000000-2000000000">1 tỷ - 2 tỷ</option>
                            <option value="2000000000-3000000000">2 tỷ - 3 tỷ</option>
                            <option value="3000000000-5000000000">3 tỷ - 5 tỷ</option>
                            <option value="5000000000-99999999999999">Trên 5 tỷ</option>
                        </select>
                        <select className="form-select" name="DienTich" onChange={handleChange}>
                            <option value="">-- Chọn diện tích --</option>
                            <option value="0-50">Dưới 50m²</option>
                            <option value="50-100">50 - 100m²</option>
                            <option value="100-200">100 - 200m²</option>
                            <option value="200-99999">Trên 200m²</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimKiem;
