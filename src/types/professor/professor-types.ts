export type StatusAula =
    | "PENDENTE"
    | "AGENDADA"
    | "REALIZADA"
    | "CANCELADA";

export interface AulaTurmaProfessor {
    _id: string;

    aula: {
        _id: string;
        titulo: string;
        descricao: string;
        duracao: number;
        materiaId: string;
    } | null;

    turma: {
        _id: string;
        turno: "MANHA" | "TARDE" | "NOITE";
        curso: {
            _id: string;
            name: string;
        } | null;
    } | null;

    dataInicio?: string | null;
    dataFim?: string | null;

    professor: string;
    status: StatusAula;
}