import axiosConfig from "../axiosConfig";

//  lấy thông tin phòng ban
export const apiAllDepartment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/department',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  tạo mới
export const apiCreateDepartment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/department/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  sửa
export const apiUpdateDepartment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/department/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  xóa
export const apiDeleteDepartment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/department/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

