import db from "../models";

export const getAllDepartmentsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Department.findAll({});

        resolve({
            err: 0,
            msg: response.length ? 'Lấy dữ liệu thành công!' : 'Không có dữ liệu trong bảng Department.',
            data: response
        });
    } catch (error) {
        reject({
            err: 2,
            msg: 'Lỗi khi lấy dữ liệu từ bảng Department!',
            error: error.message
        });
    }
});

export const addDepartmentService = ({ department_name }) =>
    new Promise(async (resolve, reject) => {
        try {
            const departmentNameLowerCase = department_name.toString().toLowerCase();

            // Create or find a department record
            const [department, created] = await db.Department.findOrCreate({
                where: { department_name: departmentNameLowerCase },
                defaults: {
                    department_name: departmentNameLowerCase
                }
            });

            resolve({
                err: created ? 0 : 2,
                msg: created
                    ? 'Thêm phòng ban mới thành công!'
                    : 'Phòng ban đã tồn tại.',
                data: department
            });

        } catch (error) {
            console.log(error);
            reject({
                err: 1,
                msg: 'Đã xảy ra lỗi trong quá trình thêm phòng ban.',
                error: error.message
            });
        }
    });


// sửa
export const updateDepartmentService = ({ id, department_name }) =>
    new Promise(async (resolve, reject) => {
        try {
            const departmentNameLowerCase = department_name.toString().toLowerCase();

            const check = await db.Department.findOne({
                where: db.sequelize.where(
                    db.sequelize.fn('LOWER', db.sequelize.col('department_name')),
                    departmentNameLowerCase
                )
            });
            // Cập nhật bản ghi department dựa trên id
            if (!check) {
                const response = await db.Department.update(
                    { department_name },
                    {
                        where: { id },
                    }
                );

                resolve({
                    err: response[0] ? 0 : 2,
                    msg: response[0] ? 'Cập nhật phòng ban thành công!' : 'Không tìm thấy phòng ban để cập nhật.',
                });
            } else {
                resolve({
                    err: 2,
                    msg: "Tên phòng ban đã tồn tại!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });

// xóa
export const deleteDepartmentService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi department dựa trên id
            const response = await db.Department.destroy({
                where: { id },
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa phòng ban thành công!' : 'Không tìm thấy phòng ban để xóa.',
            });
        } catch (error) {
            reject(error);
        }
    });
