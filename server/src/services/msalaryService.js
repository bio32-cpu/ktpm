import db from "../models";

export const getMonthSalariesByEmployeeIdService = ({ employee_id, year, month }) => new Promise(async (resolve, reject) => {
    try {
        const response = employee_id ?
            await db.MonthSalary.findAll({
                where: month ? { employee_id, year, month } : { employee_id, year },
                include: [
                    {
                        model: db.Employee,
                        as: 'employee',  // Đảm bảo sử dụng alias 'employee' nếu đã được thiết lập trong model
                        attributes: ['full_name', 'dependent_number'],
                        include: [
                            {
                                model: db.Department,
                                as: 'department',
                                attributes: ['department_name']
                            },
                            {
                                model: db.Salary,
                                as: 'salary',
                                attributes: ['base_salary']
                            },
                        ]
                    }
                ]
            }) :
            await db.MonthSalary.findAll({
                where: month ? { year, month } : { year },
                include: [
                    {
                        model: db.Employee,
                        as: 'employee',
                        attributes: ['full_name'],
                        include: [
                            {
                                model: db.Department,
                                as: 'department',
                                attributes: ['department_name']
                            }
                        ]
                    }
                ]
            })

        resolve({
            err: 0,
            msg: response.length ? 'Lấy dữ liệu thành công!' : `Không có dữ liệu trong bảng MonthSalary cho employee_id: ${employee_id}.`,
            data: response

        });
    } catch (error) {
        console.log(error)
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng MonthSalary!',
            error: error.message
        });
    }
});

// thêm mới lương theo tháng
export const addSalaryMonthService = ({ employee_id, month, year, salary, deduction, total_salary, tax }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra lương tháng trước (bỏ qua nếu là tháng 1)
            const prevMonth = parseInt(month) - 1;
            let prevSalary = true;

            if (prevMonth > 0) {
                prevSalary = await db.MonthSalary.findOne({
                    where: { employee_id: employee_id, month: `${prevMonth}`, year: year },
                });
            }

            // Nếu tháng trước không tồn tại, báo lỗi
            if (!prevSalary) {
                resolve({
                    err: 2,
                    msg: `Lương cho tháng ${prevMonth}/${year} của nhân viên này chưa được tạo. Vui lòng cập nhật trước!!`,
                });
                return;
            }

            // Tìm hoặc tạo mới lương tháng hiện tại
            const [response, created] = await db.MonthSalary.findOrCreate({
                where: { employee_id, month, year },
                defaults: {
                    employee_id,
                    month,
                    year,
                    deduction,
                    salary,
                    total_salary,
                    tax,
                },
            });

            // Phản hồi
            resolve({
                err: created ? 0 : 2,
                msg: created
                    ? 'Thêm lương mới thành công!'
                    : `Lương cho tháng ${month}/${year} của nhân viên này đã tồn tại.`,
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


// xoa
export const deleteMonthSalaryService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi lương dựa trên id
            const response = await db.MonthSalary.destroy({
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