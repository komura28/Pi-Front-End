import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaChevronDown } from "react-icons/fa6";


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
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});



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
                                    className="w-full"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenMenus((prev) => ({
                                                ...prev,
                                                [index]: !prev[index],
                                            }))
                                        }
                                        className="flex w-full items-center justify-between
    rounded-lg px-3 py-2
    text-sm font-medium text-muted-foreground
    transition-colors hover:bg-muted hover:text-foreground
                                                "
                                    >
                                        <span>{item.label}</span>

                                        <FaChevronDown
                                            size={15}
                                            className={`transition-transform duration-300 ${openMenus[index] ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {openMenus[index] && (
                                        <div className="ml-2 mt-1 border-l border-slate-200 pl-3">
                                            {item.options?.map((opt, i) => (
                                                <NavLink key={i}
                                                    className={({ isActive }) =>

                                                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground
                                    ${isActive ? 'bg-gray-400 text-foreground' : ''}`}
                                                    to={opt.href!}
                                                >
                                                    {opt.label}

                                                </NavLink>
                                            ))}
                                        </div>
                                    )}


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


                </div>
            </aside >
        </>
    );
}