import axios from "axios";

const API_URL = "http://localhost:5000/api/lichHen";

// Hàm tạo config động để luôn lấy token mới nhất
const getConfig = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const datLichHenApi = {
    // Đặt lịch hẹn
    datLichHen: async (nhaDatId, NgayHen) => {
        return axios.post(
            `${API_URL}/dat-lich`,
            { nhaDatId, NgayHen },
            getConfig()
        );
    },

    // Duyệt lịch (ADMIN/NHANVIEN)
    duyetLichHen: async (id, nhanVienId) => {
        return axios.put(
            `${API_URL}/duyet-lich/${id}`,
            { nhanVienId },
            getConfig()
        );
    },



    // Lấy tất cả lịch (ADMIN)
    getAll: async () => {
        return axios.get(`${API_URL}/`, getConfig());
    },
};

export default datLichHenApi;
