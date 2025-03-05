import axiosConfig from "../axiosConfig";

//  lấy thông tin phòng ban
export const apiAllMonthSalaries = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/msalary',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})


//  tạo mới
export const apiCreateMonthSalary = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/msalary/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})


// xoa
//  tạo mới
export const apiDeleteSalaryTax = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/msalary/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
