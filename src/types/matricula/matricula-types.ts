import type { authTurma, authUser, papelUsuario } from "../auth/auth-types";



export interface authMatricula{
    _id: string;
    user: authUser;
    turma: authTurma;
    status: "PENDENTE" | "APROVADO" | "RECUSADO";
    papelUsuario: papelUsuario;
}
export interface RegisterMatriculaRequest {
    turma: string;
}