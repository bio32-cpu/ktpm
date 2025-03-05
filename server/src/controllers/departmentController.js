import * as departmentService from "../services/departmentService"

// lấy ra tất cả phòng ban
export const getAllDepartmentController = async (req, res) => {
    try {
        const rs = await departmentService.getAllDepartmentsService();
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// thêm mới
export const addDepartmentController = async (req, res) => {
    const { department_name } = req.body;
    try {
        if (!department_name) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu tên phòng ban!"
            });
        }
        const rs = await departmentService.addDepartmentService({ department_name });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// cập nhật
export const updateDepartmentController = async (req, res) => {
    const { id, department_name } = req.body;
    try {
        if (!id || !department_name) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!"
            });
        }
        const rs = await departmentService.updateDepartmentService({ id, department_name });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// xóa
export const deleteDepartmentController = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu ID phòng ban!"
            });
        }
        const rs = await departmentService.deleteDepartmentService(id);
        return res.status(200).json(rs);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};
