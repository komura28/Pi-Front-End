import type { RegisterCursoRequest, RegisterTurmaRequest } from "../types/auth/auth-types";
import { RegisterCurso, RegisterTurma } from "./authService";



export async function cadastrarCurso(data: RegisterCursoRequest) {
    await RegisterCurso(data);
}

export async function cadastrarTurma(data: RegisterTurmaRequest) {
    await RegisterTurma(data);
}

