import { useNavigate } from "react-router-dom";
import perfilImage from "../assets/perfil.png"
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";




export function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth() as {
        user?: { papelUsuario?: string };
        logout: () => void;
    };
    const [serverError, setServerError] = useState("");
    const [openMenus, setOpenMenus] = useState(false);

    async function handlePerfil() {
        if (user?.papelUsuario === "ALUNO") {
            setOpenMenus(false);
            navigate("/api/perfil");
        } else if (user?.papelUsuario === "ADM") {
            setOpenMenus(false);
            navigate("/app/perfil");
        }
    }

    async function handleLogout() {
        try {
            setServerError("");
            setOpenMenus(false);
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro ao realizar logout.");
        }
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-[#0F172A] px-6">
            <div>
                <p className="text-sm text-white">Bem-vindo a </p>
                <h1 className="text-lg font-semibold text-white">Aticurando!</h1>
            </div>

            <div
                className="relative flex-shrink-0"
                
            >
                <button
                    onClick={() => setOpenMenus((prev) => !prev)}
                    className="cursor-pointer w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                    <img src={perfilImage} alt="Foto de Perfil"
                          className="h-full w-full object-cover"/>
                </button>

                {openMenus && (
                    <div className="absolute right-0 mt-2 flex flex-col gap-1 bg-white border border-slate-200 rounded-md shadow-md w-48 z-20 p-1">
                <button
                    className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-sm"
                    type="button"
                    onClick={() => handlePerfil()}>
                        Meu Perfil
                        
                </button>
                <button 
                    className="cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-sm"
                    type="button"
                    onClick={() => handleLogout()}>
                        Sair da Conta
                </button>

                    </div>
                )}


            </div>
        </header>
    );
}