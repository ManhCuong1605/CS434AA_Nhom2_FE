import nhaDatApi from '../api/NhaDatApi';
import loaiNhaDatApi from '../api/LoaiNhaDatApi';

export const fetchNhaDatList = async (page = 1, limit = 5) => {
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