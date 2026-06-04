

/* export async function AprovarMatricula(data: RegisterMatriculaRequest) {
    const response = await api.post("", data)
    return response.data;
} */

import type { RegisterMatriculaRequest } from "../types/matricula/matricula-types";
import { api } from "./api";

/* export async function aprovarMatricula(data: RegisterMatriculaRequest) {
    await AprovarMatricula(data);
} */

    export async function solicitarMatricula(data: RegisterMatriculaRequest) {
        const response = await api.post("/matricula", data);
        return response.data;
    }