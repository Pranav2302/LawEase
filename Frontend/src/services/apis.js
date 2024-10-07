const BASE_URL = import.meta.env.VITE_BASE_URL;


//auth endpoints 
export const endpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    SENDOTP_API: BASE_URL + "/auth/sendotp",
}