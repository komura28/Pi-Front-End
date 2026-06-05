import { api } from "./api";
import type { RegisterMatriculaRequest } from "../types/matricula/matricula-types";


export async function getMatricula(): Promise<[]> {
    const response = await api.get("/matricula")
    return response.data;
}

export async function AtualizarMatricula(_id: string, status: "APROVADA" | "RECUSADA") {
    const response = await api.put(`/matricula/${_id}`, { status })
    return response.data;
}

export async function solicitarMatricula(data: RegisterMatriculaRequest) {
    const response = await api.post("/matricula", data);
    return response.data;
}

export async function meusCursos() {
    const response = await api.get("/matricula/candidaturas");
    return response.data;
}