
import { useState } from "react";

import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock3,
    RefreshCw
} from "lucide-react";

import { AulaAgendaCard } from "./AulaAgendaCard";

import type {
    AulaTurma,
    StatusAulaTurma,
    TurmaMatricula
} from "../../types/auth/auth-types";

type FiltroAula = StatusAulaTurma | "TODAS";

interface AgendaTurmaPanelProps {
    turma: TurmaMatricula | null;
    aulas: AulaTurma[];
    carregando: boolean;
    erro: string;
    sucesso: string;
    obterNomeMateria: (materiaId?: string) => string;
    onAgendar: (aula: AulaTurma) => void;
    onTentarNovamente: () => void;
}

const filtros: {
    nome: string;
    valor: FiltroAula;
}[] = [
        { nome: "Todas", valor: "TODAS" },
        { nome: "Pendentes", valor: "PENDENTE" },
        { nome: "Agendadas", valor: "AGENDADA" },
        { nome: "Realizadas", valor: "REALIZADA" },
        { nome: "Canceladas", valor: "CANCELADA" }
    ];

export function AgendaTurmaPanel({
    turma,
    aulas,
    carregando,
    erro,
    sucesso,
    obterNomeMateria,
    onAgendar,
    onTentarNovamente
}: Readonly<AgendaTurmaPanelProps>) {

    const [filtro, setFiltro] = useState<FiltroAula>("TODAS");

    if (!turma) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="rounded-2xl bg-blue-50 p-5 text-blue-600">
                    <CalendarDays size={36} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-800">
                    Selecione uma turma
                </h2>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Escolha uma turma para consultar suas aulas
                    e começar o planejamento.
                </p>
            </div>
        );
    }

    const total = aulas.length;

    const pendentes = aulas.filter(
        (item) => item.status === "PENDENTE"
    ).length;

    const agendadas = aulas.filter(
        (item) => item.status === "AGENDADA"
    ).length;

    const realizadas = aulas.filter(
        (item) => item.status === "REALIZADA"
    ).length;

    const planejadas = agendadas + realizadas;

    const progresso = total > 0
        ? Math.round((planejadas / total) * 100)
        : 0;

    const aulasFiltradas = [...aulas]
        .filter((item) =>
            filtro === "TODAS" || item.status === filtro
        )
        .sort(
            (a, b) =>
                (a.aula?.ordem ?? 0) -
                (b.aula?.ordem ?? 0)
        );

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Planejamento da turma
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {turma.turma.curso?.name ?? "Curso não informado"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Turno: {turma.turma.turno}
                </p>
            </div>

            {sucesso && (
                <p
                    role="status"
                    className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >
                    {sucesso}
                </p>
            )}

            {erro && (
                <div
                    role="alert"
                    className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4"
                >
                    <p className="text-sm text-red-700">{erro}</p>

                    <button
                        type="button"
                        onClick={onTentarNovamente}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
                    >
                        <RefreshCw size={16} />
                        Tentar novamente
                    </button>
                </div>
            )}

            {carregando ? (
                <div role="status" className="space-y-4">
                    <p className="text-sm text-slate-500">
                        Carregando planejamento...
                    </p>

                    <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
                </div>
            ) : !erro && (
                <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <BookOpen
                                size={20}
                                className="text-slate-500"
                            />

                            <p className="mt-3 text-xs text-slate-500">
                                Total de aulas
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-800">
                                {total}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-4">
                            <CheckCircle2
                                size={20}
                                className="text-blue-600"
                            />

                            <p className="mt-3 text-xs text-blue-700">
                                Planejadas
                            </p>

                            <p className="mt-1 text-3xl font-bold text-blue-700">
                                {planejadas}
                            </p>
                        </div>

                        <div className="rounded-xl bg-amber-50 p-4">
                            <Clock3
                                size={20}
                                className="text-amber-600"
                            />

                            <p className="mt-3 text-xs text-amber-700">
                                Pendentes
                            </p>

                            <p className="mt-1 text-3xl font-bold text-amber-700">
                                {pendentes}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-bold text-slate-800">
                                Progresso do planejamento
                            </h3>

                            <span className="text-sm font-semibold text-blue-700">
                                {progresso}%
                            </span>
                        </div>

                        <div
                            role="progressbar"
                            aria-label="Progresso do planejamento"
                            aria-valuenow={progresso}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                        >
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${progresso}%` }}
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            {planejadas} de {total} aulas planejadas
                            {realizadas > 0 &&
                                ` · ${realizadas} já realizadas`}
                        </p>
                    </div>

                    <div className="space-y-4 border-t border-slate-200 pt-5">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <h3 className="text-lg font-bold text-slate-800">
                                Plano de aulas
                            </h3>

                            <span className="text-sm text-slate-500">
                                {aulasFiltradas.length} aulas exibidas
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {filtros.map((opcao) => (
                                <button
                                    key={opcao.valor}
                                    type="button"
                                    onClick={() =>
                                        setFiltro(opcao.valor)
                                    }
                                    aria-pressed={filtro === opcao.valor}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filtro === opcao.valor
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                >
                                    {opcao.nome}
                                </button>
                            ))}
                        </div>

                        {aulasFiltradas.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                                Nenhuma aula encontrada neste filtro.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {aulasFiltradas.map((item) => (
                                    <AulaAgendaCard
                                        key={item._id}
                                        ocorrencia={item}
                                        nomeMateria={obterNomeMateria(
                                            item.aula?.materiaId
                                        )}
                                        onAgendar={onAgendar}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
