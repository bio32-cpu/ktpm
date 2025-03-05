import axiosConfig from "../axiosConfig";

//  lấy thông tin người dùng
export const apiGetInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee/id',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})


//  lấy thông tin người dùng
export const apiUpdateInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// lấy toàn bộ
export const apiAllEmployees = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  tạo mới
export const apiCreateEmployee = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  sửa
export const apiUpdateEmployee = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  xóa
export const apiDeleteEmployee = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/employee/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

