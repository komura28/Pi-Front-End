import type { authUser } from "../types/auth/auth-types";
import { api } from "./api";
import type { IUpdateUserDTO } from "../types/user/user-types";



export async function findAll(): Promise<authUser[]> {
    const response = await api.get("/users")
    return response.data;
}

export async function editarUser(data: IUpdateUserDTO) {
    const response = await api.put("/auth/edit-me", data)
    return response.data;
}