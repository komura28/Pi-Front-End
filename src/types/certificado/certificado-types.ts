export interface AlunoElegibilidade {
    matriculaId: string;
    alunoId: string;
    nome: string;
    email: string | null;
    presentes: number;
    faltas: number;
    aulasContabilizadas: number;
    frequenciaPercentual: number | null;
    elegivel: boolean;
    motivos: string[];
}

export interface ElegibilidadeTurma {
    turma: {
        id: string;
        curso: string;
        turno: string;
    };

    frequenciaMinima: number;

    resumo: {
        aulasObrigatorias: number;
        aulasRealizadas: number;
        aulasCanceladas: number;
        cargaHorariaMinutos: number;
        cargaHorariaHoras: number;
        cargaHorariaValida: boolean;
        turmaConcluida: boolean;
        alunosAprovados: number;
        alunosElegiveis: number;
    };

    alunos: AlunoElegibilidade[];
}

export interface CertificadoEmitido {
    _id: string;
    matricula?: string;
    aluno?: string;
    nomeAluno: string;
    nomeCurso: string;
    turno?: string;
    cargaHorariaMinutos: number;
    frequenciaPercentual: number;
    codigoVerificacao: string;
    emitidoEm: string;
}

export interface ResultadoEmissao {
    id: string;
    codigoVerificacao: string;
    nomeAluno: string;
    nomeCurso: string;
    cargaHorariaMinutos: number;
    frequenciaPercentual: number;
    emitidoEm: string;
}

export type ResultadoValidacao =
    | { valido: false }
    | {
        valido: true;
        codigoVerificacao: string;
        nomeAluno: string;
        nomeCurso: string;
        cargaHorariaHoras: number;
        emitidoEm: string;
    };
