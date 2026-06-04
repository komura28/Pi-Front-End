import type { authCurso, authTurma, authUser } from "../auth/auth-types";

export type userRole = "ALUNO" | "ADM";

export interface authMatricula{
    _id: string;
    user: authUser;
    turma: authTurma;
    status: "PENDENTE" | "APROVADA" | "RECUSADA";
    role: userRole;
}