import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getAll = (params, token) => {
    return axios.get(API_URL, {
        params,
        headers: {
            Authorization: `Bearer ${token}`,  // Token chuẩn
        },
    });
};

const add = (data) => {
    return axios.post(`${API_URL}/addUser`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
};

const update = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
};

const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
