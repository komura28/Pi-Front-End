import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { SideBar } from "../SideBar";
import { FaCalendarAlt, FaHome } from "react-icons/fa";

const professorNavItems = [
    {
        label: "Home",
        href: "/professor/home",
        icon: <FaHome />,
    },
    {
        label: "Minha Agenda",
        href: "/professor/agenda",
        icon: <FaCalendarAlt />
    }
];

export function AppProfessorLayout() {
    return (
        <div className="min-h-screen bg-muted/40">
            <SideBar
                navigationItems={professorNavItems}
                link="/professor/home"
                matriculasPendentes={0}
            />

            <div className="flex min-h-screen flex-col pl-64">
                <Header mode="PROFESSOR" />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}