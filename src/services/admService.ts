import type {
    RegisterCursoRequest,
    RegisterTurmaRequest,
    RegisterAulaRequest,
    RegisterProfessorRequest
} from "../types/auth/auth-types";

import {
    RegisterCurso,
    RegisterTurma,
    RegisterAula,
    RegisterProfessor
} from "./authService";

export async function cadastrarCurso(data: RegisterCursoRequest) {
    return await RegisterCurso(data);
}

export async function cadastrarTurma(data: RegisterTurmaRequest) {
    await RegisterTurma(data);
}

export async function cadastrarAula(data: RegisterAulaRequest) {
    return await RegisterAula(data);
}

export async function cadastrarProfessor(data: RegisterProfessorRequest, foto?: File) {
    return await RegisterProfessor(data, foto);
}