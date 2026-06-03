import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";


const adminNavItems = [
    {
        label: "Home",
        href: "/app/home",

    },
    {
        label: "Cursos",
        isSelect: true,
        options: [
            { label: "Cadastrar Curso", href: "/app/register-curso" },
            { label: "Listar Cursos", href: "/app/curso" },
        ]

    },
    {
        label: "Turmas",
        isSelect: true,
        options: [
            {label: "Cadastrar Turma", href: "/app/register-turma"},
            {label: "Listar Turmas", href: "/app/turma"},
        ]

    },
    {
        label: "Matrículas",
        href: "/app/matricula",

    },

]

export function AppAdminLayout() {
    return (
        <>
            <div className="min-h-screen bg-muted/40">
                <SideBar navigationItems={adminNavItems} />
                <div className="flex min-h-screen flex-col pl-64">
                    <Header />
                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}