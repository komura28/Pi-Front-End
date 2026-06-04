import { api } from "./api";

export async function getMatricula(): Promise<[]> {
    const response = await api.get("/matricula")
    return response.data;
}


