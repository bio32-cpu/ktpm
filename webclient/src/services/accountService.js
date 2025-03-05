import axiosConfig from "../axiosConfig";

// lấy toàn bộ
export const apiAllAccounts= (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/account',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// lấy toàn bộ
export const apiAllWhithoutAccount= (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/employee/noac',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  tạo mới
export const apiCreateAccount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/register',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  sửa
export const apiUpdateAccount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

//  xóa
export const apiDeleteAccount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

