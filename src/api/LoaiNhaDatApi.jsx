import axios from "axios";

const API_URL = "http://localhost:5000/api/loaiNhaDat";

const loaiNhaDatApi = {
    getAll: async () => axios.get(API_URL),
    getById: async (id) => axios.get(`${API_URL}/${id}`),
    add: async (data) => axios.post(`${API_URL}/addLoaiNhaDat`, data),
    update: async (id, data) => {
        console.log(`Gửi PUT request đến: ${API_URL}/${id}`, data);
        return axios.put(`${API_URL}/${id}`, data);
    },
    delete: async (id) => axios.delete(`${API_URL}/${id}`)

};

export default loaiNhaDatApi;
