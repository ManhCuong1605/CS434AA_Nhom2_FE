import React from 'react';
import AdminPage from './AdminPage'; // Import AdminPage để sử dụng layout chung
import 'bootstrap/dist/css/bootstrap.min.css';

function Loaidat() {
    return (
        <AdminPage>
            <h2 className="mb-4">Loại đất</h2>
            <p>Quản lý các loại đất ở đây.</p>
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
        </AdminPage>
    );
}

export default Loaidat;
