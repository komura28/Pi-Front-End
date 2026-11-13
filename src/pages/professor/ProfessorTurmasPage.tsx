import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    GraduationCap,
    CalendarCheck2
} from "lucide-react";

import { getMinhasAulas } from "../../services/professorService";

import type { AulaTurmaProfessor } from
    "../../types/professor/professor-types";

interface TurmaResumo {
    id: string;
    curso: string;
    turno: string;
    totalAulas: number;
    aulasAgendadas: number;
}

function agruparTurmas(aulas: AulaTurmaProfessor[]): TurmaResumo[] {
    const mapa = new Map<string, TurmaResumo>();

    aulas.forEach((item) => {
        if (!item.turma) return;

        const turma = item.turma;
        const existente = mapa.get(turma._id);

        if (existente) {
            existente.totalAulas++;

            if (item.status === "AGENDADA") {
                existente.aulasAgendadas++;
            }

            return;
        }

        mapa.set(turma._id, {
            id: turma._id,
            curso: turma.curso?.name ?? "Curso não informado",
            turno: turma.turno,
            totalAulas: 1,
            aulasAgendadas: item.status === "AGENDADA" ? 1 : 0
        });
    });

    return Array.from(mapa.values());
}

export function ProfessorTurmasPage() {
    const [turmas, setTurmas] = useState<TurmaResumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarTurmas() {
            try {
                const aulas = await getMinhasAulas();

                if (ativo) {
                    setTurmas(agruparTurmas(aulas));
                }
            } catch {
                if (ativo) {
                    setErro("Não foi possível carregar suas turmas.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarTurmas();

        return () => {
            ativo = false;
        };
    }, []);

    const totalAulas = turmas.reduce(
        (total, turma) => total + turma.totalAulas,
        0
    );

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            {/* Cabeçalho */}
            <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-8 text-white shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-blue-200">
                    <Users size={20} />
                    <span className="text-sm font-semibold">
                        ÁREA DO PROFESSOR
                    </span>
                </div>

                <h1 className="text-3xl font-bold">
                    Minhas Turmas
                </h1>

                <p className="mt-3 text-blue-100">
                    Acompanhe suas turmas e atividades de ensino.
                </p>
            </section>

            {loading ? (
                <p className="text-slate-500">
                    Carregando turmas...
                </p>
            ) : erro ? (
                <p role="alert" className="text-red-600">
                    {erro}
                </p>
            ) : (
                <>
                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Minhas Turmas
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                    {turmas.length}
                                </h2>
                            </div>
                            <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                                <Users size={26} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Aulas Vinculadas
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                    {totalAulas}
                                </h2>
                            </div>
                            <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                                <BookOpen size={26} />
                            </div>
                        </div>
                    </section>

                    {/* Cards das turmas */}
                    <section>
                        <h2 className="mb-5 text-xl font-bold text-slate-800">
                            Turmas vinculadas
                        </h2>

                        {turmas.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                                Nenhuma turma vinculada ao professor.
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {turmas.map((turma) => (
                                    <article
                                        key={turma.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >

                                        <div className="bg-[#0F172A] p-6 text-white">

                                            <div className="mb-4 flex items-center justify-between">
                                                <GraduationCap
                                                    size={28}
                                                    className="text-blue-300"
                                                />

                                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                                                    {turma.turno}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold">
                                                {turma.curso}
                                            </h3>

                                        </div>

                                        <div className="grid grid-cols-2 gap-4 p-6">

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Total de aulas
                                                </p>
                                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                                    {turma.totalAulas}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="flex items-center gap-2 text-sm text-slate-500">
                                                    <CalendarCheck2 size={16} />
                                                    Agendadas
                                                </p>
                                                <p className="mt-2 text-2xl font-bold text-blue-600">
                                                    {turma.aulasAgendadas}
                                                </p>
                                            </div>

                                        </div>

                                    </article>
                                ))}
                            </div>
                        )}

                    </section>
                </>
            )}
        </main>
    );
}