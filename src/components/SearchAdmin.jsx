import React from "react";

function SearchAdmin({ filters, handleSearchInputChange, onSearch, provinces, loaiDatList }) {

    return (
        <div className="search-admin mb-3">
            <div className="row g-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm (Tên, Mô tả, Địa chỉ)"
                        name="searchText"
                        value={filters.searchText || ""}
                        onChange={handleSearchInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSearch();
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        name="ThanhPho"
                        value={filters.ThanhPho || ""}
                        onChange={handleSearchInputChange}
                    >
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {provinces.map((province) => {
                            const normalizedName = province.Name.replace(/Thành phố |Tỉnh /, "");
                            return (
                                <option
                                    key={province.code || province.Id}
                                    value={normalizedName}
                                >
                                    {province.Name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        name="TenLoaiDat"
                        value={filters.TenLoaiDat || ""}
                        onChange={handleSearchInputChange}
                    >
                        <option value="">-- Chọn loại nhà đất --</option>
                        {loaiDatList.map((loai) => (
                            <option key={loai.id} value={loai.TenLoaiDat}>
                                {loai.TenLoaiDat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Giá tối thiểu (VNĐ)"
                        name="GiaMin"
                        value={filters.GiaMin || ""}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Giá tối đa (VNĐ)"
                        name="GiaMax"
                        value={filters.GiaMax || ""}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Diện tích tối thiểu (m²)"
                        name="DienTichMin"
                        value={filters.DienTichMin || ""}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Diện tích tối đa (m²)"
                        name="DienTichMax"
                        value={filters.DienTichMax || ""}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="col-md-12 text-end">
                    <button
                        className="btn btn-danger me-2"
                        type="button"
                        onClick={onSearch}
                    >
                        Tìm kiếm
                    </button>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => onSearch({ searchText: "", ThanhPho: "", TenLoaiDat: "", GiaMin: "", GiaMax: "", DienTichMin: "", DienTichMax: "" })}
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchAdmin;