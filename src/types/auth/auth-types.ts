
export type userRole = "ALUNO" | "ADM";

export interface authUser{
    id: string;
    name: string;
    cpf: number;
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
    cpf: number;
    email: string;
    senha: string;
}