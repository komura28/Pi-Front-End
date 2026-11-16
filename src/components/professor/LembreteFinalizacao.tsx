import { Link } from "react-router-dom";
import {
    AlertTriangle,
    Clock3,
    ArrowRight
} from "lucide-react";

import type { AulaTurmaProfessor } from
    "../../types/professor/professor-types";

import { precisaFinalizarAula } from
    "../../utils/professor/aulasPendentesFinalizacao";

interface LembreteFinalizacaoProps {
    aulas: AulaTurmaProfessor[];
    agora: number;
}

export function LembreteFinalizacao({
    aulas,
    agora
}: LembreteFinalizacaoProps) {

    const aulasPendentes = aulas
        .filter((aula) => precisaFinalizarAula(aula, agora))
        .sort((a, b) =>
            new Date(a.dataFim!).getTime() -
            new Date(b.dataFim!).getTime()
        );

    if (aulasPendentes.length === 0) {
        return null;
    }

    const aulasExibidas = aulasPendentes.slice(0, 3);

    return (
        <section
            aria-label="Aulas aguardando finalização"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-sm"
        >
            <div className="mb-5 flex items-start gap-3">

                <div className="rounded-xl bg-amber-100 p-3">
                    <AlertTriangle
                        size={24}
                        className="text-amber-700"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-amber-900">
                        {aulasPendentes.length === 1
                            ? "Você possui 1 aula aguardando finalização"
                            : `Você possui ${aulasPendentes.length} aulas aguardando finalização`}
                    </h2>

                    <p className="mt-2 text-sm text-amber-800">
                        O horário dessas aulas já terminou,
                        mas elas ainda não foram finalizadas.
                        Revise as chamadas para confirmar a realização.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {aulasExibidas.map((aula) => (
                    <article
                        key={aula._id}
                        className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h3 className="font-bold text-slate-800">
                                {aula.aula?.titulo ??
                                    "Aula sem título"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {aula.turma?.curso?.name ??
                                    "Curso não informado"}
                                {" • "}
                                {aula.turma?.turno ??
                                    "Turno não informado"}
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-xs text-amber-800">
                                <Clock3 size={15} />

                                Término previsto:{" "}
                                {new Date(aula.dataFim!).toLocaleString(
                                    "pt-BR",
                                    {
                                        dateStyle: "short",
                                        timeStyle: "short"
                                    }
                                )}
                            </p>
                        </div>

                        <Link
                            to={`/professor/aulas/${aula._id}/chamada`}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Revisar e finalizar
                            <ArrowRight size={17} />
                        </Link>
                    </article>
                ))}
            </div>

            {aulasPendentes.length > 3 && (
                <p className="mt-4 text-sm font-medium text-amber-800">
                    Existem mais {aulasPendentes.length - 3} aulas
                    aguardando finalização.
                </p>
            )}
        </section>
    );
}