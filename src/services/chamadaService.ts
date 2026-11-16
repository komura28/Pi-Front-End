import { api } from "./api";

import type {
    MatriculaChamada,
    ChamadaProfessor,
    SalvarChamadaDTO,
    FrequenciaAluno,
    HistoricoChamada
} from "../types/professor/chamada-types";

export async function getAlunosDaAula(
    aulaTurmaId: string
): Promise<MatriculaChamada[]> {

    const response = await api.get<MatriculaChamada[]>(
        `/professor/aulas/${aulaTurmaId}/alunos`
    );

    return response.data;
}

export async function getChamadaDaAula(
    aulaTurmaId: string
): Promise<ChamadaProfessor | null> {

    const response = await api.get<ChamadaProfessor | null>(
        `/professor/aulas/${aulaTurmaId}/chamada`
    );

    return response.data;
}

export async function salvarChamada(
    aulaTurmaId: string,
    dados: SalvarChamadaDTO
): Promise<ChamadaProfessor> {

    const response = await api.put<ChamadaProfessor>(
        `/professor/aulas/${aulaTurmaId}/chamada`,
        dados
    );

    return response.data;
}

export async function getFrequenciaDaTurma(
    turmaId: string
): Promise<FrequenciaAluno[]> {

    const response = await api.get<FrequenciaAluno[]>(
        `/professor/turmas/${turmaId}/frequencia`
    );

    return response.data;
}

interface AulaFinalizadaResponse {
    _id: string;
    status: "REALIZADA";
    finalizadaEm: string;
    finalizacaoAntecipada: boolean;
}

export async function finalizarAula(
    aulaTurmaId: string,
    confirmacaoAntecipada = false
): Promise<AulaFinalizadaResponse> {

    const response = await api.patch<AulaFinalizadaResponse>(
        `/professor/aulas/${aulaTurmaId}/finalizar`,
        { confirmacaoAntecipada }
    );

    return response.data;
}

export async function getHistoricoChamadasDaTurma(
    turmaId: string
): Promise<HistoricoChamada[]> {

    const response = await api.get<HistoricoChamada[]>(
        `/professor/turmas/${turmaId}/chamadas`
    );

    return response.data;
}