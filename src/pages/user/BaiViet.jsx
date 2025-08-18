import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Row, Col, Spinner, Toast, ToastContainer } from "react-bootstrap";
import quanLyBaiVietApi from "../../api/QuanLyBaiVietApi.jsx";
import diaChiApi from "../../api/DiaChiApi.jsx";

const BaiViet = () => {
    // Form state
    const [form, setForm] = useState({
        TieuDe: "", // Added TieuDe field
        ThanhPho: "",
        Quan: "",
        Phuong: "",
        DiaChi: "",
        MoTa: "",
        GiaBan: "",
        DienTich: "",
        Huong: "",
        TrangThai: 1
    });

    // UI state
    const [images, setImages] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [giaHienThi, setGiaHienThi] = useState("");
    const [dienTichHienThi, setDienTichHienThi] = useState("");

    // Address data state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Toast effect
    useEffect(() => {
        if (statusMessage) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    // Load provinces on mount
    useEffect(() => {
        let isMounted = true;
        
        const loadProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const data = await diaChiApi.getAllProvinces();
                
                if (isMounted && data && Array.isArray(data) && data.length > 0) {
                    const formattedData = data.map(province => ({
                        code: province.Id || province.code,
                        name: province.Name || province.name,
                        districts: province.Districts || province.districts
                    }));
                    setProvinces(formattedData);
                }
            } catch (error) {
                console.error('Lỗi khi load tỉnh/thành phố:', error);
            } finally {
                if (isMounted) {
                    setLoadingProvinces(false);
                }
            }
        };

        loadProvinces();
        return () => { isMounted = false; };
    }, []);

    // Load districts when province changes
    useEffect(() => {
        let isMounted = true;
        
        if (form.ThanhPho) {
            const loadDistricts = async () => {
                try {
                    setLoadingDistricts(true);
                    const data = await diaChiApi.getDistrictsByProvince(form.ThanhPho);
                    const formattedDistricts = data.map(district => ({
                        code: district.Id || district.code,
                        name: district.Name || district.name,
                        wards: district.Wards || district.wards
                    }));
                    if (isMounted) {
                        setDistricts(formattedDistricts);
                    }
                } catch (error) {
                    console.error('Lỗi khi load quận/huyện:', error);
                } finally {
                    if (isMounted) {
                        setLoadingDistricts(false);
                    }
                }
            };
            loadDistricts();
        } else {
            setDistricts([]);
            setForm(prev => ({ ...prev, Quan: "", Phuong: "" }));
        }

        return () => { isMounted = false; };
    }, [form.ThanhPho]);

    // Load wards when district changes
    useEffect(() => {
        let isMounted = true;
        
        if (form.Quan) {
            const loadWards = async () => {
                try {
                    setLoadingWards(true);
                    const data = await diaChiApi.getWardsByDistrict(form.Quan);
                    const formattedWards = data.map(ward => ({
                        code: ward.Id || ward.code,
                        name: ward.Name || ward.name
                    }));
                    if (isMounted) {
                        setWards(formattedWards);
                    }
                } catch (error) {
                    console.error('Lỗi khi load phường/xã:', error);
                } finally {
                    if (isMounted) {
                        setLoadingWards(false);
                    }
                }
            };
            loadWards();
        } else {
            setWards([]);
            setForm(prev => ({ ...prev, Phuong: "" }));
        }

        return () => { isMounted = false; };
    }, [form.Quan]);

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "GiaBan") {
            const rawValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
            const formatted = new Intl.NumberFormat("vi-VN").format(Number(rawValue || 0));
            setGiaHienThi(formatted);
            setForm({ ...form, GiaBan: rawValue });
        } else if (name === "DienTich") {
            const rawValue = value.replace(/\./g, "").replace(/[^0-9.]/g, "");
            const formatted = new Intl.NumberFormat("vi-VN").format(Number(rawValue || 0));
            setDienTichHienThi(formatted);
            setForm({ ...form, DienTich: rawValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    // Validation
    const validate = () => {
        let newErrors = {};
        
        if (!form.TieuDe.trim()) newErrors.TieuDe = "Vui lòng nhập tiêu đề"; // Added TieuDe validation
        if (!form.ThanhPho.trim()) newErrors.ThanhPho = "Vui lòng chọn thành phố";
        if (!form.Quan.trim()) newErrors.Quan = "Vui lòng chọn quận/huyện";
        if (!form.Phuong.trim()) newErrors.Phuong = "Vui lòng chọn phường/xã";
        if (!form.DiaChi.trim()) newErrors.DiaChi = "Vui lòng nhập địa chỉ";
        if (!form.GiaBan) newErrors.GiaBan = "Vui lòng nhập giá";
        else if (isNaN(form.GiaBan) || Number(form.GiaBan) <= 0) newErrors.GiaBan = "Giá phải là số dương";
        if (!form.DienTich) newErrors.DienTich = "Vui lòng nhập diện tích";
        else if (isNaN(form.DienTich) || Number(form.DienTich) <= 0) newErrors.DienTich = "Diện tích phải là số dương";
        if (!form.MoTa.trim()) newErrors.MoTa = "Vui lòng nhập mô tả";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setStatusType("");
        setLoading(true);

        if (validate()) {
            const token = localStorage.getItem("token");
            if (!token) {
                setStatusMessage("Thất bại: Bạn cần đăng nhập để đăng bài viết.");
                setStatusType("error");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("TieuDe", form.TieuDe); // Added TieuDe to FormData
            formData.append("ThanhPho", form.ThanhPho);
            formData.append("Quan", form.Quan);
            formData.append("Phuong", form.Phuong);
            formData.append("DiaChi", form.DiaChi);
            formData.append("MoTa", form.MoTa);
            formData.append("GiaBan", form.GiaBan);
            formData.append("DienTich", form.DienTich);
            formData.append("Huong", form.Huong);
            formData.append("TrangThai", form.TrangThai);
            
            images.forEach(img => {
                formData.append("images", img);
            });

            try {
                const response = await quanLyBaiVietApi.taoBaiViet(formData, token);
                const resData = response.data;

                setStatusMessage(resData.message || "Thành công: Gửi bài viết thành công! Đang chờ admin duyệt.");
                setStatusType("success");
                setForm({ 
                    TieuDe: "", // Reset TieuDe
                    ThanhPho: "", Quan: "", Phuong: "", 
                    DiaChi: "", MoTa: "", GiaBan: "", DienTich: "", 
                    Huong: "", TrangThai: 1
                });
                setImages([]);
                setErrors({});
                setGiaHienThi("");
                setDienTichHienThi("");
                setDistricts([]);
                setWards([]);
            } catch (error) {
                const message = error?.response?.data?.message || "Thất bại: Không thể kết nối tới server!";
                setStatusMessage(message.startsWith("Thất bại:") ? message : `Thất bại: ${message}`);
                setStatusType("error");
            }
        }

        setLoading(false);
    };

    return (
        <>
            {/* Toast message */}
            <ToastContainer
                position="top-end"
                className="custom-toast-container"
                style={{ zIndex: 9999, top: 100, right: 24, position: 'fixed' }}
            >
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    className="custom-toast"
                >
                    <Toast.Body className="custom-toast-body">
                        {statusMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Container style={{ marginTop: 40, marginBottom: 40 }}>
                <Row className="justify-content-center">
                    <Col md={10} lg={9}>
                        <Card className="shadow-lg">
                            <Card.Body>
                                <h3 className="mb-4 text-center text-black">
                                    Đăng bài viết bất động sản
                                </h3>
                                
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* Title Field */}
                                    <Form.Group className="mb-3" controlId="TieuDe">
                                        <Form.Label>Tiêu đề <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="TieuDe"
                                            value={form.TieuDe}
                                            onChange={handleChange}
                                            placeholder="Nhập tiêu đề bài viết"
                                            isInvalid={!!errors.TieuDe}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.TieuDe}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Address Fields */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="ThanhPho">
                                                <Form.Label>Thành phố <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Select
                                                    name="ThanhPho"
                                                    value={form.ThanhPho}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.ThanhPho}
                                                    disabled={loadingProvinces}
                                                >
                                                    <option value="">Chọn thành phố</option>
                                                    {provinces && provinces.length > 0 ? (
                                                        provinces.map((province) => (
                                                            <option key={province.code} value={province.code}>
                                                                {province.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="" disabled>
                                                            {loadingProvinces ? 'Đang tải...' : 'Không có dữ liệu'}
                                                        </option>
                                                    )}
                                                </Form.Select>
                                                {loadingProvinces && (
                                                    <div className="mt-1">
                                                        <Spinner animation="border" size="sm" />
                                                        <span className="ms-2 text-muted">Đang tải...</span>
                                                    </div>
                                                )}
                                                <Form.Control.Feedback type="invalid">{errors.ThanhPho}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="Quan">
                                                <Form.Label>Quận/Huyện <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Select
                                                    name="Quan"
                                                    value={form.Quan}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.Quan}
                                                    disabled={!form.ThanhPho || loadingDistricts}
                                                >
                                                    <option value="">Chọn quận/huyện</option>
                                                    {districts.map((district) => (
                                                        <option key={district.code} value={district.code}>
                                                            {district.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {loadingDistricts && (
                                                    <div className="mt-1">
                                                        <Spinner animation="border" size="sm" />
                                                        <span className="ms-2 text-muted">Đang tải...</span>
                                                    </div>
                                                )}
                                                <Form.Control.Feedback type="invalid">{errors.Quan}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="Phuong">
                                                <Form.Label>Phường/Xã <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Select
                                                    name="Phuong"
                                                    value={form.Phuong}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.Phuong}
                                                    disabled={!form.Quan || loadingWards}
                                                >
                                                    <option value="">Chọn phường/xã</option>
                                                    {wards.map((ward) => (
                                                        <option key={ward.code} value={ward.code}>
                                                            {ward.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {loadingWards && (
                                                    <div className="mt-1">
                                                        <Spinner animation="border" size="sm" />
                                                        <span className="ms-2 text-muted">Đang tải...</span>
                                                    </div>
                                                )}
                                                <Form.Control.Feedback type="invalid">{errors.Phuong}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="Huong">
                                                <Form.Label>Hướng</Form.Label>
                                                <Form.Select
                                                    name="Huong"
                                                    value={form.Huong}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chọn hướng</option>
                                                    <option value="Đông">Đông</option>
                                                    <option value="Tây">Tây</option>
                                                    <option value="Nam">Nam</option>
                                                    <option value="Bắc">Bắc</option>
                                                    <option value="Đông Nam">Đông Nam</option>
                                                    <option value="Đông Bắc">Đông Bắc</option>
                                                    <option value="Tây Nam">Tây Nam</option>
                                                    <option value="Tây Bắc">Tây Bắc</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Address Detail */}
                                    <Form.Group className="mb-3" controlId="DiaChi">
                                        <Form.Label>Địa chỉ chi tiết <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="DiaChi"
                                            value={form.DiaChi}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, khu vực...)"
                                            isInvalid={!!errors.DiaChi}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.DiaChi}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Price and Area */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="GiaBan">
                                                <Form.Label>Giá bán <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="GiaBan"
                                                    value={giaHienThi}
                                                    onChange={handleChange}
                                                    placeholder="Nhập giá bán"
                                                    isInvalid={!!errors.GiaBan}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.GiaBan}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="DienTich">
                                                <Form.Label>Diện tích (m²) <span style={{ color: 'red' }}>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="DienTich"
                                                    value={dienTichHienThi}
                                                    onChange={handleChange}
                                                    placeholder="Nhập diện tích"
                                                    isInvalid={!!errors.DienTich}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.DienTich}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Description */}
                                    <Form.Group className="mb-3" controlId="MoTa">
                                        <Form.Label>Mô tả <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="MoTa"
                                            value={form.MoTa}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả chi tiết về bất động sản..."
                                            isInvalid={!!errors.MoTa}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.MoTa}</Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Images */}
                                    <Form.Group className="mb-3" controlId="images">
                                        <Form.Label>Hình ảnh</Form.Label>
                                        <Form.Control
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <Form.Text className="text-muted">
                                            Có thể chọn nhiều hình ảnh (JPG, PNG, GIF)
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Submit Button */}
                                    <div className="text-center">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={loading}
                                            className="px-5"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                'Đăng bài viết'
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default BaiViet;