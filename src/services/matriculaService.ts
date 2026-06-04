import { api } from "./api";

export async function getMatricula(): Promise<[]> {
    const response = await api.get("/matricula")
    return response.data;
}

export async function AtualizarMatricula(_id: string, status: "APROVADA" | "RECUSADA") {
    const response = await api.put(`/matricula/${_id}`, { status })
    return response.data;
}


