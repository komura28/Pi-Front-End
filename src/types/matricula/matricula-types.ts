import type { authTurma, authUser, papelUsuario } from "../auth/auth-types";
import type { IUserDTO } from "../user/user-types";



export interface authMatricula{
    _id: string;
    matricula: IMatricula
    createdAt: string;
}

export interface RegisterMatriculaRequest {
    turma: string;
    interesseServicos: string[];
    comoSoubeCurso: string;
}

export interface IMatricula{
    user: IUserDTO;
    turma: authTurma;
    dataHora: Date;
    frequencia: number;
    status:  "PENDENTE" | "APROVADA" | "RECUSADA" | "CANCELADA";
    interesse_servicos: string[];
    como_soube: string;
    motivoCancelamento?: string;
    createAt?: Date;
    updateAt?: Date;
}