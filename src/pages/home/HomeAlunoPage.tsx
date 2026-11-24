import { useEffect, useState } from "react";
import { getTurma } from "../../services/authService";
import type {
    TurmaMatricula,
    authCurso
} from "../../types/auth/auth-types";
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
    ArrowLeft,
    ArrowRight,
    Users,
    Sunrise,
    Sun,
    Moon
} from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";



const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

function obterTurno(item: TurmaMatricula) {
    return normalizar(
        item.turma.turno?.trim() || "Não informado"
    );
}

function formatarTurno(turno: string) {
    return ROTULOS_TURNO[turno] ?? turno;
}

interface CursoComTurmas {
    curso: authCurso;
    turmas: TurmaMatricula[];
}

const ROTULOS_TURNO: Record<string, string> = {
    manha: "Manhã",
    tarde: "Tarde",
    noite: "Noite",
    "nao informado": "Não informado"
};

const ORDEM_TURNO: Record<string, number> = {
    manha: 1,
    tarde: 2,
    noite: 3
};


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
    const [paginaTurmas, setPaginaTurmas] = useState(1);
    const turmasPorPagina = 6;

    const [busca, setBusca] = useState("");

    const [cursoSelecionadoId, setCursoSelecionadoId] =
        useState<string | null>(null);

    const [turnoSelecionado, setTurnoSelecionado] =
        useState("todos");

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

    const cursosPorId = new Map<string, CursoComTurmas>();

    for (const item of turmas) {
        const curso = item.turma.curso;

        if (!curso?._id || item.vagasDisponiveis <= 0) {
            continue;
        }

        const grupoExistente = cursosPorId.get(curso._id);

        if (grupoExistente) {
            grupoExistente.turmas.push(item);
        } else {
            cursosPorId.set(curso._id, {
                curso,
                turmas: [item]
            });
        }
    }

    const cursosAgrupados = Array.from(
        cursosPorId.values()
    ).sort((a, b) =>
        a.curso.name.localeCompare(b.curso.name, "pt-BR")
    );

    const termoBusca = normalizar(busca.trim());

    const cursosFiltrados = cursosAgrupados.filter(({ curso, turmas }) =>
        [
            curso.name,
            curso.description,
            ...turmas.map((item) => obterTurno(item))
        ].some((campo) =>
            normalizar(campo ?? "").includes(termoBusca)
        )
    );

    const totalPaginas = Math.ceil(
        cursosFiltrados.length / itensPorPagina
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const cursosPaginados = cursosFiltrados.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const cursoSelecionado = cursosAgrupados.find(
        (item) => item.curso._id === cursoSelecionadoId
    );

    const turmasPorTurno = new Map<string, TurmaMatricula[]>();

    for (const item of cursoSelecionado?.turmas ?? []) {
        const turno = obterTurno(item);
        const grupo = turmasPorTurno.get(turno);

        if (grupo) {
            grupo.push(item);
        } else {
            turmasPorTurno.set(turno, [item]);
        }
    }

    const gruposTurno = Array.from(
        turmasPorTurno.entries()
    ).sort(([a], [b]) =>
        (ORDEM_TURNO[a] ?? 99) - (ORDEM_TURNO[b] ?? 99)
    );

    const gruposTurnoFiltrados = gruposTurno.filter(
        ([turno]) =>
            turnoSelecionado === "todos" ||
            turnoSelecionado === turno
    );

    const turmasFiltradas = gruposTurnoFiltrados.flatMap(
        ([, turmas]) => turmas
    );

    const totalTurmasFiltradas = turmasFiltradas.length;

    const turmasPaginadas = turmasFiltradas.slice(
        (paginaTurmas - 1) * turmasPorPagina,
        paginaTurmas * turmasPorPagina
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
        <main className="@container mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

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
                className="w-full min-w-0"
            >
                <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2">
                    <div className="grid w-full min-w-[690px] grid-cols-3 gap-3 sm:gap-4">

                        {indicadores.map((indicador) => (
                            <ProfessorStatCard
                                key={indicador.titulo}
                                titulo={indicador.titulo}
                                valor={indicador.valor}
                                icone={indicador.icone}
                            />
                        ))}

                    </div>
                </div>
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
                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 @2xl:grid-cols-2 @5xl:grid-cols-3">
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



            <section
                aria-labelledby="titulo-oportunidades"
                className="mt-4 space-y-5"
            >
                <div>
                    <h2
                        id="titulo-oportunidades"
                        className="text-xl font-bold text-slate-800 sm:text-2xl"
                    >
                        Explore novas oportunidades
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Conheça os cursos disponíveis e encontre
                        a turma ideal para você.
                    </p>
                </div>

                {!cursoSelecionado && (
                    <>
                        <div className="relative w-full max-w-xl">
                            <Search
                                aria-hidden="true"
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="search"
                                value={busca}
                                onChange={(e) => {
                                    setBusca(e.target.value);
                                    setPaginaAtual(1);
                                }}
                                placeholder="Pesquisar cursos..."
                                aria-label="Pesquisar cursos"
                                className="w-full min-w-0 rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 @2xl:grid-cols-2 @5xl:grid-cols-3">

                            {cursosPaginados.map(({ curso, turmas }) => {
                                const turnos = Array.from(
                                    new Set(turmas.map(obterTurno))
                                );

                                return (
                                    <button
                                        key={curso._id}
                                        type="button"
                                        onClick={() => {
                                            setCursoSelecionadoId(curso._id);
                                            setTurnoSelecionado("todos");
                                            setPaginaTurmas(1);
                                        }}
                                        className="group flex min-w-0 cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-6"
                                    >
                                        <span className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <BookOpen size={28} />
                                        </span>

                                        <span className="break-words text-xl font-bold text-slate-800">
                                            {curso.name}
                                        </span>

                                        <span className="mt-2 mb-5 break-words text-sm leading-relaxed text-slate-500">
                                            {curso.description ||
                                                "Conheça as turmas disponíveis neste curso."}
                                        </span>

                                        <span className="mt-auto space-y-4 border-t border-slate-200 pt-4">

                                            <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <Users
                                                    size={18}
                                                    className="shrink-0 text-blue-600"
                                                />

                                                {turmas.length} turma(s) com vagas
                                            </span>

                                            <span className="flex flex-wrap gap-2">
                                                {turnos.map((turno) => (
                                                    <span
                                                        key={turno}
                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                                                    >
                                                        {formatarTurno(turno)}
                                                    </span>
                                                ))}
                                            </span>

                                            <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                                                Ver turmas
                                                <ArrowRight size={18} />
                                            </span>

                                        </span>
                                    </button>
                                );
                            })}

                        </div>

                        {cursosFiltrados.length === 0 && (
                            <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                                {busca.trim()
                                    ? "Nenhum curso encontrado para essa pesquisa."
                                    : "Nenhum curso com vagas disponíveis no momento."}
                            </p>
                        )}

                        {totalPaginas > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    paginaAtual={paginaAtual}
                                    totalItens={cursosFiltrados.length}
                                    itensPorPagina={itensPorPagina}
                                    onPageChange={setPaginaAtual}
                                />
                            </div>
                        )}
                    </>
                )}

                {cursoSelecionado && (
                    <div className="min-w-0 space-y-6">

                        <button
                            type="button"
                            onClick={() => {
                                setCursoSelecionadoId(null);
                                setTurnoSelecionado("todos");
                                setPaginaTurmas(1);
                            }}
                            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                        >
                            <ArrowLeft size={18} />
                            Voltar aos cursos
                        </button>

                        <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-5 text-white shadow-sm sm:p-8">

                            <BookOpen
                                size={32}
                                className="mb-4 text-blue-200"
                            />

                            <h3 className="break-words text-2xl font-bold sm:text-3xl">
                                {cursoSelecionado.curso.name}
                            </h3>

                            <p className="mt-3 break-words text-sm leading-relaxed text-blue-100 sm:text-base">
                                {cursoSelecionado.curso.description}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm text-blue-200">
                                <Users size={18} />

                                {cursoSelecionado.turmas.length} turma(s)
                                com vagas disponíveis
                            </div>

                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                            <h3 className="mb-4 text-sm font-semibold text-slate-700">
                                Filtrar por turno
                            </h3>


                            <div className="flex flex-wrap gap-2">

                                <button
                                    type="button"
                                    aria-pressed={turnoSelecionado === "todos"}
                                    onClick={() => {
                                        setTurnoSelecionado("todos");
                                        setPaginaTurmas(1);
                                    }}
                                    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${turnoSelecionado === "todos"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                                        }`}
                                >
                                    <Users size={17} aria-hidden="true" />
                                    Todos
                                </button>

                                {gruposTurno.map(([turno]) => {
                                    const IconeTurno =
                                        turno === "manha"
                                            ? Sunrise
                                            : turno === "tarde"
                                                ? Sun
                                                : turno === "noite"
                                                    ? Moon
                                                    : Clock3;

                                    return (
                                        <button
                                            key={turno}
                                            type="button"
                                            aria-pressed={turnoSelecionado === turno}
                                            onClick={() => {
                                                setTurnoSelecionado(turno);
                                                setPaginaTurmas(1);
                                            }}
                                            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${turnoSelecionado === turno
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                                                }`}
                                        >
                                            <IconeTurno size={17} aria-hidden="true" />
                                            {formatarTurno(turno)}
                                        </button>
                                    );
                                })}

                            </div>

                        </div>

                        <div className="min-w-0 space-y-4">

                            <div>
                                <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                                    Turmas disponíveis
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {totalTurmasFiltradas} turma(s) com vagas
                                </p>
                            </div>

                            <div
                                className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6"
                                aria-label="Turmas disponíveis"
                            >

                                {turmasPaginadas.map((turma) => (
                                    <div
                                        key={turma.turma._id}
                                        className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
                                    >
                                        <CardTurma
                                            turma={turma}
                                            mostrarIconeTurno
                                        />
                                    </div>
                                ))}

                            </div>

                        </div>


                        {totalTurmasFiltradas > turmasPorPagina && (
                            <div className="mt-6">
                                <Pagination
                                    paginaAtual={paginaTurmas}
                                    totalItens={totalTurmasFiltradas}
                                    itensPorPagina={turmasPorPagina}
                                    onPageChange={setPaginaTurmas}
                                />
                            </div>
                        )}

                    </div>
                )}

            </section>

        </main>
    );
}