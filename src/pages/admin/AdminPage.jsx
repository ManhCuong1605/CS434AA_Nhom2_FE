import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../../style/AdminPage.css';
import { useNavigate, useLocation } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    ClusterOutlined,
    HomeOutlined,
    TeamOutlined,
    IdcardOutlined,
    FileTextOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

function AdminPage({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [roles, setRoles] = useState([]);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
        setRoles(storedRoles);

        // Kiểm tra và điều hướng nếu là ADMIN và không phải đang ở trang đăng nhập
        if (storedRoles.includes('ADMIN') && location.pathname === '/admin') {
            navigate('/admin/loaiDat', { replace: true });
        }
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");
        localStorage.removeItem("nhanVienId");
        window.dispatchEvent(new Event("storage")); // Gửi sự kiện cập nhật
        navigate("/dang-nhap", { replace: true });// Điều hướng đến trang đăng nhập
    };

    const isAdmin = roles.includes('ADMIN');
    const isNhanVien = roles.includes("NHANVIEN");

    // Ánh xạ URL với key số
    const pathToKey = {
        '/admin/loaiDat': '1',
        '/admin/batDongSan': '2',
        '/admin/user': '3',
        '/admin/khachHang': '4',
        '/admin/nhanVien': '5',
        '/admin/quanLyBaiViet': '6',
        '/admin/quanLyLichHen': '7',
        [`/admin/nhanvien/lichhen/${localStorage.getItem("nhanVienId")}`]: 'nv1',
    };

    // Lấy key tương ứng với URL hiện tại
    const selectedKey = pathToKey[location.pathname] || '1'; // Mặc định là '1' nếu không khớp

    return (
        <Layout>
            {/* Sidebar */}
            <Sider trigger={null} collapsible collapsed={collapsed} className="bg-dark text-white">
                <div
                    className="d-flex align-items-center justify-content-center py-4"
                    style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: '#001529',
                    }}
                >
                    Dashboard
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}>
                    <Menu.Item key="1" icon={<ClusterOutlined />}>
                        <Link to="/admin/loaiDat">Loại đất</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<HomeOutlined />}>
                        <Link to="/admin/batDongSan">Bất động sản</Link>
                    </Menu.Item>
                    {isAdmin && (
                        <Menu.Item key="3" icon={<UserOutlined />}>
                            <Link to="/admin/user">Người dùng</Link>
                        </Menu.Item>
                    )}
                    <Menu.Item key="4" icon={<TeamOutlined />}>
                        <Link to="/admin/khachHang">Khách hàng</Link>
                    </Menu.Item>
                    {isAdmin && (
                        <Menu.Item key="5" icon={<IdcardOutlined />}>
                            <Link to="/admin/nhanVien">Nhân viên</Link>
                        </Menu.Item>
                    )}
                    <Menu.Item key="6" icon={<FileTextOutlined />}>
                        <Link to="/admin/quanLyBaiViet">Quản Lý bài viết</Link>
                    </Menu.Item>
                    {isAdmin && (
                        <Menu.Item key="7" icon={<CalendarOutlined />}>
                            <Link to="/admin/quanLyLichHen">Quản Lý lịch hẹn</Link>
                        </Menu.Item>
                    )}
                    {isNhanVien && (
                        <Menu.Item key="nv1" icon={<CalendarOutlined />}>
                            <Link to={`/admin/nhanvien/lichhen/${localStorage.getItem("nhanVienId")}`}>
                                Lịch hẹn của tôi
                            </Link>
                        </Menu.Item>
                    )}
                </Menu>
            </Sider>

            {/* Main Layout */}
            <Layout>
                {/* Header */}
                <Header
                    className={`d-flex align-items-center justify-content-between px-3 ${collapsed ? 'collapsed' : ''}`}
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        borderBottom: '1px solid #dee2e6',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 48,
                            height: 48,
                        }}
                    />
                    <div className="d-flex align-items-center">
                        <Avatar
                            size="large"
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: '#87d068',
                                marginRight: '8px',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#333',
                            }}
                        >
                            Admin
                        </span>
                        <Button
                            className="btn btn-danger ms-3"
                            style={{
                                padding: '5px 20px',
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </Header>

                {/* Content */}
                <Content
                    className={collapsed ? 'collapsed' : ''}
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ padding: '24px', minHeight: '280px' }}>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminPage;