import * as authService from "../services/authService"
import jwt from 'jsonwebtoken';

// lấy ra tất cả phòng ban
export const getAllAccountController = async (req, res) => {
    try {
        const rs = await authService.getAllAccountsService();
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

//login
export const loginController = async (req, res) => {
    const { email, password } = req.body;
    const pass_word = password;
    try {
        if (!email || !pass_word) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào"
            })
        }

        const rs = await authService.loginService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

//register
export const registerController = async (req, res) => {
    const { email, pass_word, type, employee_id } = req.body;
    console.log(req.body)
    try {
        if (!email || !pass_word || !employee_id || !Number.isInteger(type)) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào"
            })
        }

        const rs = await authService.registerService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}


// sửa
export const updateAccountController = async (req, res) => {
    const { id, email, pass_word, type } = req.body;
    try {
        if (!id || !email || !pass_word || !Number.isInteger(type)) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!",
            });
        }
        const rs = await authService.updateAccountService({ id, email, pass_word, type });
        return res.status(200).json(rs);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};


// xóa
export const deleteAccountController = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu ID tài khoản!",
            });
        }
        const rs = await authService.deleteAccountService(id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// check token
export const checkTokenExpiredController = async (req, res) => {
    const { token } = req.body;

    try {
        // Kiểm tra xem token có tồn tại không
        if (!token) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!"
            });
        }
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({
                err: 1,
                msg: "Token không hợp lệ hoặc không có thời gian hết hạn!"
            });
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < currentTime;

        return res.status(200).json({
            err: 0,
            isExpired,
            msg: isExpired ? "Token đã hết hạn!" : "Token còn hiệu lực."
        });

    } catch (error) {
        // Trả về lỗi nếu có lỗi không mong muốn
        return res.status(500).json({
            err: 2,
            msg: "Lỗi trong quá trình xử lý token!",
            error: error.message
        });
    }
};