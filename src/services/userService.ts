import type { authUser } from "../types/auth/auth-types";
import { api } from "./api";



export async function findAll(): Promise<authUser[]> {
    const response = await api.get("/users")
    return response.data;
}