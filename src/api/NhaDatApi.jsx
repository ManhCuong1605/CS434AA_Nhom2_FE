import axios from "axios";
const API_URL = "http://localhost:5000/api/nhaDat";

const nhaDatApi = {
    getAll: async () => axios.get(API_URL),
    getById: async (id) => axios.get(`${API_URL}/${id}`),
    add: async (data) =>
        axios.post(`${API_URL}/addNhaDat`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }),
    update: async (id, data) => axios.put(`${API_URL}/${id}`, data),
    delete: async (id) => axios.delete(`${API_URL}/${id}`),
    search: async (params) => axios.get(`${API_URL}/search`, { params })
};

export default nhaDatApi;
