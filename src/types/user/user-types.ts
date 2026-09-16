import type { papelUsuario } from "../auth/auth-types";

export interface IUpdateUserDTO{
    name?: string;
    email?: string;

}

export interface IUserDTO{
    name: string;
    cpf: number;
    email: string;
    senhaHash: string;
    papelUsuario: papelUsuario;
    active: boolean;
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude: string;
    createAt?: string;
    updateAt?: string;
}