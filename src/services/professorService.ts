import { api } from "./api";

import type {
    AulaTurmaProfessor,
    StatusAula
} from "../types/professor/professor-types";
import type { ResumoChamada } from "../types/professor/chamada-types";

export async function getMinhasAulas(
    status?: StatusAula
): Promise<AulaTurmaProfessor[]> {

    const response = await api.get<AulaTurmaProfessor[]>(
        "/professor/minhas-aulas",
        {
            params: status ? { status } : {}
        }
    );

    return response.data;
}

export async function getResumoChamadas():
    Promise<ResumoChamada[]> {

    const response = await api.get<ResumoChamada[]>(
        "/professor/chamadas/resumo"
    );

    return response.data;
}