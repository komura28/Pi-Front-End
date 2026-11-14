import type { AulaTurmaProfessor } from
    "../../types/professor/professor-types";

export function precisaFinalizarAula(
    aula: AulaTurmaProfessor,
    agora: number = Date.now()
): boolean {

    if (
        aula.status !== "AGENDADA" ||
        !aula.dataInicio ||
        !aula.dataFim
    ) {
        return false;
    }

    const inicio = new Date(aula.dataInicio).getTime();
    const fim = new Date(aula.dataFim).getTime();

    if (
        !Number.isFinite(inicio) ||
        !Number.isFinite(fim) ||
        inicio >= fim
    ) {
        return false;
    }

    return fim < agora;
}