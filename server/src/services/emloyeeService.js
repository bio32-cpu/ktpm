import { where } from "sequelize";
import db from "../models";

export const getAllEmployeesService = ({ department_id }) => new Promise(async (resolve, reject) => {
    try {
        const response = department_id ?
            await db.Employee.findAll({
                where: { department_id },
                include: [
                    {
                        model: db.Department,
                        as: 'department',  // Alias của Department trong mối quan hệ với Employee
                        attributes: ['department_name']
                    }
                ]
            }) :
            await db.Employee.findAll({
                include: [
                    {
                        model: db.Department,
                        as: 'department',  // Alias của Department trong mối quan hệ với Employee
                        attributes: ['department_name']
                    }
                ]
            });

        resolve({
            err: 0,
            msg: response.length ? 'Lấy dữ liệu thành công!' : 'Không có dữ liệu trong bảng Employee.',
            data: response
        });
    } catch (error) {
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng Employee!',
            error: error.message
        });
    }
});

// lấy thông tin theo id
export const getEmployeeByIdService = ({ employee_id }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Employee.findOne({
            where: { id: employee_id },
            include: [
                {
                    model: db.Department,
                    as: 'department',  // Alias của Department trong mối quan hệ với Employee
                    attributes: ['department_name']
                },
                {
                    model: db.Account,
                    as: 'account',  // Alias của Department trong mối quan hệ với Employee
                    attributes: ['email']
                }
            ]
        });

        resolve({
            err: response ? 0 : 2,
            msg: response ? 'Lấy dữ liệu thành công!' : 'Không có dữ liệu trong bảng Employee.',
            data: response
        });
    } catch (error) {
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng Employee!',
            error: error.message
        });
    }
});

// thêm mới
export const addEmployeeService = ({ full_name, dob, gender, phone_number, address, dependent_number, department_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Employee.create({
                full_name,
                dob,
                gender,
                phone_number,
                address,
                dependent_number,
                department_id
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Thành công!' : 'Không thành công.'
            });
        } catch (error) {
            console.log(error)
            reject(error)
        }
    });


// sửa
export const updateEmployeeByAdService = ({ id, full_name, dob, gender, phone_number, address, department_id, dependent_number }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm và cập nhật bản ghi employee dựa trên id
            const response = await db.Employee.update(
                {
                    full_name,
                    dob,
                    gender,
                    phone_number,
                    address,
                    department_id,
                    dependent_number,
                },
                {
                    where: { id },
                }
            );

            resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật thành công!' : 'Không tìm thấy nhân viên hoặc cập nhật không thành công.',
            });
        } catch (error) {
            reject(error);
        }
    });

// sửa bởi cá nhân
// sửa
export const updateEmployeeService = ({ id, full_name, dob, gender, phone_number, address, dependent_number }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm và cập nhật bản ghi employee dựa trên id
            const response = await db.Employee.update(
                {
                    full_name,
                    dob,
                    gender,
                    phone_number,
                    address,
                    dependent_number,
                },
                {
                    where: { id },
                }
            );

            resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật thành công!' : 'Không tìm thấy nhân viên hoặc cập nhật không thành công.',
            });
        } catch (error) {
            reject(error);
        }
    });


// xóa
export const deleteEmployeeService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi employee dựa trên id
            const response = await db.Employee.destroy({
                where: { id },
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa thành công!' : 'Không tìm thấy nhân viên để xóa.',
            });
        } catch (error) {
            reject(error);
        }
    });

// lấy ra toàn bộ nhân viên chưa có account
export const getEmployeesWithoutAccountService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Employee.findAll({
                where: {
                    '$account.id$': null, // Điều kiện để lọc nhân viên không có bản ghi liên kết trong bảng Account
                },
                include: [
                    {
                        model: db.Account,
                        as: 'account',
                        attributes: [], // Không cần lấy các thuộc tính của Account
                    },
                ],
                raw: true, // Để dữ liệu được trả về dưới dạng object đơn giản
            });

            resolve({
                err: 0,
                msg: response.length ? 'Lấy danh sách nhân viên thành công!' : 'Không có nhân viên nào không có tài khoản.',
                data: response,
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi lấy danh sách nhân viên!',
                error: error.message,
            });
        }
    });

// lấy ra danh sách employee chưa có bảng lương
export const getEmployeesWithoutSalaryService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Employee.findAll({
                where: {
                    '$salary.id$': null, // Điều kiện để lọc nhân viên không có bản ghi liên kết trong bảng Salary
                },
                include: [
                    {
                        model: db.Salary,
                        as: 'salary',
                        attributes: [], // Không cần lấy các thuộc tính của Salary
                    },
                ],
                raw: true, // Để dữ liệu được trả về dưới dạng object đơn giản
            });

            resolve({
                err: 0,
                msg: response.length ? 'Lấy danh sách nhân viên chưa có lương thành công!' : 'Tất cả nhân viên đã có lương.',
                data: response,
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi lấy danh sách nhân viên chưa có lương!',
                error: error,
            });
        }
    });
