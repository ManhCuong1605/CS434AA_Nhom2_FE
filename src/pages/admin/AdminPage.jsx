import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../../style/AdminPage.css';

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

const { Header, Sider, Content } = Layout;

function AdminPage({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    return (
        <Layout>
            {/* Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-dark text-white"
            >
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
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <ClusterOutlined />,
                            label: 'Loại đất',
                        },
                        {
                            key: '2',
                            icon: <HomeOutlined />,
                            label: 'Bất động sản',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: 'User',
                        },
                        {
                            key: '4',
                            icon: <ShoppingCartOutlined />,
                            label: 'Mua đất',
                        },
                        {
                            key: '5',
                            icon: <SolutionOutlined />,
                            label: 'Nhân viên',
                        },


                    ]}
                />
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
                    <h2 className="mb-4">Dashboard</h2>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card text-white bg-primary shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Loại đất</h5>
                                    <p className="card-text">Quản lý tất cả các loại đất.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card text-white bg-success shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Đất động sản</h5>
                                    <p className="card-text">Quản lý tất cả đất.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card text-white bg-warning shadow">
                                <div className="card-body">
                                    <h5 className="card-title">User</h5>
                                    <p className="card-text">Quản lý người dùng.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card text-white bg-danger shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Mua đất</h5>
                                    <p className="card-text">Quản lý các form người dùng bán đất.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="card text-white bg-info shadow">
                                <div className="card-body">
                                    <h5 className="card-title">Nhân viên</h5>
                                    <p className="card-text">Quản lý tất cả nhân viên.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminPage;
