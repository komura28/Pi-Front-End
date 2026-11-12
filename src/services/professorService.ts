import { api } from "./api";

import type {
    AulaTurmaProfessor,
    StatusAula
} from "../types/professor/professor-types";

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