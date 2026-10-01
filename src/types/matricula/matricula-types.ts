import type {
    authTurma
} from "../auth/auth-types";

import type {
    IUserDTO
} from "../user/user-types";

export type StatusMatricula =
    | "PENDENTE"
    | "APROVADA"
    | "RECUSADA"
    | "CANCELADA";

export interface MatriculaDTO {
    _id: string;
    user: IUserDTO;
    turma: authTurma;

    dataHora: string;
    frequencia: number;

    status: StatusMatricula;

    interesse_servicos: string[];
    como_soube: string;

    motivoCancelamento?: string;

    createdAt: string;
    updatedAt: string;
}

export interface RegisterMatriculaRequest {
    turma: string;
    interesseServicos: string[];
    comoSoubeCurso: string;
}