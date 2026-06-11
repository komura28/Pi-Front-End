import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";
import logo from "../assets/logo.png";


interface NavigationItem {
    label: string;
    href?: string;
    isSelect?: boolean;
    options?: { label: string; href: string }[];
}

interface SideBarProps {
    navigationItems: NavigationItem[];
    link: string;
}



export function SideBar({ navigationItems, link }: SideBarProps) {
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});



    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background bg-[#0F172A]">
                <div className="flex h-24 items-center justify-center border-b">
                    <Link to={link}>
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-28 w-auto object-contain"
                        />
                    </Link>
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
text-sm font-medium text-slate-300
transition-all duration-200
hover:bg-blue-500/20
hover:text-white
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
                                        <div className="ml-2 mt-1 border-l-2 border-emerald-400 pl-3">
                                            {item.options?.map((opt, i) => (
                                                <NavLink key={i}
                                                    className={({ isActive }) =>

                                                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground
                                    ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
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
                                    ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300'}`

                                }
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <a
                        href="https://wa.me/5511962865972"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
            flex items-center justify-center gap-2
            rounded-lg bg-green-500 px-3 py-3
            text-sm font-semibold text-white
            transition
            hover:bg-green-600 hover:shadow-lg
            active:scale-95
        "
                    >
                        Suporte via WhatsApp
                    </a>
                </div>
            </aside >
        </>
    );
}