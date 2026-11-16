import type { AulaTurmaProfessor } from
    "../../types/professor/professor-types";

export function podeAcessarChamada(
    aula: AulaTurmaProfessor,
    agora: number = Date.now()
): boolean {

    if (aula.status === "REALIZADA") {
        return true;
    }

    if (aula.status !== "AGENDADA" || !aula.dataInicio) {
        return false;
    }

    const inicio = new Date(aula.dataInicio).getTime();

    return Number.isFinite(inicio) && agora >= inicio;
}

export function mensagemDisponibilidadeChamada(
    aula: AulaTurmaProfessor
): string {

    if (aula.status !== "AGENDADA") {
        return "Chamada indisponível para esta aula.";
    }

    if (!aula.dataInicio) {
        return "A aula ainda não possui horário de início.";
    }

    const inicio = new Date(aula.dataInicio);

    if (Number.isNaN(inicio.getTime())) {
        return "O horário de início da aula é inválido.";
    }

    return `Chamada disponível a partir de ${inicio.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    )}.`;
}