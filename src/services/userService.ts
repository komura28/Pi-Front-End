import { api } from "./api";

import type {
    IUpdateUserDTO,
    IUserDTO
} from "../types/user/user-types";

export async function getUsers(): Promise<IUserDTO[]> {
    const response = await api.get<IUserDTO[]>("/user");
    return response.data;
}

export async function editarUser(data: IUpdateUserDTO) {
    const response = await api.put("/auth/edit-me", data);
    return response.data;
}

export async function getUserById(id: string): Promise<IUserDTO> {
    const response = await api.get<IUserDTO>(`/user/${id}`);
    return response.data;
}