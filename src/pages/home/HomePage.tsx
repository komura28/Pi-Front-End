import { useEffect, useState } from "react";
import type { DashboardData } from "../../types/dashboard/dashboard-types";
import { getDashboardData } from "../../services/dashboardService";
import { CardDashboard } from "../../components/CardDashboard";
import { Tabs } from "../../components/Tabs";




export function HomePage() {

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"geral" | "matriculas" | "inativos">("geral");

    useEffect(() => {
        async function carregarDashboardData() {
            try {
                const data = await getDashboardData();
                setDashboardData(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados do curso: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados do curso");
                }
            } finally {
                setLoading(false);
            }
        }
        carregarDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Painel Administrativo
            </h1>
            <Tabs tab={tab} setTab={setTab} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl bg-white p-6 shadow-md border-l-4 border-blue-600">
                    <p className="text-sm text-slate-500">Cursos Ativos</p>
                    <h3 className="text-2xl font-bold">
                        {dashboardData?.totalCursos}
                    </h3>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md border-l-4 border-blue-600">
                    <p className="text-sm text-slate-500">Turmas Ativas</p>
                    <h3 className="text-2xl font-bold">
                        {dashboardData?.totalTurmas}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {
                    tab === "geral" && (
                        <>
                            <CardDashboard title="Total de Matrículas" value={dashboardData?.totalMatriculas ?? "Carregando..."} />
                            <CardDashboard  title="Total de Cursos" value={dashboardData?.totalCursos ?? "Carregando..."} />
                            <CardDashboard  title="Total de Turmas" value={dashboardData?.totalTurmas ?? "Carregando..."} />
                        </>
                    )
                }
                {
                    tab === "matriculas" && (
                        <>
                            <CardDashboard  title="Matrículas Ativas" value={dashboardData?.matriculasAtivas ?? "Carregando..."} />
                            <CardDashboard  title="Matrículas Recusadas" value={dashboardData?.matriculasRecusadas ?? "Carregando..."} />
                            <CardDashboard  title="Matrículas Pendentes" value={dashboardData?.matriculasPendentes ?? "Carregando..."} />
                        </>
                    )
                }
                {
                    tab === "inativos" && (
                        <>
                            <CardDashboard  title="Matrículas Inativas" value={dashboardData?.matriculasCanceladas ?? "Carregando..."} />
                            <CardDashboard  title="Turmas Inativas" value={dashboardData?.turmasInativas ?? "Carregando..."} />
                            <CardDashboard  title="Cursos Inativos" value={dashboardData?.cursosInativos ?? "Carregando..."} />
                        </>
                    )
                }
            </div>
        </div >
    );
}