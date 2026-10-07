import { Outlet } from "react-router-dom";
import { SideBar } from "../SideBar";
import { Header } from "../Header";
import { FaChalkboardTeacher, FaGraduationCap, FaHome, FaList, FaPlus, FaUsers } from "react-icons/fa"
import { HiOutlineDocumentCheck } from 'react-icons/hi2';
import { LucideBellRing } from "lucide-react";

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
            { label: "Cadastrar Curso", href: "/app/register-curso", iconF: <FaPlus/> },
            { label: "Listar Cursos", href: "/app/curso", iconF: <FaList/> },
        ]
        

    },
    {
        label: "Turmas",
        isSelect: true,
        icon: <FaChalkboardTeacher/>,
        options: [
            {label: "Cadastrar Turma", href: "/app/register-turma", iconF: <FaPlus/>},
            {label: "Listar Turmas", href: "/app/turma", iconF: <FaList/>},
        ]

    },
    {
        label: "Matrículas",
        href: "/app/matricula",
        icon: <HiOutlineDocumentCheck/>,
        iconContador: <LucideBellRing/>

    },
    {
        label: "Lista de Usuários",
        href: "/app/user",
        icon: <FaUsers/>
    },
    {
        label: "Lista de Alunos",
        href: "/app/aluno",
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