
import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
    CalendarDays,
    LayoutDashboard,
    UsersRound
} from "lucide-react";

import {
    SideBar,
    type NavigationItem
} from "../SideBar";

import { Header } from "../Header";

const professorNavItems: NavigationItem[] = [
    {
        label: "Visão geral",
        href: "/professor/home",
        icon: <LayoutDashboard size={19} />
    },
    {
        label: "Minha agenda",
        href: "/professor/agenda",
        icon: <CalendarDays size={19} />
    },
    {
        label: "Minhas turmas",
        href: "/professor/turmas",
        icon: <UsersRound size={19} />
    }
];

export function AppProfessorLayout() {
    const [menuMobileAberto, setMenuMobileAberto] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <SideBar
                navigationItems={professorNavItems}
                link="/professor/home"
                matriculasPendentes={0}
                abertaMobile={menuMobileAberto}
                aoFecharMobile={() => setMenuMobileAberto(false)}
            />

            <div className="flex min-h-screen flex-col lg:pl-72">
                <Header
                    mode="PROFESSOR"
                    navigationItems={professorNavItems}
                    onAbrirMenu={() => setMenuMobileAberto(true)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
