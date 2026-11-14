import type { StatusAula } from "./professor-types";

export type StatusPresenca = "PRESENTE" | "FALTA";

export interface MatriculaChamada {
    _id: string;
    status: string;
    user: {
        _id: string;
        name: string;
        email: string;
    } | null;
}

export interface RegistroPresenca {
    matricula: string;
    status: StatusPresenca;
}

export interface ChamadaProfessor {
    _id: string;
    aulaTurma: string;
    professor: string;
    registros: RegistroPresenca[];
    observacao?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SalvarChamadaDTO {
    registros: RegistroPresenca[];
    observacao?: string;
}

export interface ResumoChamada {
    aulaTurmaId: string;
    atualizadoEm: string | null;
}

export interface FrequenciaAluno {
    matriculaId: string;
    presentes: number;
    faltas: number;
    aulasContabilizadas: number;
    frequenciaPercentual: number | null;
}

export interface HistoricoChamada {
    aulaTurmaId: string;
    titulo: string;

    dataInicio: string | null;
    dataFim: string | null;

    status: StatusAula;

    presentes: number;
    faltas: number;

    observacao: string;

    criadaEm: string | null;
    atualizadaEm: string | null;
}