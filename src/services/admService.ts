import type { RegisterCursoRequest, RegisterProfessorRequest, RegisterTurmaRequest } from "../types/auth/auth-types";
import { RegisterCurso, RegisterProfessor, RegisterTurma } from "./authService";



export async function cadastrarCurso(data: RegisterCursoRequest) {
    await RegisterCurso(data);
}

export async function cadastrarTurma(data: RegisterTurmaRequest) {
    await RegisterTurma(data);
}

export async function cadastrarProfessor(data: RegisterProfessorRequest) {
    await RegisterProfessor(data);
}
