import db from "../models";

export const getAllSalariesService = ({ department_id }) => new Promise(async (resolve, reject) => {
    try {
        const whereCondition = department_id
            ? { "$employee.department_id$": department_id }
            : undefined;

        const response = await db.Salary.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.Employee,
                    as: 'employee', // Đảm bảo sử dụng alias 'employee'
                    attributes: ['id', 'full_name', 'dependent_number'],
                    include: [
                        {
                            model: db.Department,
                            as: 'department',
                            attributes: ['department_name'],
                        },
                    ],
                },
            ],
        });

        resolve({
            err: 0,
            msg: response.length
                ? 'Lấy dữ liệu thành công!'
                : 'Không có dữ liệu trong bảng Salary.',
            data: response,
        });
    } catch (error) {
        console.error(error);
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng Salary!',
            error: error.message,
        });
    }
});

// lấy thông tin lương theo nhân viên
export const getSalaryByEmployeeService = ({ employee_id }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Salary.findOne({
            where: { employee_id },
            include: [
                {
                    model: db.Employee,
                    as: 'employee', // Đảm bảo sử dụng alias 'employee' nếu đã được thiết lập trong model
                    attributes: ['dependent_number'],
                }
            ]
        });

        resolve({
            err: 0,
            msg: response ? 'Lấy dữ liệu thành công!' : 'Không có dữ liệu trong bảng Salary.',
            data: response
        });
    } catch (error) {
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng Salary!',
            error: error.message
        });
    }
});

export const addSalaryService = ({ employee_id, base_salary }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm hoặc tạo mới một bản ghi lương dựa trên employee_id
            const [response, created] = await db.Salary.findOrCreate({
                where: { employee_id },
                defaults: {
                    base_salary,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });

            resolve({
                err: created ? 0 : 2,
                msg: created ? 'Thêm lương mới thành công!' : 'Lương cho nhân viên này đã tồn tại.',
                data: response,
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi thêm lương mới!',
                error: error.message,
            });
        }
    });


export const updateSalaryService = ({ id, employee_id, base_salary }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Cập nhật bản ghi lương dựa trên id
            const response = await db.Salary.update(
                {
                    employee_id,
                    base_salary,
                },
                {
                    where: { id },
                }
            );

            resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật lương thành công!' : 'Không tìm thấy lương để cập nhật.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi cập nhật lương!',
                error: error.message,
            });
        }
    });


export const deleteSalaryService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi lương dựa trên id
            const response = await db.Salary.destroy({
                where: { id },
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa lương thành công!' : 'Không tìm thấy lương để xóa.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi xóa lương!',
                error: error.message,
            });
        }
    });


