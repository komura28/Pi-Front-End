import { CalendarDays, Clock3 } from "lucide-react";

import type { ProximaAula } from "./ProximaAulaCard";

interface AgendaResumoProps {
    aulas: ProximaAula[];
}

export function AgendaResumo({ aulas }: AgendaResumoProps) {

    const proximasAulas = aulas.slice(0, 3);

    const formatarData = (valor: string) =>
        new Date(valor).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short"
        });

    const formatarHora = (valor: string) =>
        new Date(valor).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
                    <CalendarDays
                        className="text-blue-600"
                        size={24}
                    />
                    Minha Agenda
                </h2>

                <span className="text-sm text-slate-500">
                    Próximas aulas
                </span>
            </div>

            {proximasAulas.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                    Nenhuma aula agendada no momento.
                </p>
            ) : (
                <ul className="space-y-3">

                    {proximasAulas.map((aula) => (
                        <li
                            key={aula.id}
                            className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-blue-50 sm:flex-row sm:items-center"
                        >

                            <div className="flex min-w-20 items-center justify-center rounded-lg bg-blue-100 p-3 text-center text-sm font-bold text-blue-700">
                                {formatarData(aula.dataInicio)}
                            </div>

                            <div className="flex-1">
                                <h3 className="break-words font-semibold text-slate-800">
                                    {aula.titulo}
                                </h3>

                                <p className="mt-1 break-words text-sm text-slate-500">
                                    {aula.curso} • {aula.turma}
                                </p>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <Clock3 size={16} />

                                    <span>
                                        {formatarHora(aula.dataInicio)}
                                        {" às "}
                                        {formatarHora(aula.dataFim)}
                                    </span>
                                </div>
                            </div>

                        </li>
                    ))}

                </ul>
            )}

        </section>
    );
}