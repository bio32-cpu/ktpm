import db from "../models";
import bcrypt from "bcryptjs";  // Nếu mật khẩu đã được mã hóa
import jwt from "jsonwebtoken"; // Để tạo token (JWT)
require('dotenv').config()

export const getAllAccountsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Account.findAll({
            include: [
                {
                    model: db.Employee,
                    as: 'employee', // Đảm bảo sử dụng alias 'employee' nếu có
                    attributes: ['full_name', 'phone_number', 'address']
                }
            ]
        });

        resolve({
            err: 0,
            msg: response.length ? 'Lấy dữ liệu thành công!' : 'Không có dữ liệu trong bảng Account.',
            data: response
        });
    } catch (error) {
        reject(error);
    }
});

export const loginService = async ({ email, password }) => {
    try {
        // Tìm account theo email
        const account = await db.Account.findOne({
            where: { email },
            include: [
                {
                    model: db.Employee,
                    as: 'employee', // Tên alias định nghĩa trong model
                    attributes: ['full_name'],
                    include: [
                        {
                            model: db.Department,
                            as: 'department', // Tên alias định nghĩa trong model
                            attributes: ['id']
                        }
                    ]
                }
            ]
        });

        // Kiểm tra nếu không tìm thấy tài khoản
        if (!account) {
            return {
                err: 1,
                msg: 'Không tìm thấy thông tin email.',
                token: null,
            };
        }

        // Kiểm tra mật khẩu
        // const isPasswordValid = bcrypt.compareSync(password, account.pass_word || '');
        // if (!isPasswordValid) {
        //     return {
        //         err: 2,
        //         msg: 'Mật khẩu không chính xác.',
        //         token: null,
        //     };
        // }

        // console.log(account?.department?.id)

        // Tạo token JWT
        const token = jwt.sign(
            {
                id: account.id,
                email: account.email,
                type: account.type,
                employee_id: account.employee_id,
                name: account.employee?.full_name,
                department_id: account?.employee?.department?.id
            },
            process.env.JWT_SECRET || 'your_jwt_secret', // Đặt JWT_SECRET trong .env để bảo mật
            { expiresIn: '1h' }
        );

        // Trả về thông tin thành công
        return {
            err: 0,
            msg: 'Đăng nhập thành công!',
            token,
        };
    } catch (error) {
        console.error('Lỗi trong loginService:', error);
        return {
            err: 3,
            msg: 'Có lỗi xảy ra, vui lòng thử lại sau.',
            token: null,
        };
    }
};


// đăng ký
const hash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const registerService = ({ email, pass_word, type, employee_id }) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra mã nhân viên có tồn tại hay không
        const check = await db.Employee.findOne({
            where: { id: employee_id }
        });

        if (!check) {
            return resolve({
                err: 2,
                msg: "Mã nhân viên không tồn tại!"
            });
        }

        // Tạo tài khoản mới nếu chưa tồn tại tài khoản cho employee_id
        const [account, created] = await db.Account.findOrCreate({
            where: { employee_id },
            defaults: {
                email,
                pass_word: hash(pass_word),
                employee_id,
                type
            }
        });

        // Tạo token nếu tài khoản mới được tạo thành công
        const token = created && jwt.sign(
            { id: account.id, email: account.email, type: account.type },
            process.env.SECRET_KEY || "your_jwt_secret", // Đặt SECRET_KEY trong .env để bảo mật
            { expiresIn: '1d' }
        );

        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Tạo tài khoản thành công!' : 'Nhân viên đã có tài khoản.',
            token: token || null
        });
    } catch (error) {
        reject({
            err: 1,
            msg: 'Lỗi khi tạo tài khoản!',
            error: error
        });
    }
});

// sửa
export const updateAccountService = ({ id, email, pass_word, type }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Cập nhật bản ghi tài khoản dựa trên id
            const response = await db.Account.update(
                { email, pass_word: hash(pass_word), type },
                {
                    where: { id },
                }
            );

            resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật tài khoản thành công!' : 'Không tìm thấy tài khoản để cập nhật.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi cập nhật tài khoản!',
                error: error,
            });
        }
    });


// xóa
export const deleteAccountService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi tài khoản dựa trên id
            const response = await db.Account.destroy({
                where: { id },
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa tài khoản thành công!' : 'Không tìm thấy tài khoản để xóa.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi xóa tài khoản!',
                error: error.message,
            });
        }
    });

// đổi mật khẩu
export const changePasswordService = ({ id, oldPassword, newPassword }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm tài khoản dựa trên ID
            const account = await db.Account.findOne({ where: { id } });

            if (!account) {
                return resolve({
                    err: 2,
                    msg: 'Tài khoản không tồn tại.',
                });
            }

            // Kiểm tra mật khẩu cũ
            const isCorrectOldPassword = bcrypt.compareSync(oldPassword, account.pass_word);
            if (!isCorrectOldPassword) {
                return resolve({
                    err: 2,
                    msg: 'Mật khẩu cũ không chính xác.',
                });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

            // Cập nhật mật khẩu mới
            await db.Account.update(
                { pass_word: hashedNewPassword },
                { where: { id } }
            );

            resolve({
                err: 0,
                msg: 'Đổi mật khẩu thành công!',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi đổi mật khẩu!',
                error: error
            });
        }
    });
