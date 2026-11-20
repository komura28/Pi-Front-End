import { useEffect, useState } from "react";
import { getTurma } from "../../services/authService";
import type { TurmaMatricula } from "../../types/auth/auth-types";
import { CardTurma } from "../../components/CardTurma";
import { useAuth } from "../../contexts/AuthContext";
import { ProfessorStatCard } from "../../components/professor/ProfessorStatCard";
import { FrequenciaAlunoCard } from "../../components/aluno/FrequenciaAlunoCard";
import { getMinhaProximaAula } from "../../services/aulaTurmaService";
import {
    getMinhasMatriculas,
    getMinhaFrequencia
} from "../../services/matriculaService";

import type {
    ProximaAulaAluno
} from "../../types/aluno/aluno-types";

import { ProximaAulaCard } from "../../components/professor/ProximaAulaCard";

import type {
    MatriculaDTO,
    FrequenciaAlunoDashboard
} from "../../types/matricula/matricula-types";

import {
    GraduationCap,
    CalendarDays,
    BookOpen,
    Clock3,
    Search,
} from "lucide-react";



const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();


export function HomeAlunoPage() {

    const { user } = useAuth();

    const primeiroNome =
        user?.name?.trim().split(/\s+/)[0] || "Aluno";

    const dataAtual = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const [frequencias, setFrequencias] =
        useState<FrequenciaAlunoDashboard[]>([]);

    const [carregandoFrequencia, setCarregandoFrequencia] =
        useState(true);

    const [erroFrequencia, setErroFrequencia] = useState("");

    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [minhasMatriculas, setMinhasMatriculas] = useState<MatriculaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [proximaAula, setProximaAula] =
        useState<ProximaAulaAluno | null>(null);

    const [carregandoProximaAula, setCarregandoProximaAula] =
        useState(true);

    const [erroProximaAula, setErroProximaAula] = useState("");

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 6;

    const [busca, setBusca] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarTurmas() {
            try {
                setLoading(true);
                setError("");

                const [turmasData, matriculasData] = await Promise.all([
                    getTurma(),
                    getMinhasMatriculas(),
                ]);

                if (ativo) {
                    setTurmas(turmasData);
                    setMinhasMatriculas(matriculasData);
                }

            } catch (error) {
                if (!ativo) return;

                console.error("Erro ao buscar turmas:", error);

                setError(
                    error instanceof Error
                        ? `Erro ao carregar os dados da turma: ${error.message}`
                        : "Erro ao carregar os dados da turma"
                );

            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        carregarTurmas();

        return () => {
            ativo = false;
        };
    }, []);


    useEffect(() => {
        let ativo = true;

        async function carregarFrequencias() {
            try {
                setCarregandoFrequencia(true);
                setErroFrequencia("");

                const data = await getMinhaFrequencia();

                if (ativo) {
                    setFrequencias(data);
                }

            } catch (error) {
                if (!ativo) return;

                console.error(
                    "Erro ao carregar frequência:",
                    error
                );

                setErroFrequencia(
                    "Não foi possível carregar sua frequência."
                );

            } finally {
                if (ativo) {
                    setCarregandoFrequencia(false);
                }
            }
        }

        void carregarFrequencias();

        return () => {
            ativo = false;
        };
    }, []);


    useEffect(() => {
        let ativo = true;

        async function carregarProximaAula() {
            try {
                setCarregandoProximaAula(true);
                setErroProximaAula("");

                const dados = await getMinhaProximaAula();

                if (ativo) {
                    setProximaAula(dados);
                }

            } catch (error) {
                if (!ativo) return;

                console.error(
                    "Erro ao carregar próxima aula:",
                    error
                );

                setErroProximaAula(
                    "Não foi possível carregar sua próxima aula."
                );

            } finally {
                if (ativo) {
                    setCarregandoProximaAula(false);
                }
            }
        }

        void carregarProximaAula();

        return () => {
            ativo = false;
        };
    }, []);



    const cursosAtivos = minhasMatriculas.filter(
        (matricula) => matricula.status === "APROVADA"
    ).length;

    const candidaturasPendentes = minhasMatriculas.filter(
        (matricula) => matricula.status === "PENDENTE"
    ).length;

    const turmasDisponiveis = turmas.filter(
        (item) => item.vagasDisponiveis > 0
    ).length;

    const indicadores = [
        {
            titulo: "Cursos Ativos",
            valor: cursosAtivos,
            icone: BookOpen,
        },
        {
            titulo: "Candidaturas Pendentes",
            valor: candidaturasPendentes,
            icone: Clock3,
        },
        {
            titulo: "Turmas com Vagas",
            valor: turmasDisponiveis,
            icone: GraduationCap,
        },
    ];

    const termoBusca = normalizar(busca.trim());

    const turmasFiltradas = turmas.filter(({ turma }) =>
        [
            turma.curso?.name,
            turma.curso?.description,
            turma.turno
        ].some((campo) =>
            normalizar(campo ?? "").includes(termoBusca)
        )
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const totalPaginas = Math.ceil(turmasFiltradas.length / itensPorPagina);
    const turmasPaginadas = turmasFiltradas.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    if (loading) {
        return (
            <div className="p-8">
                <p>Carregando turmas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-5 text-white shadow-lg sm:p-6 lg:p-8">

                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2 text-blue-200">
                        <GraduationCap size={20} />

                        <span className="text-sm font-semibold tracking-wide">
                            PAINEL DO ALUNO
                        </span>
                    </div>

                    <h1 className="break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Olá, {primeiroNome}!
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                        Acompanhe suas turmas, candidaturas e atividades
                        em um só lugar.
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-200 sm:mt-6 sm:text-sm">
                        <CalendarDays size={18} className="shrink-0" />
                        <span className="capitalize">
                            {dataAtual}
                        </span>
                    </div>
                </div>

                <GraduationCap
                    size={220}
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -bottom-16 hidden rotate-[-15deg] text-white/10 md:block"
                />
            </section>

            <section
                aria-label="Indicadores do aluno"
                className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
            >
                {indicadores.map((indicador) => (
                    <ProfessorStatCard
                        key={indicador.titulo}
                        titulo={indicador.titulo}
                        valor={indicador.valor}
                        icone={indicador.icone}
                    />
                ))}
            </section>

            <section aria-label="Próxima aula do aluno">
                {carregandoProximaAula ? (
                    <p className="text-slate-500">
                        Carregando próxima aula...
                    </p>
                ) : erroProximaAula ? (
                    <p role="alert" className="text-red-600">
                        {erroProximaAula}
                    </p>
                ) : (
                    <ProximaAulaCard aula={proximaAula} />
                )}
            </section>


            <section aria-labelledby="titulo-frequencia" className="space-y-5">

                <div>
                    <h2
                        id="titulo-frequencia"
                        className="text-xl font-bold text-slate-800 sm:text-2xl"
                    >
                        Minha Frequência
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Acompanhe suas presenças e faltas nas aulas.
                    </p>
                </div>

                {carregandoFrequencia ? (
                    <p className="text-slate-500">
                        Carregando frequência...
                    </p>
                ) : erroFrequencia ? (
                    <p role="alert" className="text-red-600">
                        {erroFrequencia}
                    </p>
                ) : frequencias.length === 0 ? (
                    <p className="text-slate-500">
                        Você ainda não possui frequência para acompanhar.
                    </p>
                ) : (
                    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                        {frequencias.map((frequencia) => {
                            const matricula = minhasMatriculas.find(
                                (item) => item._id === frequencia.matriculaId
                            );

                            return (
                                <FrequenciaAlunoCard
                                    key={frequencia.matriculaId}
                                    frequencia={frequencia}
                                    nomeCurso={
                                        matricula?.turma?.curso?.name ??
                                        "Curso não identificado"
                                    }
                                />
                            );
                        })}
                    </div>
                )}

            </section>


            <section aria-labelledby="titulo-oportunidades" className="mt-4">
                <div className="mb-6">
                    <h2
                        id="titulo-oportunidades"
                        className="text-xl font-bold text-slate-800 sm:text-2xl"
                    >
                        Explore novas oportunidades
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Conheça as turmas disponíveis e encontre
                        novas atividades para participar.
                    </p>
                </div>

                <div className="relative mb-4 w-full max-w-xl sm:mb-6">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />

                    <input
                        type="search"
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setPaginaAtual(1);
                        }}
                        placeholder="Pesquisar turmas..."
                        aria-label="Pesquisar turmas"
                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
                    />
                </div>


                {turmasFiltradas.length > 0 ? (
                    <>
                        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                            {turmasPaginadas.map((turma) => (
                                <CardTurma
                                    key={turma.turma._id}
                                    turma={turma}
                                />
                            ))}
                        </div>

                        {totalPaginas > 1 && (
                            <nav
                                aria-label="Paginação das turmas"
                                className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-3"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaAtual((p) => Math.max(p - 1, 1))
                                    }
                                    disabled={paginaAtual === 1}
                                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Anterior
                                </button>

                                <span className="text-slate-600" aria-live="polite">
                                    Página {paginaAtual} de {totalPaginas}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaginaAtual((p) =>
                                            Math.min(p + 1, totalPaginas)
                                        )
                                    }
                                    disabled={paginaAtual === totalPaginas}
                                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Próxima
                                </button>
                            </nav>
                        )}
                    </>
                ) : (
                    <p className="text-gray-600">
                        {busca.trim()
                            ? "Nenhuma turma encontrada para essa pesquisa."
                            : "Nenhuma turma disponível no momento."}
                    </p>
                )}
            </section>
        </main>
    );
}