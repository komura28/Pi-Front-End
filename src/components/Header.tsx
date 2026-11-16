import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";
import { FaRightFromBracket, FaUser } from "react-icons/fa6";
import { AvatarPerfil } from "./AvatarPerfil";

interface NavigationItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface HeaderProps {
    navigationItems?: NavigationItem[] | null;
    link?: string;
    mode: "ALUNO" | "ADM" | "PROFESSOR"
}


export function Header({ navigationItems, link, mode }: HeaderProps) {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [openMenus, setOpenMenus] = useState(false);

    function handlePerfil() {
        setOpenMenus(false);

        if (user?.papelUsuario === "ALUNO") {
            navigate("/api/perfil");
        } else if (user?.papelUsuario === "ADM") {
            navigate("/app/perfil");
        } else if (user?.papelUsuario === "PROFESSOR") {
            navigate("/professor/perfil");
        }
    }

    function handleLogout() {
        setOpenMenus(false);
        logout();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-1000 flex h-20 items-center bg-[#0F172A] px-6 border-b border-slate-800">
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
                {(mode === "ADM" || mode === "PROFESSOR") &&
                    <>
                        <div>
                            <p className="text-sm text-white">Bem-vindo a </p>
                            <h1 className="text-lg font-semibold text-white">Aticurando</h1>
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

                            `flex flex-row items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                                    ${isActive ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white hover:bg-white/10'}`

                        }
                    >
                        {item.icon}
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
                        <AvatarPerfil
                            foto={user?.photo}
                            nome={user?.name}
                            tamanho="sm"
                        />
                    </button>

                    {openMenus && (
                        <>
                            <button
                                type="button"
                                aria-label="Fechar menu"
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenus(false)}
                            />
                            <div className="absolute right-0 mt-2 bg-white rounded-md shadow w-48 p-1 z-50">
                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                                    type="button"
                                    onClick={() => handlePerfil()}>
                                    <FaUser className="shrink-0 text-xs text-gray-600" />
                                    <span>Meu Perfil</span>

                                </button>

                                <button
                                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                                    type="button"
                                    onClick={() => handleLogout()}>
                                    <FaRightFromBracket className="shrink-0 text-xs text-red-600" />
                                    <span>Sair da Conta</span>
                                </button>

                            </div>
                        </>
                    )}

                </div>
            </div>
        </header>
    );
}
