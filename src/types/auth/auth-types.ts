
export type userRole = "ALUNO" | "ADMIN";

export interface authUser{
    id: string;
    name: string;
    cpf: number;
    email: string;
    role: userRole;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginResponse{
    token: string;
    user: authUser;
}

export interface RegisterRequest{
    name: string;
    cpf: number;
    email: string;
    password: string;
}