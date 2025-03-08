import axios from "axios";

export const newRequest=axios.create({
    baseURL:"http://localhost:8000/api/v1",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

const api=axios.create({
    baseURL:"http://localhost:8000/api/v1"
})
export const googleAuth = (code: any) => api.get(`/users/google?code=${code}`)