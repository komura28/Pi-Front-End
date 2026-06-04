import type { authCurso, authTurma, authUser, LoginRequest, LoginResponse, RegisterCursoRequest, RegisterRequest, RegisterTurmaRequest } from "../types/auth/auth-types";
import { api } from "./api";


export async function Register(data: RegisterRequest): Promise<authUser> {
    const response = await api.post("/auth/register", data)
    return response.data;
}

export async function RegisterCurso(data: RegisterCursoRequest): Promise<authCurso> { 
    const response = await api.post("/curso", data)
    return response.data
}

 export async function RegisterTurma(data: RegisterTurmaRequest): Promise<authTurma> { 
    const response = await api.post("/turma", data)
    return response.data
 }

export async function getMe() {
    const response = await api.get("/auth/me")

    return response.data;
}

export async function deletarCursoAPI(_id: string) {    
    const response = await api.delete(`/curso/${_id}`)
    return response.data;
}

export async function LoginApi(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post("/auth/login", data)
    return response.data;
}

export async function getCurso() {
    const response = await api.get("/curso")

    return response.data;
}

export async function getTurma() {
    const response = await api.get("/turma")
    return response.data;
}
