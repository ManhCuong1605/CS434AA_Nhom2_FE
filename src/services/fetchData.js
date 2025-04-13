import nhaDatApi from '../api/NhaDatApi';
import loaiNhaDatApi from '../api/LoaiNhaDatApi';

export const fetchNhaDatList = async () => {
    try {
        const response = await nhaDatApi.getAll();
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhà đất:", error);
        return [];
    }
};
export const fetchLoaiNhaDatList = async () => {
    try {
        const response = await loaiNhaDatApi.getAll();
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải loại đất:", error);
        return [];
    }
}