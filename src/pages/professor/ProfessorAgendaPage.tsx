import { useEffect, useState } from "react";
import { CalendarDays, Clock3, BookOpen, Hourglass, CheckCircle2, CalendarCheck2 } from "lucide-react";

import { getMinhasAulas } from "../../services/professorService";

import type { AulaTurmaProfessor, StatusAula } from
    "../../types/professor/professor-types";
import { ProfessorStatCard } from "../../components/professor/ProfessorStatCard";
import { AulaDetalhesModal } from "../../components/professor/AulaDetalhesModal";

const filtros: {
    label: string;
    valor: StatusAula | "TODAS";
}[] = [
        { label: "Todas", valor: "TODAS" },
        { label: "Agendadas", valor: "AGENDADA" },
        { label: "Realizadas", valor: "REALIZADA" },
        { label: "Pendentes", valor: "PENDENTE" },
        { label: "Canceladas", valor: "CANCELADA" }
    ];

function obterDataLocal(valor?: string | null): string | null {
    if (!valor) return null;

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

export function ProfessorAgendaPage() {
    const [aulas, setAulas] = useState<AulaTurmaProfessor[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const [filtroStatus, setFiltroStatus] =
        useState<StatusAula | "TODAS">("TODAS");

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    const [aulaSelecionada, setAulaSelecionada] =
        useState<AulaTurmaProfessor | null>(null);

    useEffect(() => {
        let ativo = true;

        async function carregarAgenda() {
            try {
                const dados = await getMinhasAulas();

                if (ativo) {
                    setAulas(dados);
                }
            } catch {
                if (ativo) {
                    setErro("Não foi possível carregar sua agenda.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarAgenda();

        return () => {
            ativo = false;
        };
    }, []);

    const totalAgendadas = aulas.filter(
        (aula) => aula.status === "AGENDADA"
    ).length;

    const totalRealizadas = aulas.filter(
        (aula) => aula.status === "REALIZADA"
    ).length;

    const totalPendentes = aulas.filter(
        (aula) => aula.status === "PENDENTE"
    ).length;

    const periodoInvalido = Boolean(
        dataInicial &&
        dataFinal &&
        dataInicial > dataFinal
    );

    const aulasFiltradas = aulas.filter((aula) => {
        if (periodoInvalido) {
            return false;
        }

        const correspondeStatus =
            filtroStatus === "TODAS" ||
            aula.status === filtroStatus;

        const dataAula = obterDataLocal(aula.dataInicio);

        const correspondePeriodo = !dataAula
            ? !dataInicial && !dataFinal
            : (!dataInicial || dataAula >= dataInicial) &&
            (!dataFinal || dataAula <= dataFinal);

        return correspondeStatus && correspondePeriodo;
    });

    const aulasOrdenadas = [...aulasFiltradas].sort((a, b) => {
        const inicioA = a.dataInicio
            ? new Date(a.dataInicio).getTime()
            : Infinity;

        const inicioB = b.dataInicio
            ? new Date(b.dataInicio).getTime()
            : Infinity;

        return inicioA - inicioB;
    });

    const formatarData = (data?: string | null) => {
        if (!data) return "Data a definir";

        return new Date(data).toLocaleDateString("pt-BR");
    };

    const formatarHora = (data?: string | null) => {
        if (!data) return "--:--";

        return new Date(data).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-8 text-white shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-blue-200">
                    <CalendarDays size={20} />
                    <span className="text-sm font-semibold">
                        ÁREA DO PROFESSOR
                    </span>
                </div>

                <h1 className="text-3xl font-bold">
                    Minha Agenda
                </h1>

                <p className="mt-3 text-blue-100">
                    Consulte e acompanhe suas aulas no Aticurando.
                </p>
            </section>

            {!loading && !erro && (
                <section
                    aria-label="Resumo das aulas"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                    <ProfessorStatCard
                        titulo="Aulas Agendadas"
                        valor={totalAgendadas}
                        icone={CalendarCheck2}
                    />

                    <ProfessorStatCard
                        titulo="Aulas Realizadas"
                        valor={totalRealizadas}
                        icone={CheckCircle2}
                    />

                    <ProfessorStatCard
                        titulo="Aulas Pendentes"
                        valor={totalPendentes}
                        icone={Hourglass}
                    />
                </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Filtrar aulas
                </h2>

                <div className="flex flex-wrap gap-3">
                    {filtros.map((filtro) => (
                        <button
                            key={filtro.valor}
                            type="button"
                            onClick={() => setFiltroStatus(filtro.valor)}
                            aria-pressed={filtroStatus === filtro.valor}
                            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${filtroStatus === filtro.valor
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            {filtro.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">

                    <div>
                        <label
                            htmlFor="data-inicial"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Data inicial
                        </label>

                        <input
                            id="data-inicial"
                            type="date"
                            value={dataInicial}
                            onChange={(e) => setDataInicial(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="data-final"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Data final
                        </label>

                        <input
                            id="data-final"
                            type="date"
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                </div>

                {periodoInvalido && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        A data inicial não pode ser posterior à data final.
                    </p>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            setFiltroStatus("TODAS");
                            setDataInicial("");
                            setDataFinal("");
                        }}
                        className="cursor-pointer rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                    >
                        Limpar filtros
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-6 text-xl font-bold text-slate-800">
                    Minhas Aulas
                </h2>

                {loading ? (
                    <p className="text-slate-500">
                        Carregando agenda...
                    </p>
                ) : erro ? (
                    <p role="alert" className="text-red-600">
                        {erro}
                    </p>
                ) : aulasOrdenadas.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                        {periodoInvalido
                            ? "Corrija o período informado para visualizar suas aulas."
                            : filtroStatus === "TODAS" && !dataInicial && !dataFinal
                                ? "Nenhuma aula vinculada ao professor."
                                : "Nenhuma aula encontrada para os filtros selecionados."}
                    </p>
                ) : (
                    <div className="space-y-4">

                        {aulasOrdenadas.map((item) => (
                            <article
                                key={item._id}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:bg-blue-50"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {item.aula?.titulo ?? "Aula sem título"}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                            <BookOpen size={16} />
                                            {item.turma?.curso?.name ?? "Curso não informado"}
                                            {" • "}
                                            {item.turma?.turno ?? "Turno não informado"}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {item.status}
                                    </span>

                                </div>

                                <div className="mt-5 flex flex-wrap gap-6 border-t border-slate-200 pt-4">

                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <CalendarDays size={18} className="text-blue-600" />
                                        {formatarData(item.dataInicio)}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock3 size={18} className="text-blue-600" />
                                        {formatarHora(item.dataInicio)}
                                        {" às "}
                                        {formatarHora(item.dataFim)}
                                    </div>

                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setAulaSelecionada(item)}
                                        className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </article>
                        ))}

                    </div>
                )}
            </section>

            {aulaSelecionada && (
                <AulaDetalhesModal
                    aula={aulaSelecionada}
                    onClose={() => setAulaSelecionada(null)}
                />
            )}
        </main>
    );
}