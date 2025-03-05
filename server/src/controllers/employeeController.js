import * as employeeService from "../services/emloyeeService"

// lấy ra tất cả nhân viên
export const getAllEmployeeController = async (req, res) => {
    console.log(req?.body)
    try {
        const rs = await employeeService.getAllEmployeesService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// lấy theo id
// lấy ra tất cả nhân viên
export const getEmployeeByIdController = async (req, res) => {
    const { employee_id } = req.body;
    try {
        if (!employee_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu bắt buộc!"
            });
        }

        const rs = await employeeService.getEmployeeByIdService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const addEmployeeController = async (req, res) => {
    const { full_name, dob, gender, phone_number, address, department_id, dependent_number } = req.body;
    try {
        console.log(req.body)
        if (!full_name || !dob || !department_id || gender < 0 || !phone_number || !address || !dependent_number < 0) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu bắt buộc!"
            });
        }

        const rs = await employeeService.addEmployeeService({
            full_name,
            dob,
            gender,
            phone_number,
            address,
            department_id,  // Đảm bảo rằng bạn đang truyền `department_id` vào đây
            dependent_number
        });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};



// sửa
export const updateEmployeeController = async (req, res) => {
    const { id, full_name, dob, gender, phone_number, address, department_id, dependent_number } = req.body;
    try {
        if (!id || !full_name || !dob || gender < 0 || !phone_number || !address || dependent_number < 0) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!"
            });
        }
        let rs; 

        if(!department_id) {
            rs = await employeeService.updateEmployeeService({ id, full_name, dob, gender, phone_number, address, dependent_number });            
        } else {
            rs = await employeeService.updateEmployeeByAdService({ id, full_name, dob, gender, phone_number, department_id , address, dependent_number });                        
        }

        return res.status(200).json(rs);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};


// xóa
export const deleteEmployeeController = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu ID nhân viên!"
            });
        }
        const rs = await employeeService.deleteEmployeeService(id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};


// lây ra nhân viên chưa có account
export const getAllEmployeeWithoutAccountController = async (req, res) => {
    try {
        const rs = await employeeService.getEmployeesWithoutAccountService();
        return res.status(200).json(rs);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};


// lây ra nhân viên chưa có salary
export const getEmployeesWithoutSalaryController = async (req, res) => {
    try {
        const rs = await employeeService.getEmployeesWithoutSalaryService();
        return res.status(200).json(rs);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};