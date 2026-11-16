import { api } from "./api";
import type {
    AulaTurma,
    Professor,
    AgendarAulaRequest
} from "../types/auth/auth-types";
import type {
    ProximaAulaAluno
} from "../types/aluno/aluno-types";

export async function getAgendaTurma(turmaId: string) {
    const response = await api.get<AulaTurma[]>(
        `/turma/${turmaId}/agenda`
    );

    return response.data;
}

export async function getProfessores() {
    const response = await api.get<Professor[]>(
        "/user/professor"
    );

    return response.data;
}

export async function agendarAulaTurma(
    id: string,
    data: AgendarAulaRequest
) {
    const response = await api.put<AulaTurma>(
        `/turma/agenda/${id}`,
        data
    );

    return response.data;
}

export async function getMinhaProximaAula():
    Promise<ProximaAulaAluno | null> {

    const response = await api.get<ProximaAulaAluno | null>(
        "/turma/minha-proxima-aula"
    );

    return response.data;
}