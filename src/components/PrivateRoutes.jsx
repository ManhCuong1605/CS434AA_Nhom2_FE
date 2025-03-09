import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (!token)
        return <Navigate to="//dang-nhap" replace />;
    if (!roles.some(role => allowedRoles.includes(role))) {
        alert('Bạn không có quyền truy cập');
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};
export default PrivateRoute;