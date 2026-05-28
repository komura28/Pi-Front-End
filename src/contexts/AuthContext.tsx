import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { authUser, LoginRequest, RegisterRequest } from "../types/auth/auth-types";
import { LoginApi, Register } from "../services/authService";

interface AuthContextData {
    user: authUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    cadastrar: (data: RegisterRequest) => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
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