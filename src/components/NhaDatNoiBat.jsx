// src/components/NhaDatNoiBat.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Meta } = Card;

const NhaDatNoiBat = () => {
    const [nhaDatList, setNhaDatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNoiBat = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/api/batDongSanNoiBat");
                setNhaDatList(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm nổi bật:", error);
                setNhaDatList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNoiBat();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-center mb-4">Sản phẩm nổi bật</h2>
            <Row gutter={[16, 16]}>
                {nhaDatList.map(item => (
                    <Col xs={24} sm={12} md={6} key={item.id}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={item.TenNhaDat}
                                    src={item.hinhAnh?.[0]?.url || "/default-image.jpg"}
                                    className="img-fluid card-image"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/bat-dong-san/${item.id}`)}
                                />
                            }
                            className="shadow-sm card-container"
                            onClick={() => navigate(`/bat-dong-san/${item.id}`)}
                        >
                            <Meta title={<span className="card-title">{item.TenNhaDat}</span>} />
                            <p className="card-price text-dark fw-normal">
                                {item.Quan}, {item.ThanhPho}
                            </p>
                            <p className="card-price">
                                {Number(item.GiaBan).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </p>
                            <Button
                                type="primary"
                                block
                                onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/bat-dong-san/${item.id}`);
                                }}
                            >
                                Xem chi tiết
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default NhaDatNoiBat;
