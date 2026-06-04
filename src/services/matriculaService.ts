import { api } from "./api";
import type { RegisterMatriculaRequest } from "../types/matricula/matricula-types";


export async function getMatricula(): Promise<[]> {
    const response = await api.get("/matricula")
    return response.data;
}




/* export async function AprovarMatricula(data: RegisterMatriculaRequest) {
    const response = await api.post("", data)
    return response.data;
} */




/* export async function aprovarMatricula(data: RegisterMatriculaRequest) {
    await AprovarMatricula(data);
} */

    export async function solicitarMatricula(data: RegisterMatriculaRequest) {
        const response = await api.post("/matricula", data);
        return response.data;
    }
