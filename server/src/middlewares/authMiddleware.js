import jwt from "jsonwebtoken";
require('dotenv').config()

export const authMiddleware = (req, res, next) => {
    // Lấy token từ tiêu đề yêu cầu (Authorization)
    const token = req.headers['Authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            err: 1,
            msg: 'Access Denied! Token is missing.'
        });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");
        req.user = decoded; // Gắn thông tin người dùng vào req
        next(); // Cho phép tiếp tục tới route
    } catch (error) {
        return res.status(403).json({
            err: 1,
            msg: 'Invalid Token!'
        });
    }
};
