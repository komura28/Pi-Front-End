import { api } from "./api";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string,
    user: {
        name: string,
        email: string,
        role: "admin" | "user"
    };
}

export async function loginRequest(data:LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth", data);

    return response.data;
}