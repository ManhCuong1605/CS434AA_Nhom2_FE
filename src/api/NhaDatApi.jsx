import axios from "axios";
const API_URL = "http://localhost:5000/api/nhaDat";

const nhaDatApi = {
    getAll: async (params) => axios.get(API_URL, { params }),
    getById: async (id) => axios.get(`${API_URL}/${id}`),
    add: async (data) =>
        axios.post(`${API_URL}/addNhaDat`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),
    update: async (id, data) => axios.put(`${API_URL}/${id}`, data),
    delete: async (id) => axios.delete(`${API_URL}/${id}`),
    search: async (params) => axios.get(`${API_URL}/search`, { params }),
    getRelated: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/related`, {
                timeout: 10000, // Timeout sau 10 giây
            });
            return response;
        } catch (error) {
            console.error("Lỗi khi lấy bất động sản liên quan:", error);
            throw error;
        }
    },
};

export default nhaDatApi;
