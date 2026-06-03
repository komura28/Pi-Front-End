
export type userRole = "ALUNO" | "ADM";

export interface authUser{
    _id: string;
    name: string;
    cpf: string;
    email: string;
    role: userRole;
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
    cpf: string;
    email: string;
    senha: string;
}

export interface authMateria{
    name: string;
    description: string;

}

export interface authCurso{
    _id: string,
    name: string,
    description: string,
    materias: authMateria[]
}

export interface RegisterCursoRequest{
    name: string;
    description: string;
    materias: authMateria[];
}

export interface authTurma{
    _id: string,
    curso: authCurso,
    turno: string,
    capacidade: number,
    dataInicio: string,
    dataFim: string
}

export interface RegisterTurmaRequest{
    curso: string;
    turno: string;
    capacidade: number;
    dataInicio: Date;
    dataFim: Date;
}