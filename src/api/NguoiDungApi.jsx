import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getAll = (token) => {
    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,  // Gửi token trong header
        },
    });
};

const add = (data) => {
    return axios.post(`${API_URL}/addUser`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

const update = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};
const apiObject = {
    getAll,
    add,
    update,
    delete: deleteUser,
};

export default apiObject;
