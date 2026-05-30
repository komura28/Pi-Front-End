
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
    name: string
    descricao: string

}

export interface authCurso{
    id: string,
    name: string,
    descricao: string,
    materias: authMateria[]
}

export interface RegisterCursoRequest{
    name: string,
    descricao: string,
    materias: authMateria[]
}