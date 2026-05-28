import type { authCurso, authUser, LoginRequest, LoginResponse, RegisterCursoRequest, RegisterRequest } from "../types/auth/auth-types";
import { api } from "./api";


export async function Register(data: RegisterRequest): Promise<authUser>{
    const response = await api.post("/register", data)
    return response.data;
}

<<<<<<< HEAD
/*export async function RegisterCurso(data: RegisterCursoRequest): Promise<authCurso> {
    
}*/

export async function getMe() {
    const reponse = await api.get("/me")

    return reponse.data;
}

export async function LoginApi(data: LoginRequest): Promise<LoginResponse>{
    const reponse = await api.post("/login", data)
=======
export async function getMe() {
    const response = await api.get("/auth/me")

    return response;
}

export async function LoginApi(data: LoginRequest): Promise<LoginResponse>{
    const reponse = await api.post("/auth/login", data)
>>>>>>> main
    return reponse.data;
}
