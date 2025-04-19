import axios from 'axios';
const API_URL = 'http://localhost:5000/api/khachHang';

const khachHangApi = {
    getAll: async () => axios.get(API_URL),
    getById: async (id) => axios.get(`${API_URL}/${id}`),
    add: async (data) => axios.post(`${API_URL}`, data),
    update: async (id, data) => axios.put(`${API_URL}/${id}`, data),
    delete: async (id) => axios.delete(`${API_URL}/${id}`)

}

export default khachHangApi;


