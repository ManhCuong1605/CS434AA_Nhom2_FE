import nhaDatApi from '../api/NhaDatApi';
import loaiNhaDatApi from '../api/LoaiNhaDatApi';

export const fetchNhaDatList = async (page = 1, limit = 5, filters = {}) => {
    try {
        let response;
        const { searchText, ThanhPho, TenLoaiDat, GiaMin, GiaMax, DienTichMin, DienTichMax } = filters;

        // If any filter is provided, call the search API
        if (searchText || ThanhPho || TenLoaiDat || GiaMin || GiaMax || DienTichMin || DienTichMax) {
            response = await nhaDatApi.search({
                page,
                limit,
                searchText,
                ThanhPho,
                TenLoaiDat,
                GiaMin,
                GiaMax,
                DienTichMin,
                DienTichMax,
            });
        } else {
            response = await nhaDatApi.getAll({ page, limit });
        }

        // Ensure consistent response structure
        return {
            data: response.data.data || [],
            currentPage: response.data.currentPage || page,
            totalPages: response.data.totalPages || 1,
            totalItems: response.data.totalItems || 0,
        };
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhà đất:", error);
        return {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
        };
    }
};
export const fetchNhaDatListUser = async (page = 1, limit = 8) => {
    try {
        const response = await nhaDatApi.getAll({ page, limit });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhà đất:", error);
        return {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        };
    }
};
export const fetchLoaiNhaDatList = async () => {
    try {
        const response = await loaiNhaDatApi.getAll();
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải loại đất:", error);
        return {
            data: [],
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        };
    }
}