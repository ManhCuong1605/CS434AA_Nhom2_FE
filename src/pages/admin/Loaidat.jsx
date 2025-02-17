import React, { useState } from 'react';
import AdminPage from './AdminPage'; // Import AdminPage để sử dụng layout chung
import 'bootstrap/dist/css/bootstrap.min.css';

function Loaidat() {
    const [showModal, setShowModal] = useState(false);
    return (
        <AdminPage>
            <h2 className="mb-4">Loại đất</h2>
            <p>Quản lý các loại đất ở đây.</p>
            <button type="button" className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Thêm</button>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã loại đất</th>
                        <th scope="col">Tên loại đất</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>LD001</td>
                        <td>Loại đất A</td>
                        <td>
                            <button type="button" className="btn btn-warning me-2">Sửa</button>
                            <button type="button" className="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>LD002</td>
                        <td>Loại đất B</td>
                        <td>
                            <button type="button" className="btn btn-warning me-2">Sửa</button>
                            <button type="button" className="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>LD003</td>
                        <td>Loại đất C</td>
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
                                <h5 className="modal-title">Thêm loại đất</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Mã loại đất</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tên loại đất</label>
                                        <input type="text" className="form-control" />
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
    );
}

export default Loaidat;
