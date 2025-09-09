import Swal from 'sweetalert2';
export const showLoading = (title = "Đang xử lý...") => {
    Swal.fire({
        title,
        didOpen: () => {
            Swal.showLoading(); // hiển thị spinner
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
    });
};
export const hideLoading = () => {
    Swal.close(); // đóng popup
};