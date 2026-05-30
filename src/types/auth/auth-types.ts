
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
    description: string

}

export interface authCurso{
    id: string,
    name: string,
    description: string,
    materias: authMateria[]
}

export interface RegisterCursoRequest{
    name: string,
    description: string,
    materias: authMateria[]
}

export interface authTurma{
    id: string,
<<<<<<< HEAD
    curso: string,
    turno: string,
    capacidade: number
}

export interface RegisterTurmaRequest{
    curso: string,
    turno: string,
    capacidade: number
=======
    turno: string,
    capacidade: number,
    curso: authCurso
>>>>>>> 4b0cdb840e4a0f2f5b9b3d00648657cc5b6c6f40
}