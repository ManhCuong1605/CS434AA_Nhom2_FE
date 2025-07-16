import axios from 'axios';
const API_URL = 'http://localhost:5000/api/bai-viet';

const quanLyBaiVietApi = {
    getTatCa: async (token) => axios.get(`${API_URL}`, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    getChoDuyet: async (token) => axios.get(`${API_URL}/admin/cho-duyet`, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    getById: async (id, token) => axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    duyet: async (id, token) => axios.patch(`${API_URL}/admin/${id}/duyet`, {}, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    tuChoi: async (id, token) => axios.patch(`${API_URL}/admin/${id}/tu-choi`, {}, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    taoBaiViet: async (data, token) => {
        // data: FormData chứa các trường tieuDe, noiDung, gia, diaChi, images (file[])
        return axios.post(`${API_URL}`, data, {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": "multipart/form-data",
            },
        });
    },
    capNhatBaiViet: async (id, data, token) => {
        // data: FormData chứa các trường cần cập nhật (tieuDe, noiDung, gia, diaChi, images)
        return axios.put(`${API_URL}/admin/${id}`, data, {
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": "multipart/form-data",
            },
        });
    }
}
export default quanLyBaiVietApi;