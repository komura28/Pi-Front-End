export type papelUsuario = "ALUNO" | "ADM";

export interface authUser{
    _id: string;
    name: string;
    cpf: number;
    email: string;
    papelUsuario: papelUsuario;
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude: string;
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
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude: string;
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

export interface EsqueciSenhaRequest{
    email: string;
}

export interface EsqueciSenhaResponse{
    mensagem: string;
}