
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
    Award,
    BookOpen,
    CalendarDays,
    ClipboardCheck,
    GraduationCap,
    LayoutDashboard,
    List,
    Plus,
    UserRoundPlus,
    UsersRound
} from "lucide-react";

import {
    SideBar,
    type NavigationItem
} from "../SideBar";

import { Header } from "../Header";
import { getDashboardData } from "../../services/dashboardService";

const adminNavItems: NavigationItem[] = [
    {
        label: "Visão geral",
        href: "/app/home",
        icon: <LayoutDashboard size={19} />
    },
    {
        label: "Cursos",
        icon: <GraduationCap size={19} />,
        options: [
            {
                label: "Listar cursos",
                href: "/app/curso",
                iconF: <List size={16} />
            },
            {
                label: "Cadastrar curso",
                href: "/app/register-curso",
                iconF: <Plus size={16} />
            }
        ]
    },
    {
        label: "Turmas",
        icon: <UsersRound size={19} />,
        options: [
            {
                label: "Listar turmas",
                href: "/app/turma",
                iconF: <List size={16} />
            },
            {
                label: "Planejamento de aulas",
                href: "/app/gerenciar-aulas",
                iconF: <CalendarDays size={16} />
            },
            {
                label: "Alunos por turma",
                href: "/app/aluno",
                iconF: <BookOpen size={16} />
            },
            {
                label: "Matrículas",
                href: "/app/matricula",
                iconF: <ClipboardCheck size={16} />
            },
            {
                label: "Certificados",
                href: "/app/certificados",
                iconF: <Award size={16} />
            },
            {
                label: "Cadastrar turma",
                href: "/app/register-turma",
                iconF: <Plus size={16} />
            }
        ]
    },
    {
        label: "Pessoas",
        icon: <UserRoundPlus size={19} />,
        options: [
            {
                label: "Gerenciar usuários",
                href: "/app/user",
                iconF: <List size={16} />
            },
            {
                label: "Cadastrar professor",
                href: "/app/register-professor",
                iconF: <Plus size={16} />
            }
        ]
    }
];

export function AppAdminLayout() {
    const [matriculasPendentes, setMatriculasPendentes] =
        useState(0);

    const [menuMobileAberto, setMenuMobileAberto] =
        useState(false);

    async function atualizarMatriculasPendentes() {
        const data = await getDashboardData();
        setMatriculasPendentes(data.matriculasPendentes);
    }

    useEffect(() => {
        async function carregarPendencias() {
            try {
                await atualizarMatriculasPendentes();
            } catch (error) {
                console.error(
                    "Erro ao carregar matrículas pendentes:",
                    error
                );
            }
        }

        void carregarPendencias();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <SideBar
                navigationItems={adminNavItems}
                link="/app/home"
                matriculasPendentes={matriculasPendentes}
                abertaMobile={menuMobileAberto}
                aoFecharMobile={() => setMenuMobileAberto(false)}
            />

            <div className="flex min-h-screen flex-col lg:pl-72">
                <Header
                    mode="ADM"
                    navigationItems={adminNavItems}
                    onAbrirMenu={() => setMenuMobileAberto(true)}
                />

                <main className="min-w-0 flex-1 p-4 sm:p-5 lg:p-6 2xl:p-8">
                    <Outlet
                        context={{
                            atualizarMatriculasPendentes
                        }}
                    />
                </main>
            </div>
        </div>
    );
}
