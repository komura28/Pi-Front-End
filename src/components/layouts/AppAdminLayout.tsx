import { Outlet } from "react-router-dom";
import { SideBar } from "../SideBar";
import { Header } from "../Header";
import { FaChalkboardTeacher, FaGraduationCap, FaHome, FaUsers } from "react-icons/fa"
import { HiOutlineDocumentCheck } from 'react-icons/hi2';

const adminNavItems = [
    {
        label: "Home",
        href: "/app/home",
        icon: <FaHome/>

    },
    {
        label: "Cursos",
        isSelect: true,
        icon: <FaGraduationCap/>,
        options: [
            { label: "Cadastrar Curso", href: "/app/register-curso" },
            { label: "Listar Cursos", href: "/app/curso" },
        ]
        

    },
    {
        label: "Turmas",
        isSelect: true,
        icon: <FaChalkboardTeacher/>,
        options: [
            {label: "Cadastrar Turma", href: "/app/register-turma"},
            {label: "Listar Turmas", href: "/app/turma"},
        ]

    },
    {
        label: "Matrículas",
        href: "/app/matricula",
        icon: <HiOutlineDocumentCheck/>

    },
    {
        label: "Lista de Usuários",
        href: "/app/user",
        icon: <FaUsers/>
    },

]

export function AppAdminLayout() {
    return (
        <>
            <div className="min-h-screen bg-muted/40">
                <SideBar navigationItems={adminNavItems} link="/app/home" />
                <div className="flex min-h-screen flex-col pl-64">
                    <Header   mode="ADM"/>
                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}