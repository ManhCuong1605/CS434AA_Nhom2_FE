import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useChat } from "../../context/ChatContext";
import nhaDatApi from "../../api/NhaDatApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoTaChiTiet from "../../components/MoTaChiTiet";
import "../../style/Chitietsanpham.css";
import { FaHeart, FaShareAlt, FaFacebookSquare } from "react-icons/fa";
import { addFavorite, removeFavorite, getFavorites } from "../../api/DanhMucYeuThichApi";
import { Helmet } from "react-helmet-async";
import DatLichHenModal from "../../components/DatLichHenModal";

const ChiTietSanPham = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsChatOpen } = useChat();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [popupList, setPopupList] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showShareSuccess, setShowShareSuccess] = useState(false);
    const token = localStorage.getItem("accessToken");

    const fetchData = async (numericId) => {
        try {
            const res = await nhaDatApi.getById(numericId);
            const data = res.data;
            console.log("API response:", data);

            const mappedData = {
                id: data.id,
                title: data.TenNhaDat,
                price: `${Number(data.GiaBan).toLocaleString()} VND`,
                area: `${data.DienTich}m²`,
                pricePerM2: data.GiaBan && data.DienTich ? `${Math.round(data.GiaBan / data.DienTich).toLocaleString()} VND/m²` : "",
                street: data.Duong || "",
                ward: data.Phuong || "",
                district: data.Quan || "",
                
                province: data.ThanhPho || "",
                
                location: `${data.Duong || ""}, ${data.Phuong ? `Phường ${data.Phuong}` : ""}, ${data.Quan ? `Quận ${data.Quan}` : ""}, ${data.ThanhPho || ""}`,
                
                images: data.hinhAnh?.map((img) => img.url) || [],
                contact: "0969 524 111",
                agent: "Nguyễn Bình Gold",
                description: data.MoTa,
                type: "nhaDat",
                status: data.TrangThai === 1 ? "Đang bán" : "Đã bán",
            };

            setProduct(mappedData);
            setSelectedImage(0);

            setLoadingRelated(true);
            try {
                const relatedRes = await nhaDatApi.getRelated(numericId);
                const relatedData = relatedRes.data.data.map((item) => ({
                    id: item.id,
                    title: item.TenNhaDat,
                    price: `${Number(item.GiaBan).toLocaleString()} VND`,
                    area: `${item.DienTich}m²`,
                    image: item.hinhAnh?.[0]?.url || "https://via.placeholder.com/150",
                }));
                setRelatedProducts(relatedData.slice(0, 4));
            } catch (relatedError) {
                console.error("Lỗi khi lấy bất động sản liên quan:", relatedError);
                setRelatedProducts([]);
            } finally {
                setLoadingRelated(false);

            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            alert("Không thể tải thông tin sản phẩm!");
            navigate("/");
        }
    };

    useEffect(() => {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            alert("ID không hợp lệ, phải là số nguyên");
            navigate("/");

            return;
        }
        setProduct(null);
        setRelatedProducts([]);
        fetchData(numericId);

        if (!token) {
            setIsFavorite(false);
            return;
        }

        const fetchFavorite = async () => {
            try {
                const favorites = await getFavorites();

                const found = favorites.some((item) => item.id === numericId);
                setIsFavorite(found);

            } catch (err) {
                console.error("Không lấy được danh sách yêu thích:", err);
            }
        };
        fetchFavorite();
    }, [id, navigate, token]);

    const handleToggleFavorite = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để sử dụng chức năng yêu thích");
            return;
        }
        try {
            if (isFavorite) {

                await removeFavorite(product.id);

                setIsFavorite(false);

                setPopupList((prev) => prev.filter((p) => p.id !== product.id));
            } else {

                await addFavorite(product.id);
                setIsFavorite(true);

                const newPopupItem = {
                    id: product.id,
                    title: product.title,

                    img: product.images?.[0] || "https://via.placeholder.com/150",
                    time: "Vừa lưu xong",
                };
                setPopupList((prev) => [newPopupItem, ...prev.slice(0, 2)]);

                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 4000);
            }
        } catch (error) {
            console.error("Lỗi khi toggle yêu thích:", error);

            toast.error("Lỗi khi cập nhật danh sách yêu thích!");
        }
    };

    const handleShare = (platform) => {
        if (!product) {
            toast.error("Không có thông tin sản phẩm để chia sẻ!");
            return;
        }

        const shareUrl = `http://localhost:3000/bat-dong-san/${product.id}`;
        
        const title = product.title || "Bất động sản";

        const description = product.description || "Thông tin bất động sản chi tiết.";
        const image = "https://via.placeholder.com/1200x630";

        switch (platform) {
            case "facebook":
                const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                window.open(fbUrl, "_blank", "noopener,noreferrer");
                setShowShareSuccess(true);
                setTimeout(() => setShowShareSuccess(false), 4000);
                break;
            case "zalo":
                const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}`;
                window.open(zaloUrl, "_blank", "noopener,noreferrer");
                setShowShareSuccess(true);
                setTimeout(() => setShowShareSuccess(false), 4000);
                break;
            case "copy":
                navigator.clipboard.writeText(shareUrl).then(() => {
                    toast.success("Đã sao chép liên kết!");
                    setShowShareSuccess(true);
                    setTimeout(() => setShowShareSuccess(false), 4000);
                }).catch(() => {
                    toast.error("Sao chép thất bại");
                });
                break;
            default:
                break;
        }

        setShowShareMenu(false);
    };

    return (
        <Container className="my-5 product-container">
            <Helmet>
                {product && (
                    <>
                        <title>{product.title}</title>
                        <meta name="description" content={product.description} />
                        <meta property="og:title" content={product.title} />
                        <meta
                            property="og:description"
                            content={`${product.price} - Diện tích: ${product.area} - Địa chỉ: ${product.location} - ${product.description || "Thông tin chi tiết"}`}
                        />
                        <meta
                            property="og:image"
                            content="https://via.placeholder.com/1200x630"
                        />
                        <meta
                            property="og:url"
                            content={`http://localhost:3000/bat-dong-san/${product.id}`}
                        />
                        <meta property="og:type" content="article" />
                        <meta property="og:site_name" content="Website Bất Động Sản" />
                    </>
                )}
            </Helmet>
            {showPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: "70px",
                        right: "20px",
                        width: "320px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                        Tin đăng đã lưu
                    </div>
                    {popupList.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 15px",
                                borderBottom: "1px solid #f0f0f0",
                            }}
                        >
                            <img
                                src={p.img}
                                alt={p.title}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    marginRight: "10px",
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#333",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {p.title}
                                </div>
                                <div style={{ fontSize: "12px", color: "#888" }}>{p.time}</div>
                            </div>
                        </div>
                    ))}
                    <div
                        style={{
                            padding: "8px 15px",
                            textAlign: "center",
                            color: "red",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/danh-muc-yeu-thich")}
                    >
                        Xem tất cả →
                    </div>
                </div>
            )}

            {showShareSuccess && (
                <div
                    style={{
                        position: "fixed",
                        top: "70px",
                        right: "20px",
                        width: "320px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                        Chia sẻ thành công!
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 15px",
                            borderBottom: "1px solid #f0f0f0",
                        }}
                    >
                        <img
                            src={product?.images?.[0] || "https://via.placeholder.com/150"}
                            alt={product?.title}
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                marginRight: "10px",
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#333",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {product?.title}
                            </div>
                            <div style={{ fontSize: "12px", color: "#888" }}>Vừa chia sẻ xong</div>
                        </div>
                    </div>
                    <div
                        style={{
                            padding: "8px 15px",
                            textAlign: "center",
                            color: "#198754",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                        onClick={() => setShowShareSuccess(false)}
                    >
                        Đóng
                    </div>
                </div>
            )}

            {!product ? (
                <div className="text-center">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3">Đang tải thông tin...</p>
                </div>
            ) : (
                <>
                    <div className="product-top">
                        <div className="product-left">
                            <div className="main-image-wrapper">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.title}
                                        className="main-image"
                                    />
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{ height: "100%", backgroundColor: "#f8f9fa" }}
                                    >
                                        <p className="text-muted">Không có hình ảnh</p>
                                    </div>
                                )}
                                {product.images.length > 1 && (
                                    <>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            style={{
                                                position: "absolute",
                                                left: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                opacity: 0.8,
                                            }}
                                            onClick={() =>
                                                setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
                                            }
                                        >
                                            ‹
                                        </Button>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                opacity: 0.8,
                                            }}
                                            onClick={() =>
                                                setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
                                            }
                                        >
                                            ›
                                        </Button>
                                    </>
                                )}
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="thumbnail-container">
                                    {product.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Ảnh ${index + 1}`}
                                            className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                                            onClick={() => setSelectedImage(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="product-right">
                            <h2 className="product-title">
                                {product.title}
                            </h2>
                            <p className="product-price" style={{ color: "#f00d0dff", fontSize: "22px" }}>
                                Giá: <span style={{ fontWeight: "bold" }}>{product.price}</span>
                            </p>

                            <div className="mb-4">
                                <h5>Địa chỉ</h5>
                                <p className="product-location">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    {product.location}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5>Thông tin bất động sản</h5>
                                <div className="row">
                                    <div className="col-6">
                                        <small className="text-muted">Diện tích:</small>
                                        <p className="mb-1">
                                            <strong>{product.area}</strong>
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted">Giá/m²:</small>
                                        <p className="mb-1">
                                            <strong>{product.pricePerM2 || "Không xác định"}</strong>
                                        </p>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted">Trạng thái: </small>
                                        <strong className="d-inline">{product.status}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Thông tin liên hệ</h5>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-user me-2"></i>
                                    <span>
                                        <strong>Môi giới:</strong> {product.agent}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-phone me-2"></i>
                                    <span>
                                        <strong>Số điện thoại:</strong> {product.contact}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mb-3">
                                <button className="btn btn-primary me-2" onClick={() => setIsChatOpen(true)}>
                                    Liên hệ ngay
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        const token = localStorage.getItem("accessToken");
                                        if (!token || token.trim() === "") {
                                            toast.error("Vui lòng đăng nhập để đặt lịch hẹn!");
                                            return;
                                        }
                                        setShowModal(true); // mở modal nếu đã đăng nhập
                                    }}
                                >
                                    Đặt lịch hẹn
                                </button>
                            </div>

                            <div className="d-flex justify-content-end mt-auto">
                                <button
                                    onClick={handleToggleFavorite}
                                    className="btn btn-light rounded-circle shadow me-2"
                                    style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <FaHeart style={{ color: isFavorite ? "red" : "#6c757d", fontSize: "20px" }} />
                                </button>

                                <div className="position-relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="btn btn-light rounded-circle shadow"
                                        style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                        <FaShareAlt style={{ color: "#198754", fontSize: "20px" }} />
                                    </button>

                                    {showShareMenu && (
                                        <div
                                            className="share-menu"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                right: "0",
                                                background: "#fff",
                                                borderRadius: "10px",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                                zIndex: 1000,
                                                padding: "10px",
                                                width: "200px",
                                                marginTop: "5px",
                                            }}
                                        >
                                            <button
                                                onClick={() => handleShare("facebook")}
                                                style={{
                                                    width: "100%",
                                                    padding: "5px",
                                                    textAlign: "left",
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <FaFacebookSquare style={{ marginRight: "10px", color: "#3b5998", fontSize: "24px" }} />{" "}
                                                Facebook
                                            </button>
                                            <button
                                                onClick={() => handleShare("zalo")}
                                                style={{
                                                    width: "100%",
                                                    padding: "5px",
                                                    textAlign: "left",
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: 24,
                                                        height: 24,
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 48 48"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect width="48" height="48" rx="12" fill="#0180DE" />
                                                        <path
                                                            d="M24 13C17.3726 13 12 17.4772 12 23C12 25.7614 13.3431 28.2386 15.5147 29.9992C15.1862 31.0932 14.3932 32.3932 13.5 33.5C13.5 33.5 16.5 33 19.5 31.5C21.0192 31.8202 22.4841 32 24 32C30.6274 32 36 27.5228 36 22C36 16.4772 30.6274 13 24 13Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                </span>
                                                Zalo
                                            </button>
                                            <button
                                                onClick={() => handleShare("copy")}
                                                style={{
                                                    width: "100%",
                                                    padding: "5px",
                                                    textAlign: "left",
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span style={{ marginRight: "10px" }}></span> Sao chép liên kết
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="product-description">
                            <MoTaChiTiet description={product.description} />
                        </div>
                    )}

                    <div className="mt-5 related-products-container">
                        <h3 className="mb-4">
                            Bất động sản liên quan
                        </h3>
                        {loadingRelated ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="success" />
                                <p className="mt-3">Đang tải bất động sản liên quan...</p>
                            </div>
                        ) : relatedProducts.length > 0 ? (
                            <Row>
                                {relatedProducts.map((related) => (
                                    <Col key={related.id} md={3} sm={6} className="mb-4">
                                        <div
                                            className="related-card"
                                            onClick={() => navigate(`/bat-dong-san/${related.id}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img src={related.image} alt={related.title} style={{ height: "150px", objectFit: "cover", width: "100%" }} />
                                            <div className="p-2">
                                                <h6 className="text-truncate">{related.title}</h6>
                                                <p className="text-danger mb-1">Giá: {related.price}</p>
                                                <p className="mb-0">Diện tích: {related.area}</p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p className="text-muted">Không có bất động sản liên quan.</p>
                        )}
                    </div>

                    <DatLichHenModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        nhaDatId={id}
                    />

                    <ToastContainer position="top-right" autoClose={3000} />
                </>
            )}
        </Container>
    );
};

export default ChiTietSanPham;