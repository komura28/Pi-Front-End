import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3002/aticurando/v1",
    headers: {"Content-Type": "application/json"}
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})