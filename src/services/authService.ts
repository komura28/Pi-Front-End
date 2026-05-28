import type { authUser, LoginRequest, LoginResponse, RegisterRequest } from "../types/auth/auth-types";
import { api } from "./api";


export async function Register(data: RegisterRequest): Promise<authUser>{
    const response = await api.post("/auth/register", data)
    return response.data;
}

export async function getMe() {
    const response = await api.get("/auth/me")

    return response;
}

export async function LoginApi(data: LoginRequest): Promise<LoginResponse>{
    const reponse = await api.post("/auth/login", data)
    return reponse.data;
}
