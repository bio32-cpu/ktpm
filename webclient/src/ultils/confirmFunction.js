import Swal from "sweetalert2";

export const confirmFunction = (callback) => {
    Swal.fire({
        title: "Bạn có chắc muốn xóa dữ liệu không?",
        text: "Dữ liệu không thể khôi phục sau khi xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa"
    }).then((result) => {
        if (result.isConfirmed) {
          callback()
        }
    });
}