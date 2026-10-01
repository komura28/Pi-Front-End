import { api } from "./api";

import type {
    MatriculaDTO,
    RegisterMatriculaRequest,
    StatusMatricula
} from "../types/matricula/matricula-types";

export async function getMatriculas():Promise<MatriculaDTO[]> {
    const response = await api.get<MatriculaDTO[]>("/matricula");
    return response.data;
}

export async function atualizarStatusMatricula(id: string, status: Exclude<StatusMatricula, "PENDENTE" | "CANCELADA">) {
    const response = await api.put(`/matricula/${id}`, { status });
    return response.data;
}

export async function solicitarMatricula(data: RegisterMatriculaRequest) {
    const response = await api.post("/matricula", data);
    return response.data;
}

export async function getMinhasMatriculas(): Promise<MatriculaDTO[]> {
    const response = await api.get("/matricula/candidaturas");
    return response.data;
}