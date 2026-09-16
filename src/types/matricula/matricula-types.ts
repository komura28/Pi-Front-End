import type { authTurma, authUser, papelUsuario } from "../auth/auth-types";



export interface authMatricula{
    _id: string;
    user: authUser;
    turma: authTurma;
    status: "PENDENTE" | "APROVADA" | "RECUSADA";
    papelUsuario: papelUsuario;
    createdAt: string;
}
export interface RegisterMatriculaRequest {
    turma: string;
}

export interface MatriculaForm{
    nome: string;
    dt_nascimento: string;
    telefone_principal: string;
    profissao: string;
    problemas_saude: string;
}