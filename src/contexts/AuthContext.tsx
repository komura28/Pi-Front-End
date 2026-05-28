import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
<<<<<<< HEAD
import type { authUser, LoginRequest, LoginResponse } from "../types/auth/auth-types";
import { LoginApi } from "../services/authService";
import { api } from "../services/api";
=======
import type { authUser, LoginRequest, RegisterRequest } from "../types/auth/auth-types";
import { LoginApi, Register } from "../services/authService";
>>>>>>> 1af11c1ad750e53eba9522caed8e09ff27b053a2

interface AuthContextData {
    user: authUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    cadastrar: (data: RegisterRequest) => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    getMe: () => Promise<authUser>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<authUser | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    async function login(data: LoginRequest) {
        const response = await LoginApi(data);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setUser(response.user);
    }

    async function cadastrar(data: RegisterRequest) {
        await Register(data);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    }

    async function getMe() {
        const response = await api.get("/auth/me")
        
        return response.data;
    }

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "ADM";

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                cadastrar,
                login,
                getMe,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

    
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider")
    }
    return context;
}