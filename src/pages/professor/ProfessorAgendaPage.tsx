import { useEffect, useState } from "react";
import { CalendarDays, Clock3, BookOpen, Hourglass, CheckCircle2, CalendarCheck2 } from "lucide-react";

import { getMinhasAulas, getResumoChamadas } from "../../services/professorService";

import type { AulaTurmaProfessor, StatusAula } from
    "../../types/professor/professor-types";
import { ProfessorStatCard } from "../../components/professor/ProfessorStatCard";
import { AulaDetalhesModal } from "../../components/professor/AulaDetalhesModal";
import { useNavigate } from "react-router-dom";
import type { ResumoChamada } from "../../types/professor/chamada-types";
import { useAgora } from "../../hooks/useAgora";
import { mensagemDisponibilidadeChamada, podeAcessarChamada } from "../../utils/professor/chamadaDisponibilidade";
import { LembreteFinalizacao } from "../../components/professor/LembreteFinalizacao";

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

    const navigate = useNavigate();

    const [filtroStatus, setFiltroStatus] =
        useState<StatusAula | "TODAS">("AGENDADA");

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    const [aulaSelecionada, setAulaSelecionada] =
        useState<AulaTurmaProfessor | null>(null);

    const [resumoChamadas, setResumoChamadas] =
        useState<ResumoChamada[]>([]);

    const [erroResumo, setErroResumo] = useState("");

    const agora = useAgora();

    useEffect(() => {
        let ativo = true;

        async function carregarAgenda() {
            try {
                const [resultadoAulas, resultadoResumo] =
                    await Promise.allSettled([
                        getMinhasAulas(),
                        getResumoChamadas()
                    ]);

                if (!ativo) return;

                if (resultadoAulas.status === "fulfilled") {
                    setAulas(resultadoAulas.value);
                } else {
                    setErro("Não foi possível carregar sua agenda.");
                }

                if (resultadoResumo.status === "fulfilled") {
                    setResumoChamadas(resultadoResumo.value);
                } else {
                    setErroResumo(
                        "Não foi possível verificar as chamadas registradas."
                    );
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

    const chamadasRegistradas = new Set(
        resumoChamadas.map((item) => item.aulaTurmaId)
    );

    return (
        <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-5 text-white shadow-lg sm:p-6 lg:p-8">
                <div className="mb-3 flex items-center gap-2 text-blue-200">
                    <CalendarDays size={20} />
                    <span className="text-sm font-semibold">
                        ÁREA DO PROFESSOR
                    </span>
                </div>

                <h1 className="break-words text-2xl font-bold sm:text-3xl">
                    Minha Agenda
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                    Consulte e acompanhe suas aulas no Aticurando.
                </p>
            </section>

            {!loading && !erro && (
                <LembreteFinalizacao
                    aulas={aulas}
                    agora={agora}
                />
            )}

            {!loading && !erro && (
                <section
                    aria-label="Resumo das aulas"
                    className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 2xl:grid-cols-3"
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

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-800">
                    Filtrar aulas
                </h2>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                    {filtros.map((filtro) => (
                        <button
                            key={filtro.valor}
                            type="button"
                            onClick={() => setFiltroStatus(filtro.valor)}
                            aria-pressed={filtroStatus === filtro.valor}
                            className={`min-w-0 cursor-pointer rounded-full px-3 py-3 text-xs font-semibold transition-colors sm:px-5 sm:py-2 sm:text-sm ${filtroStatus === filtro.valor
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            {filtro.label}
                        </button>
                    ))}
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 border-t border-slate-200 pt-4 sm:mt-6 sm:grid-cols-2 sm:pt-6">

                    <div className="min-w-0">
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
                            className="w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4"
                        />
                    </div>

                    <div className="min-w-0">
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
                            className="w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4"
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
                        className="w-full cursor-pointer rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:w-auto"
                    >
                        Limpar filtros
                    </button>
                </div>
            </section>

            {!loading && !erro && erroResumo && (
                <p
                    role="status"
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                >
                    {erroResumo} Você ainda pode abrir suas aulas normalmente.
                </p>
            )}

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

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
                                className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-blue-50 sm:p-5"
                            >
                                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">

                                    <div className="break-words text-base font-bold text-slate-800 sm:text-lg">
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {item.aula?.titulo ?? "Aula sem título"}
                                        </h3>

                                        <p className="mt-1 flex min-w-0 items-start gap-2 break-words text-sm text-slate-500">
                                            <BookOpen size={16} className="shrink-0" />
                                            {item.turma?.curso?.name ?? "Curso não informado"}
                                            {" • "}
                                            {item.turma?.turno ?? "Turno não informado"}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {item.status}
                                    </span>

                                </div>

                                <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-6">

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

                                {!erroResumo && (
                                    chamadasRegistradas.has(item._id) ||
                                    item.status === "AGENDADA" ||
                                    item.status === "REALIZADA"
                                ) && (
                                        <div className="mt-4 flex items-center gap-2 text-sm">

                                            {chamadasRegistradas.has(item._id) ? (
                                                <>
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-green-600"
                                                    />

                                                    <span className="font-semibold text-green-700">
                                                        Chamada registrada
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock3
                                                        size={18}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="text-slate-500">
                                                        Chamada não registrada
                                                    </span>
                                                </>
                                            )}

                                        </div>
                                    )}

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={() => setAulaSelecionada(item)}
                                        className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 sm:w-auto"
                                    >
                                        Ver detalhes
                                    </button>

                                    {podeAcessarChamada(item, agora) ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/professor/aulas/${item._id}/chamada`)
                                            }
                                            className="w-full cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                                        >
                                            {item.status === "REALIZADA"
                                                ? "Consultar chamada"
                                                : !erroResumo && chamadasRegistradas.has(item._id)
                                                    ? "Consultar chamada"
                                                    : "Realizar chamada"}
                                        </button>
                                    ) : item.status === "AGENDADA" ? (
                                        <p className="flex items-center text-sm font-medium text-amber-700">
                                            {mensagemDisponibilidadeChamada(item)}
                                        </p>
                                    ) : null}
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