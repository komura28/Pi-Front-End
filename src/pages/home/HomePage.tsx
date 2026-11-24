import { useEffect, useState } from "react";
import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    GraduationCap,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { getDashboardData } from "../../services/dashboardService";
import type { DashboardData } from "../../types/dashboard/dashboard-types";

import { ProfessorStatCard } from "../../components/professor/ProfessorStatCard";
import { CardDashboard } from "../../components/CardDashboard";
import { Tabs } from "../../components/Tabs";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type TabType = "geral" | "matriculas" | "inativos";




export function HomePage() {

    const { user } = useAuth();

    const primeiroNome =
        user?.name?.trim().split(/\s+/)[0] || "Administrador";

    const dataAtual = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const [dashboardData, setDashboardData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tab, setTab] = useState<TabType>("geral");

    useEffect(() => {
        let ativo = true;

        async function carregarDashboardData() {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardData();

                if (ativo) {
                    setDashboardData(data);
                }
            } catch (error) {
                if (!ativo) return;

                console.error(
                    "Erro ao carregar dashboard:",
                    error
                );

                setError(
                    "Não foi possível carregar os indicadores administrativos."
                );
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarDashboardData();

        return () => {
            ativo = false;
        };
    }, []);

    const valorIndicador = (valor: number) => {
        if (loading) return "...";
        if (error) return "—";

        return valor;
    };

    const indicadores = [
        {
            titulo: "Cursos Ativos",
            valor: valorIndicador(dashboardData?.totalCursos ?? 0),
            icone: BookOpen,
        },
        {
            titulo: "Turmas Ativas",
            valor: valorIndicador(dashboardData?.totalTurmas ?? 0),
            icone: GraduationCap,
        },
        {
            titulo: "Matrículas Pendentes",
            valor: valorIndicador(
                dashboardData?.matriculasPendentes ?? 0
            ),
            icone: ClipboardList,
        },
    ];

    const totalMatriculas = dashboardData
        ? dashboardData.matriculasAtivas +
        dashboardData.matriculasPendentes +
        dashboardData.matriculasRecusadas +
        dashboardData.matriculasCanceladas
        : 0;

    const totalCursos = dashboardData
        ? dashboardData.totalCursos +
        dashboardData.cursosInativos
        : 0;

    const totalTurmas = dashboardData
        ? dashboardData.totalTurmas +
        dashboardData.turmasInativas
        : 0;


    return (
        <div className="@container mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-5 text-white shadow-lg sm:p-6 lg:p-8">

                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2 text-blue-200">
                        <ShieldCheck size={20} />

                        <span className="text-sm font-semibold tracking-wide">
                            PAINEL ADMINISTRATIVO
                        </span>
                    </div>

                    <h1 className="break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Olá, {primeiroNome}!
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                        Acompanhe os indicadores do Aticurando
                        e gerencie as atividades do projeto
                        em um só lugar.
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-200 sm:mt-6 sm:text-sm">
                        <CalendarDays size={18} className="shrink-0" />
                        <span className="capitalize">
                            {dataAtual}
                        </span>
                    </div>
                </div>

                <ShieldCheck
                    size={220}
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -bottom-16 hidden rotate-[-15deg] text-white/10 md:block"
                />
            </section>


            <section
                aria-label="Indicadores administrativos"
                className="w-full min-w-0"
            >
                <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2">
                    <div className="grid w-full min-w-[690px] grid-cols-3 gap-3 sm:gap-4">

                        {indicadores.map((indicador) => (
                            <ProfessorStatCard
                                key={indicador.titulo}
                                titulo={indicador.titulo}
                                valor={indicador.valor}
                                icone={indicador.icone}
                            />
                        ))}

                    </div>
                </div>
            </section>


            {!loading && !error && dashboardData && (
                <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 @5xl:flex-row @5xl:items-center @5xl:justify-between">

                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                            <ClipboardList size={26} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-slate-800">
                                Matrículas pendentes
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {dashboardData.matriculasPendentes > 0
                                    ? `Você possui ${dashboardData.matriculasPendentes} matrícula(s) aguardando análise.`
                                    : "Nenhuma matrícula aguardando análise no momento."}
                            </p>
                        </div>
                    </div>

                    {dashboardData.matriculasPendentes > 0 && (
                        <Link
                            to="/app/matricula"
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 @5xl:w-auto"
                        >
                            Analisar matrículas
                            <ArrowRight size={18} />
                        </Link>
                    )}

                </section>
            )}

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Indicadores do Projeto
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Visualize os dados gerais, as matrículas
                        e os registros inativos do Aticurando.
                    </p>
                </div>

                <Tabs tab={tab} setTab={setTab} />

                {loading ? (
                    <p className="text-slate-500">
                        Carregando indicadores...
                    </p>
                ) : error ? (
                    <p role="alert" className="text-red-600">
                        {error}
                    </p>
                ) : dashboardData ? (
                    <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2">
                        <div className="grid w-full min-w-[690px] grid-cols-3 gap-3 sm:gap-4">

                            {tab === "geral" && (
                                <>
                                    <CardDashboard
                                        title="Total de Matrículas"
                                        value={totalMatriculas}
                                        className="border-l-blue-600"
                                    />

                                    <CardDashboard
                                        title="Total de Cursos"
                                        value={totalCursos}
                                        className="border-l-blue-600"
                                    />

                                    <CardDashboard
                                        title="Total de Turmas"
                                        value={totalTurmas}
                                        className="border-l-blue-600"
                                    />
                                </>
                            )}

                            {tab === "matriculas" && (
                                <>
                                    <CardDashboard
                                        title="Matrículas Aprovadas"
                                        value={dashboardData.matriculasAtivas}
                                        className="border-l-green-600"
                                    />

                                    <CardDashboard
                                        title="Matrículas Recusadas"
                                        value={dashboardData.matriculasRecusadas}
                                        className="border-l-red-600"
                                    />

                                    <CardDashboard
                                        title="Matrículas Pendentes"
                                        value={dashboardData.matriculasPendentes}
                                        className="border-l-amber-500"
                                    />
                                </>
                            )}

                            {tab === "inativos" && (
                                <>
                                    <CardDashboard
                                        title="Matrículas Canceladas"
                                        value={dashboardData.matriculasCanceladas}
                                        className="border-l-slate-500"
                                    />

                                    <CardDashboard
                                        title="Turmas Inativas"
                                        value={dashboardData.turmasInativas}
                                        className="border-l-slate-500"
                                    />

                                    <CardDashboard
                                        title="Cursos Inativos"
                                        value={dashboardData.cursosInativos}
                                        className="border-l-slate-500"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ) : null}
            </section>
        </div >
    );
}