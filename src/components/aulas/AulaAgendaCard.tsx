
import {
    BookOpen,
    CalendarClock,
    CalendarPlus,
    Clock3,
    Pencil,
    UserRound
} from "lucide-react";

import type {
    AulaTurma,
    StatusAulaTurma
} from "../../types/auth/auth-types";

interface AulaAgendaCardProps {
    ocorrencia: AulaTurma;
    nomeMateria: string;
    onAgendar: (aula: AulaTurma) => void;
}

const situacoes: Record<
    StatusAulaTurma,
    { nome: string; estilo: string }
> = {
    PENDENTE: {
        nome: "Pendente",
        estilo: "bg-amber-50 text-amber-700"
    },
    AGENDADA: {
        nome: "Agendada",
        estilo: "bg-green-50 text-green-700"
    },
    REALIZADA: {
        nome: "Realizada",
        estilo: "bg-blue-50 text-blue-700"
    },
    CANCELADA: {
        nome: "Cancelada",
        estilo: "bg-slate-100 text-slate-600"
    }
};

function formatarDataHora(valor?: string) {
    if (!valor) return "A definir";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function AulaAgendaCard({
    ocorrencia,
    nomeMateria,
    onAgendar
}: Readonly<AulaAgendaCardProps>) {

    const agendada = ocorrencia.status === "AGENDADA";

    const permiteAgendar =
        (ocorrencia.status === "PENDENTE" || agendada) &&
        Boolean(ocorrencia.aula);

    const situacao = situacoes[ocorrencia.status];

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                <div className="min-w-0 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Aula {ocorrencia.aula?.ordem ?? "—"}
                        {" · "}
                        {nomeMateria}
                    </p>

                    <h3 className="text-base font-bold text-slate-800">
                        {ocorrencia.aula?.titulo ?? "Aula não encontrada"}
                    </h3>

                    {ocorrencia.aula?.descricao && (
                        <p className="text-sm text-slate-500">
                            {ocorrencia.aula.descricao}
                        </p>
                    )}
                </div>

                <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${situacao.estilo}`}
                >
                    {situacao.nome}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-4">

                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 size={16} className="text-slate-400" />
                    {ocorrencia.aula?.duracao ?? 0} minutos
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} className="text-slate-400" />
                    {nomeMateria}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">

                <div className="flex items-start gap-2">
                    <CalendarClock
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                        <p className="text-xs text-slate-500">
                            Data e horário
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatarDataHora(ocorrencia.dataInicio)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <UserRound
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                        <p className="text-xs text-slate-500">
                            Professor responsável
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                            {ocorrencia.professor?.name ??
                                "Não atribuído"}
                        </p>
                    </div>
                </div>
            </div>

            {permiteAgendar && (
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => onAgendar(ocorrencia)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        {agendada ? (
                            <Pencil size={17} />
                        ) : (
                            <CalendarPlus size={17} />
                        )}

                        {agendada
                            ? "Editar agendamento"
                            : "Agendar aula"}
                    </button>
                </div>
            )}
        </article>
    );
}
