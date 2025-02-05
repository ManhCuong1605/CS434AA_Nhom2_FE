import React from 'react';
import AdminPage from './AdminPage'; // Import AdminPage để sử dụng layout chung

function Loaidat() {
    return (
        <AdminPage>
            <h2 className="mb-4">Loại đất</h2>
            <p>Quản lý các loại đất ở đây.</p>
            {/* Thêm nội dung cho trang Loaidat tại đây */}
        </AdminPage>
    );
}

export default Loaidat;
