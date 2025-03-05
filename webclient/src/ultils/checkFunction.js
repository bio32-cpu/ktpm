import { toast } from 'react-toastify';

export const validateField = (name, value) => {
  let error = "";
  switch (name) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = !emailRegex.test(value) ? "Không đúng định dạng email" : "";
      break;
    case "pass_word":
      error = value.length < 8 ? "Mật khẩu phải lớn hơn hoặc bằng 8 ký tự" : "";
      break;
    case "phone_number":
      if (!/^\d+$/.test(value)) {
        error = "Số điện thoại phải là chuỗi số";
      } else if (value.length < 8) {
        error = "Số điện thoại phải có ít nhất 8 ký tự";
      } else {
        error = ""; // Không có lỗi
      }
      break;
    default:
      // Check if value is a string, then apply trim; otherwise, check for integer and empty string
      error = typeof value === "string" 
        && value.trim() === "" ? `Không được bỏ trống thông tin ${value}` : ""
      console.log(value)
      break;
  }
  return error;
};


export const handleCheckError = (data) => {
  let newErrors = {};
  Object.keys(data).forEach((key) => {
    const error = validateField(key, data[key]);
    if (error) newErrors[key] = error;
  });

  if (Object.keys(newErrors).length !== 0) {
    Object.values(newErrors).forEach((error) => {
      toast.error(error);
    });
    return true;
  }
  return false;
}