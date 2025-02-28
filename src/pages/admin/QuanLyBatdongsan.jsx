import React, { useState } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
function Batdongsan() {
    const [showModal, setShowModal] = useState(false);
    return (
        <AdminPage>
            <h2 className="mb-4">Bất động sản</h2>
            <p>Quản lý bất động sản ở đây.</p>
            <button type="button" className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Thêm bất động sản</button>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã đất</th>
                        <th scope="col">Tên đất</th>
                        <th scope="col">Loại đất</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Diện tích</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Ngày đăng</th>
                        <th scope="col">Ngày cập nhật</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>LD001</td>
                        <td>Đất nền khu A</td>
                        <td>Đất nền</td>
                        <td>Đất nền sổ đỏ chính chủ</td>
                        <td>Quận 1, TP.HCM</td>
                        <td>2 tỷ</td>
                        <td>100m²</td>
                        <td>Chưa bán</td>
                        <td>2024-02-01</td>
                        <td>2024-02-05</td>
                        <td><img src="link_hinh_anh_1.jpg" width="50" height="50" alt="Hình 1" /></td>
                        <td>
                            <button type="button" className="btn btn-warning me-2">Sửa</button>
                            <button type="button" className="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>LD002</td>
                        <td>Nhà phố khu B</td>
                        <td>Nhà phố</td>
                        <td>Nhà phố 2 tầng có sân vườn</td>
                        <td>Quận 7, TP.HCM</td>
                        <td>4.5 tỷ</td>
                        <td>120m²</td>
                        <td>Đã bán</td>
                        <td>2024-01-15</td>
                        <td>2024-02-03</td>
                        <td><img src="link_hinh_anh_2.jpg" width="50" height="50" alt="Hình 2" /></td>
                        <td>
                            <button type="button" className="btn btn-warning me-2">Sửa</button>
                            <button type="button" className="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>LD003</td>
                        <td>Biệt thự vườn C</td>
                        <td>Biệt thự</td>
                        <td>Biệt thự rộng rãi, nội thất cao cấp</td>
                        <td>Quận 2, TP.HCM</td>
                        <td>10 tỷ</td>
                        <td>300m²</td>
                        <td>Chưa bán</td>
                        <td>2024-02-10</td>
                        <td>2024-02-12</td>
                        <td><img src="link_hinh_anh_3.jpg" width="50" height="50" alt="Hình 3" /></td>
                        <td>
                            <button type="button" className="btn btn-warning me-2">Sửa</button>
                            <button type="button" className="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm bất động sản</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Mã bất động sản</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên bất động sản</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Loại bất động sản</label>
                                        <select className="form-select">
                                            <option value="">-- Chọn loại bất động sản --</option>
                                            <option value="dat-nen">Đất nền</option>
                                            <option value="nha-pho">Nhà phố</option>
                                            <option value="biet-thu">Biệt thự</option>
                                            <option value="can-ho">Căn hộ</option>
                                            <option value="dat-nong-nghiep">Đất nông nghiệp</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Giá</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Diện tích</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình ảnh</label>
                                        <input type="file" className="form-control" accept="image/*" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                                <button type="button" className="btn btn-primary">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminPage>
    )
}

export default Batdongsan
