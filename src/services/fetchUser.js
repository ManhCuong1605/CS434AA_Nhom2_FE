import nguoiDungApi from "../api/NguoiDungApi";
export const fetchUser = async () => {
    try {
        const response = await nguoiDungApi.getAll();
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhà đất:", error);
        return [];
    }
};