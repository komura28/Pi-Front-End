import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { authUser, LoginRequest, RegisterRequest } from "../types/auth/auth-types";
import { LoginApi, Register } from "../services/authService";



interface AuthContextData {
    user: authUser | null;
    setUser: React.Dispatch<React.SetStateAction<authUser | null>>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    control: boolean;
    cadastrar: (data: RegisterRequest) => Promise<void>;
    //cadastrarTurma: (data: RegisterTurmaRequest) => Promise<void>; 
    login: (data: LoginRequest) => Promise<authUser>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<authUser | null>(null);
    const [control, setControl] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
       setControl(false);

    }, []);

    async function login(data: LoginRequest) {
        const response = await LoginApi(data);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setUser(response.user);
        console.log("reponse contexto", response.user) 
        return response.user;
    }

    async function cadastrar(data: RegisterRequest) {
        await Register(data); //UsuarioService
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    }

    const isAuthenticated = !!user;
    const isAdmin = user?.papelUsuario === "ADM";

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                isAdmin,
                cadastrar,
                login,
                control,
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

export { AuthContext };