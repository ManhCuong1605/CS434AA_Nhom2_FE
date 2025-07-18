import axios from 'axios';
const API_URL = 'http://localhost:5000/api/bai-viet';

const quanLyBaiVietApi = {
    getTatCa: async (token) => axios.get(`${API_URL}`, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    getChoDuyet: async (token) => axios.get(`${API_URL}/admin/cho-duyet`, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    
    // Thêm method lấy bài viết đã duyệt (trạng thái = 1)
    layBaiVietDaDuyet: async (params = {}) => {
        // params có thể chứa: page, limit, search, filter
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.thanhPho) queryParams.append('thanhPho', params.thanhPho);
        if (params.loaiDat) queryParams.append('loaiDat', params.loaiDat);
        if (params.khoangGia) queryParams.append('khoangGia', params.khoangGia);
        if (params.dienTich) queryParams.append('dienTich', params.dienTich);
        
        return axios.get(`${API_URL}/da-duyet?${queryParams.toString()}`);
    },
    getById: async (id, token) => {
        const headers = token ? { Authorization: 'Bearer ' + token } : {};
        return axios.get(`${API_URL}/${id}`, { headers });
    },
    duyet: async (id, token) => axios.patch(`${API_URL}/admin/${id}/duyet`, {}, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    tuChoi: async (id, token) => axios.patch(`${API_URL}/admin/${id}/tu-choi`, {}, {
        headers: { Authorization: 'Bearer ' + token }
    }),
    xoaBaiViet: async (id, token) => axios.delete(`${API_URL}/admin/${id}`, {
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
    },
    layBaiVietLienQuan: async (id) => {
        return axios.get(`${API_URL}/lien-quan/${id}`);
    }
}
export default quanLyBaiVietApi;