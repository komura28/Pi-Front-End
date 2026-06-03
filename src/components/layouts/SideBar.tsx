import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


interface NavigationItem {
  label: string;
  href?: string;
  isSelect?: boolean;
  options?: { label: string; href: string }[];
}

interface SideBarProps {
  navigationItems: NavigationItem[];
}



export function SideBar({ navigationItems }: SideBarProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [serverError, setServerError] = useState("");
    const [select, setSelect] = useState("");

    async function handleLogout() {
        try {
            setServerError("");
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro ao realizar logout.");
        }
    }

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background">
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-2">
                        <div>
                            <strong className="block leading-none">Aticurando</strong>
                            <span className="text-xs text-muted-foreground">
                                Curso de Palhaços
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 p-3">
                    {navigationItems.map((item, index) => {
                        if (item.isSelect) {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <select
                                    value = {select}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                navigate(e.target.value);
                                            } setSelect("");
                                        }}
                                        className="w-full bg-transparent outline-none cursor-pointer pr-4 appearance-none text-muted-foreground"
                                        defaultValue=""
                                    >
                                        <option value="" disabled hidden>{item.label}</option>

                                        {item.options?.map((opt, i) => (
                                            <option key={i} value={opt.href} className="bg-background text-foreground">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }
                        return (
                            < NavLink
                                key={item.href}
                                to={item.href!}
                                end={item.href === "/"}
                                className={({ isActive }) =>

                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground
                                    ${isActive ? 'bg-gray-400 text-foreground' : ''}`

                                }
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm font-medium">Organização atual</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Aticurando TOP 1 Atibaia
                        </p>
                    </div>
                    {serverError && (
                        <span className="text-xs font-medium text-red-500 block px-1">
                            {serverError}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        Sair da conta
                    </button>
                </div>
            </aside >
        </>
    );
}