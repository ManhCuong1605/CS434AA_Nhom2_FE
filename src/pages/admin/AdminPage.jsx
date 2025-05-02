import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../../style/AdminPage.css';
import { useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    ClusterOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

function AdminPage({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        window.dispatchEvent(new Event("storage")); // Gửi sự kiện cập nhật
        navigate("/dang-nhap", { replace: true }); // Điều hướng đến trang đăng nhập
    };

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
                    defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<ClusterOutlined />}>
                        <Link to="/admin/loaidat">Loại đất</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<HomeOutlined />}>
                        <Link to="/admin/batdongsan">Bất động sản</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                        <Link to="/admin/user">Người dùng</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
                        <Link to="/admin/khachhang">Khách hàng</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SolutionOutlined />}>
                        <Link to="/admin/nhanVien">Nhân viên</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Layout */}
            <Layout>
                {/* Header */}
                <Header
                    className="d-flex align-items-center justify-content-between px-3"
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
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminPage;
