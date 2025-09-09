import axios from "axios";
import getAuthHeader from "./AuthHeader.jsx";

const BASE_URL = "http://localhost:5000/api/danh-muc-yeu-thich";

export const getFavorites = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/list`, getAuthHeader());
    return Array.isArray(res.data)
      ? res.data.map(item => item.nhaDatYeuThich)
      : [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu thích:", error.response?.data || error.message, error.response?.status);
    throw error;
  }
};

export const addFavorite = async (nhaDatId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/add`,
      { NhaDatId: nhaDatId },
      getAuthHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm yêu thích:", error.response?.data || error.message);
    throw error;
  }
};


export const removeFavorite = async (nhaDatId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/remove/${nhaDatId}`,
      getAuthHeader()
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa yêu thích:", error);
    throw error;
  }
};