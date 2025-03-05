import axiosConfig from "../axiosConfig";

// đăng nhập
export const apiLogin = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/login',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// đăng nhập
export const checkTokenExpired = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/token',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})