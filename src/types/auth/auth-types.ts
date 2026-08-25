export type papelUsuario = "ALUNO" | "ADM";

export interface authUser{
    _id: string;
    name: string;
    cpf: number;
    email: string;
    papelUsuario: papelUsuario;
}

export interface LoginRequest{
    email: string;
    senha: string;
}

export interface LoginResponse{
    token: string;
    user: authUser;
}

export interface RegisterRequest{
    name: string;
    cpf: number;
    email: string;
    senha: string;
    confirmarSenha: string;
}

export interface authMateriaInput{
    name: string;
    description: string;
}

export interface authMateria extends authMateriaInput{
    _id: string;

}

export interface authCursoMateria{
    materia: authMateria;
}

export interface authCurso{
    _id: string,
    name: string,
    description: string,
    materias: authCursoMateria[]
}

export interface RegisterCursoRequest{
    name: string;
    description: string;
    materias: authMateriaInput[];
}

export interface authTurma{
    _id: string,
    curso: authCurso,
    turno: string,
    capacidade: number,
    dataInicio: string,
    dataFim: string
}

export interface TurmaMatricula{
    turma: authTurma;
    vagasDisponiveis: number;
}

export interface RegisterTurmaRequest{
    curso: string;
    turno: string;
    capacidade: number;
    dataInicio: Date;
    dataFim: Date;
}