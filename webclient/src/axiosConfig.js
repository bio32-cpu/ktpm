import axios from "axios";
import reduxStore from "./redux"; // Import hàm reduxStore để lấy store
import { logout } from "./store/actions"; // Import action logout

// Tạo instance của axios với baseURL
const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// Lấy store từ reduxStore
const { store } = reduxStore();

// Thêm interceptor cho request
instance.interceptors.request.use(
  function (config) {
    // Thêm xử lý trước khi gửi request, ví dụ: thêm token vào header nếu cần
    return config;
  },
  function (error) {
    // Xử lý lỗi của request
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
instance.interceptors.response.use(
  function (response) {
    // Xử lý response thành công
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // Thực hiện logout khi nhận được lỗi 401 (Unauthorized)
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default instance;
