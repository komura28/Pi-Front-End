import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    CheckCircle2,
    XCircle,
    ChartNoAxesColumn
} from "lucide-react";

import { getMinhasAulas } from "../../services/professorService";

import {
    getAlunosDaAula,
    getFrequenciaDaTurma
} from "../../services/chamadaService";

import { ProfessorStatCard } from
    "../../components/professor/ProfessorStatCard";

import type { FrequenciaAluno } from
    "../../types/professor/chamada-types";
import { HistoricoChamadas } from "../../components/professor/HistoricoChamadas";

interface LinhaFrequencia extends FrequenciaAluno {
    nome: string;
    email: string;
}

export function ProfessorFrequenciaPage() {
    const { turmaId } = useParams<{ turmaId: string }>();

    const [alunos, setAlunos] = useState<LinhaFrequencia[]>([]);
    const [nomeTurma, setNomeTurma] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!turmaId) {
            return;
        }

        let ativo = true;

        async function carregarFrequencia(id: string) {
            setLoading(true);
            setErro("");

            try {
                const aulas = await getMinhasAulas();

                if (!ativo) return;

                const aulaDaTurma = aulas.find(
                    (item) => item.turma?._id === id
                );

                if (!aulaDaTurma) {
                    setErro("Turma não encontrada para este professor.");
                    return;
                }

                const [matriculas, frequencias] = await Promise.all([
                    getAlunosDaAula(aulaDaTurma._id),
                    getFrequenciaDaTurma(id)
                ]);

                if (!ativo) return;

                const mapaFrequencias = new Map(
                    frequencias.map((item) => [
                        item.matriculaId,
                        item
                    ])
                );

                const linhas: LinhaFrequencia[] =
                    matriculas.map((matricula) => {
                        const frequencia =
                            mapaFrequencias.get(matricula._id);

                        return {
                            matriculaId: matricula._id,
                            nome: matricula.user?.name ??
                                "Aluno não encontrado",
                            email: matricula.user?.email ?? "",
                            presentes: frequencia?.presentes ?? 0,
                            faltas: frequencia?.faltas ?? 0,
                            aulasContabilizadas:
                                frequencia?.aulasContabilizadas ?? 0,
                            frequenciaPercentual:
                                frequencia?.frequenciaPercentual ?? null
                        };
                    });

                setAlunos(linhas);

                setNomeTurma(
                    `${aulaDaTurma.turma?.curso?.name ??
                    "Curso não informado"} — ${aulaDaTurma.turma?.turno ?? "Turno não informado"
                    }`
                );

            } catch {
                if (ativo) {
                    setErro("Não foi possível carregar a frequência.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarFrequencia(turmaId);

        return () => {
            ativo = false;
        };
    }, [turmaId]);

    const totalPresentes = alunos.reduce(
        (total, aluno) => total + aluno.presentes,
        0
    );

    const totalFaltas = alunos.reduce(
        (total, aluno) => total + aluno.faltas,
        0
    );

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            <Link
                to="/professor/turmas"
                className="flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft size={18} />
                Voltar para Minhas Turmas
            </Link>

            <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-8 text-white shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-blue-200">
                    <ChartNoAxesColumn size={20} />
                    <span className="text-sm font-semibold">
                        ACOMPANHAMENTO DO PROFESSOR
                    </span>
                </div>

                <h1 className="text-3xl font-bold">
                    Frequência da Turma
                </h1>

                <p className="mt-3 text-blue-100">
                    {nomeTurma || "Consulte presenças e faltas dos alunos."}
                </p>
            </section>

            {!turmaId ? (
                <p role="alert" className="text-red-600">
                    Turma não informada.
                </p>
            ) : loading ? (
                <p className="text-slate-500">
                    Carregando frequência...
                </p>
            ) : erro ? (
                <p role="alert" className="text-red-600">
                    {erro}
                </p>
            ) : (
                <>
                    <section className="grid gap-6 sm:grid-cols-3">
                        <ProfessorStatCard
                            titulo="Alunos"
                            valor={alunos.length}
                            icone={Users}
                        />
                        <ProfessorStatCard
                            titulo="Presenças"
                            valor={totalPresentes}
                            icone={CheckCircle2}
                        />
                        <ProfessorStatCard
                            titulo="Faltas"
                            valor={totalFaltas}
                            icone={XCircle}
                        />
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-xl font-bold text-slate-800">
                            Frequência dos Alunos
                        </h2>

                        {alunos.length === 0 ? (
                            <p className="text-slate-500">
                                Nenhum aluno aprovado nesta turma.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {alunos.map((aluno) => (
                                    <article
                                        key={aluno.matriculaId}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    {aluno.nome}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {aluno.email}
                                                </p>
                                            </div>

                                            <span className="font-bold text-blue-700">
                                                {aluno.frequenciaPercentual === null
                                                    ? "Sem registro"
                                                    : `${aluno.frequenciaPercentual.toFixed(2)}%`}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                                            <span>{aluno.presentes} presenças</span>
                                            <span>{aluno.faltas} faltas</span>
                                            <span>
                                                {aluno.aulasContabilizadas} aulas contabilizadas
                                            </span>
                                        </div>

                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{
                                                    width: `${aluno.frequenciaPercentual ?? 0}%`
                                                }}
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    {turmaId && (
                        <HistoricoChamadas
                            turmaId={turmaId}
                        />
                    )}
                </>
            )}
        </main>
    );
}