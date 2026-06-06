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
                                    className="flex flex-col items-start gap-1 w-full rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <button
                                    onClick={() => setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }))}
                                    className="text-left w-full bg-transparent outline-none cursor-pointer pr-4 appearance-none text-muted-foreground"
                                    >{item.label}</button>

                                    {openMenus[index] && (
                                        <div>
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