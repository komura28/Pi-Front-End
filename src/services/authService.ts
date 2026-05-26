import type { authUser, LoginRequest, LoginResponse, RegisterRequest } from "../types/auth/auth-types";
import { api } from "./api";


export async function Register(data: RegisterRequest): Promise<authUser>{
    const response = await api.post("/register", data)
    return response.data;
}

export async function LoginApi(data: LoginRequest): Promise<LoginResponse>{
    const reponse = await api.post("/login", data)
    return reponse.data;
}
