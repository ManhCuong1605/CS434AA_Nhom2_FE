import axios from "axios";

const API_URL = "http://localhost:5000/api/lichHen";
const token = localStorage.getItem("token");
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
};

const datLichHenApi = {
    datLichHen: async (nhaDatId, NgayHen) => {
        return axios.post(
            `${API_URL}/dat-lich`,
            { nhaDatId, NgayHen },
            config
        );
    },

    // Duyệt lịch (dành cho ADMIN/NHANVIEN)
    duyetLichHen: async (id, nhanVienId) => {
        return axios.put(
            `${API_URL}/duyet-lich/${id}`,
            { nhanVienId },
            config
        );
    },

    // Hủy lịch
    huyLichHen: async (id) => {
        return axios.put(`${API_URL}/huy-lich/${id}`, {}, config);
    },

    // Lấy lịch của nhân viên
    getLichHenNhanVien: async (nhanVienId) => {
        return axios.get(`${API_URL}/nhanvien/${nhanVienId}`, config);
    },

    // Lấy tất cả lịch (ADMIN)
    getAll: async () => {
        return axios.get(`${API_URL}/`, config);
    },
};
export default datLichHenApi;