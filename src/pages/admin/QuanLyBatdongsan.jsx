import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import nhaDatApi from '../../api/NhaDatApi';
import Swal from 'sweetalert2';

function Batdongsan() {
    const [showModal, setShowModal] = useState(false);
    const [nhaDatList, setNhaDatList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        MaNhaDat: "",
        TenNhaDat: "",
        LoaiNhaDat_id: "",
        MoTa: "",
        GiaBan: "",
        DienTich: "",
        Huong: "",
        TrangThai: "",
        HinhAnh: "",
        diaChi: {
            SoNha: "",
            Duong: "",
            Phuong: "",
            Quan: "",
            ThanhPho: ""
        }
    });

    useEffect(() => {
        fetchNhaDat();
    }, []);

    const fetchNhaDat = async () => {
        try {
            const response = await nhaDatApi.getAll();
            setNhaDatList(response.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                await nhaDatApi.update(formData.id, formData);
                Swal.fire('Cập nhật thành công!', '', 'success');
            } else {
                await nhaDatApi.add(formData);
                Swal.fire('Thêm thành công!', '', 'success');
            }
            fetchNhaDat();
            closeModal();
        } catch (error) {
            Swal.fire('Lỗi!', 'Vui lòng thử lại.', 'error');
        }
    };

    const handleEdit = (nhaDat) => {
        setFormData(nhaDat);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận xóa?",
                text: "Không thể hoàn tác!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });
            if (result.isConfirmed) {
                await nhaDatApi.delete(id);
                fetchNhaDat();
                Swal.fire('Xóa thành công!', '', 'success');
            }
        } catch (error) {
            Swal.fire('Lỗi!', 'Không thể xóa nhà đất.', 'error');
        }
    };

    const openModal = () => {
        setFormData({
            MaNhaDat: "",
            TenNhaDat: "",
            LoaiNhaDat_id: "",
            MoTa: "",
            GiaBan: "",
            DienTich: "",
            Huong: "",
            TrangThai: "",
            HinhAnh: "",
            diaChi: {
                SoNha: "",
                Duong: "",
                Phuong: "",
                Quan: "",
                ThanhPho: ""
            }
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <AdminPage>
            <h2 className="mb-4">Bất động sản</h2>
            <button type="button" className="btn btn-primary mb-3" onClick={openModal}>Thêm bất động sản</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã nhà đất</th>
                        <th>Tên nhà đất</th>
                        <th>Loại</th>
                        <th>Mô tả</th>
                        <th>Địa chỉ</th>
                        <th>Giá</th>
                        <th>Diện tích</th>
                        <th>Hướng</th>
                        <th>Trạng thái</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {nhaDatList.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.MaNhaDat}</td>
                            <td>{item.TenNhaDat}</td>
                            <td>{item.LoaiNhaDat_id}</td>
                            <td>{item.MoTa}</td>
                            <td>{`${item.DiaChi?.SoNha}, ${item.DiaChi?.Duong}, ${item.DiaChi?.Phuong}, ${item.DiaChi?.Quan}, ${item.DiaChi?.ThanhPho}`}</td>
                            <td>{item.GiaBan}</td>
                            <td>{item.DienTich}</td>
                            <td>{item.Huong}</td>
                            <td>{item.TrangThai === 1 ? 'Đang bán' : 'Đã bán'}</td>
                            <td><img src={item.HinhAnh} alt="Hình ảnh" width="50" /></td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Sửa</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminPage>
    );
}

export default Batdongsan;
