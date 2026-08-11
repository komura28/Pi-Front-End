import { Link, NavLink, useNavigate } from "react-router-dom";
import perfilImage from "../assets/perfil.png"
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

interface NavigationItem {
    label: string;
    href?: string;
}

interface HeaderProps {
    navigationItems?: NavigationItem[] | null;
    link?: string;
    mode: "ALUNO" | "ADM"
}


export function Header({ navigationItems, link, mode }: HeaderProps) {

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
        <header className="sticky top-0 z-10 flex h-20 items-center bg-[#0F172A] px-6 border-b border-slate-800">
            <div className="flex-1 flex items-center">
                {mode === "ALUNO" &&
                    <>
                        <div className="flex h-16 items-center border-b px-6">
                            <div className="flex items-center gap-2 p-12">
                                <div>
                                    <Link to={link ?? "/"}>
                                        <img src={logo} alt="Logo" className="h-15  w-auto object-contain" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {mode === "ADM" &&
                    <>
                        <div>
                            <p className="text-sm text-white">Bem-vindo a </p>
                            <h1 className="text-lg font-semibold text-white">Aticurando!</h1>
                        </div>


                    </>
                }
            </div>
            <nav className="flex-1 flex justify-center gap-4">
                {navigationItems?.map((item) => (

                    < NavLink
                        key={item.href}
                        to={item.href!}
                        className={({ isActive }) =>

                            `px-3 py-2 rounded-lg text-sm font-medium transition
                                    ${isActive ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-white/10'}`

                        }
                    >
                        {item.label}
                    </NavLink>
                )
                )}
            </nav>

            <div className="flex-1 flex justify-end">
                <div
                    className="relative"

                >
                    <button
                        onClick={() => setOpenMenus((prev) => !prev)}
                        className="w-auto h-15 rounded-full overflow-hidden cursor-pointer object-contain">
                        <img src={perfilImage} alt="Foto de Perfil"
                            className="w-full h-full object-cover" />
                    </button>

                    {openMenus && (
                        <div className="absolute right-0 mt-2 bg-white rounded-md shadow w-48 p-1">
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                                type="button"
                                onClick={() => handlePerfil()}>
                                Meu Perfil

                            </button>
                            <button
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                                type="button"
                                onClick={() => handleLogout()}>
                                Sair da Conta
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}
