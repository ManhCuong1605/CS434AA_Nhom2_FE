import axios from "axios";

// Tạo axios instance
const TokenApi = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Thêm accessToken vào mỗi request
TokenApi.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý response: tự động refresh token khi hết hạn
TokenApi.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        // Nếu 401 và chưa thử refresh token
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("Không có refresh token");

                // Gọi API refresh token
                const response = await axios.post(
                    "http://localhost:5000/api/refresh-token",
                    { refreshToken }
                );

                // Lưu access token mới
                localStorage.setItem("accessToken", response.data.accessToken);

                // Thử lại request cũ với access token mới
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return TokenApi(originalRequest);

            } catch (e) {
                console.error("Refresh token lỗi:", e);

                // Xoá tất cả token và thông tin người dùng
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("username");
                localStorage.removeItem("roles");
                localStorage.removeItem("userId");
                localStorage.removeItem("nhanVienId");

                // Redirect về trang login an toàn
                window.location.href = "/dang-nhap";

                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default TokenApi;
