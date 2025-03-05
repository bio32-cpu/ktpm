import * as salaryService from "../services/salaryService"

// lấy ra lương của tất cả 
export const getAllSalarieController = async (req, res) => {
    try {
        const rs = await salaryService.getAllSalariesService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

// lấy ra lương của nhân viên
export const getSalaryByEmployeeController = async (req, res) => {
    const { employee_id } = req.body;
    try {
        if (!employee_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!",
            });
        }
        const rs = await salaryService.getSalaryByEmployeeService({ employee_id });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// thêm mới 
export const addSalaryController = async (req, res) => {
    const { employee_id, base_salary } = req.body;
    try {
        if (!employee_id || !base_salary) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!",
            });
        }
        const rs = await salaryService.addSalaryService({ employee_id, base_salary });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// cập nhật
export const updateSalaryController = async (req, res) => {
    const { id, employee_id, base_salary } = req.body;
    try {
        if (!id || !employee_id || !base_salary) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!",
            });
        }
        const rs = await salaryService.updateSalaryService({ id, employee_id, base_salary });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// xóa
export const deleteSalaryController = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu ID lương!",
            });
        }
        const rs = await salaryService.deleteSalaryService(id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};
