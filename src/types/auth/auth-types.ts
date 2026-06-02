
export type userRole = "ALUNO" | "ADM";

export interface authUser{
    id: string;
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
    id: string;
    name: string;
    description: string;
    materias: authMateria[];
}

export interface RegisterCursoRequest{
    name: string;
    description: string;
    materias: authMateria[];
}

export interface authTurma{
    id: string;
    curso: string;
    turno: "Manha" | "Tarde" | "Noite";
    capacidade: number;
    dataInicio: string;
    dataFim: string;
}

export interface RegisterTurmaRequest{
    curso: string;
    turno: string;
    capacidade: number;
    dataInicio: Date;
    dataFim: Date;
}