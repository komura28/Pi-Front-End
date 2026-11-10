import { useEffect, useState, useId } from "react";
import {
    FaCalendarAlt,
    FaClock,
    FaPencilAlt,
    FaArrowLeft,
    FaBookOpen
} from "react-icons/fa";

import { getTurma, getCurso } from "../../services/authService";

import {
    getAgendaTurma,
    getProfessores,
    agendarAulaTurma
} from "../../services/aulaTurmaService";

import type {
    AulaTurma,
    authCurso,
    Professor,
    TurmaMatricula
} from "../../types/auth/auth-types";

const ITENS_POR_PAGINA = 5;

function formatarData(data?: string | null) {
    if (!data) return "Não definida";

    return new Date(data).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function calcularTerminoPrevisto(
    inicio: string,
    duracao: number
): string | null {
    if (!inicio || !Number.isFinite(duracao) || duracao <= 0) {
        return null;
    }

    const dataInicio = new Date(inicio);

    if (Number.isNaN(dataInicio.getTime())) {
        return null;
    }

    const ano = dataInicio.getFullYear();

    if (ano < 1900 || ano > 2100) {
        return null;
    }

    const dataFim = new Date(
        dataInicio.getTime() + duracao * 60_000
    );

    if (Number.isNaN(dataFim.getTime())) {
        return null;
    }

    return dataFim.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function formatarDia(data: string) {
    return data.slice(0, 10).split("-").reverse().join("/");
}

function dataLocal(data: Date) {
    const dois = (n: number) => String(n).padStart(2, "0");

    return (
        `${data.getFullYear()}-${dois(data.getMonth() + 1)}-` +
        `${dois(data.getDate())}`
    );
}

function paraInputData(data?: string | null) {
    if (!data) return "";

    const valor = new Date(data);
    if (Number.isNaN(valor.getTime())) return "";

    const dois = (n: number) => String(n).padStart(2, "0");

    return (
        `${dataLocal(valor)}T` +
        `${dois(valor.getHours())}:${dois(valor.getMinutes())}`
    );
}

function horariosConflitantes(
    inicioNovo: Date,
    fimNovo: Date,
    inicioExistente: string,
    fimExistente: string
) {
    const inicioAtual = new Date(inicioExistente);
    const fimAtual = new Date(fimExistente);

    if (
        Number.isNaN(inicioAtual.getTime()) ||
        Number.isNaN(fimAtual.getTime())
    ) {
        return false;
    }

    return inicioNovo < fimAtual && fimNovo > inicioAtual;
}

function mensagemErro(error: unknown) {
    if (error instanceof Error) return error.message;
    return "Ocorreu um erro inesperado.";
}

export function AulaTurmaPage() {
    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);

    const [loading, setLoading] = useState(true);
    const [carregandoAgenda, setCarregandoAgenda] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    const [turmaSelecionada, setTurmaSelecionada] =
        useState<TurmaMatricula | null>(null);

    const [aulas, setAulas] = useState<AulaTurma[]>([]);

    const [aulaSelecionada, setAulaSelecionada] =
        useState<AulaTurma | null>(null);

    const [inicio, setInicio] = useState("");
    const [professorId, setProfessorId] = useState("");

    const [erro, setErro] = useState("");
    const [erroModal, setErroModal] = useState("");
    const [sucesso, setSucesso] = useState("");

    const inicioId = useId();
    const professorCampoId = useId();

    const [cursos, setCursos] = useState<authCurso[]>([]);

    useEffect(() => {
        async function carregarDados() {

            const [listaTurmas, listaProfessores, listaCursos] =
                await Promise.all([
                    getTurma(),
                    getProfessores(),
                    getCurso()
                ]);

            setTurmas(listaTurmas);
            setProfessores(listaProfessores);
            setCursos(listaCursos);
            try {
                setLoading(true);
                setErro("");

                const [listaTurmas, listaProfessores] =
                    await Promise.all([
                        getTurma(),
                        getProfessores()
                    ]);

                setTurmas(listaTurmas);
                setProfessores(listaProfessores);
            } catch (error) {
                setErro(mensagemErro(error));
            } finally {
                setLoading(false);
            }
        }

        void carregarDados();
    }, []);

    const turmasFiltradas = turmas.filter(item => {
        const termo = busca.toLowerCase().trim();

        const curso =
            item.turma.curso?.name?.toLowerCase() ?? "";

        const turno =
            item.turma.turno.toLowerCase();

        return curso.includes(termo) || turno.includes(termo);
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(turmasFiltradas.length / ITENS_POR_PAGINA)
    );

    const turmasPaginadas = turmasFiltradas.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA,
        paginaAtual * ITENS_POR_PAGINA
    );

    const aulasOrdenadas = [...aulas].sort(
        (a, b) => (a.aula?.ordem ?? 0) - (b.aula?.ordem ?? 0)
    );

    const aulasAgendadas = aulas.filter(
        item =>
            item.status === "AGENDADA" ||
            item.status === "REALIZADA"
    ).length;

    const progresso = aulas.length
        ? (aulasAgendadas / aulas.length) * 100
        : 0;

    async function abrirTurma(turma: TurmaMatricula) {
        try {
            setCarregandoAgenda(true);
            setErro("");
            setErroModal("");
            setSucesso("");

            const agenda = await getAgendaTurma(turma.turma._id);

            setAulas(agenda);
            setTurmaSelecionada(turma);
            setAulaSelecionada(null);
        } catch (error) {
            setErro(mensagemErro(error));
        } finally {
            setCarregandoAgenda(false);
        }
    }

    function fecharModal() {
        if (salvando) return;

        setTurmaSelecionada(null);
        setAulaSelecionada(null);
        setErroModal("");
    }

    function abrirAgendamento(aula: AulaTurma) {
        setAulaSelecionada(aula);
        setInicio(paraInputData(aula.dataInicio));
        setProfessorId(aula.professor?._id ?? "");
        setErroModal("");
        setSucesso("");
    }

    function voltarParaLista() {
        if (salvando) return;

        setAulaSelecionada(null);
        setErroModal("");
    }

    function obterNomeMateria(materiaId?: string): string {
        if (!materiaId) {
            return "Matéria não identificada";
        }

        for (const curso of cursos) {
            const materiaEncontrada = curso.materias.find(
                item => item.materia._id === materiaId
            );

            if (materiaEncontrada) {
                return materiaEncontrada.materia.name;
            }
        }

        return "Matéria não encontrada";
    }

    async function salvarAgendamento() {
        if (!aulaSelecionada || !turmaSelecionada || salvando) {
            return;
        }

        setErroModal("");

        const turma = turmaSelecionada.turma;
        const duracao = aulaSelecionada.aula?.duracao ?? 0;

        if (!inicio || !professorId) {
            setErroModal("Informe data, horário e professor.");
            return;
        }

        const dataInicio = new Date(inicio);

        if (
            Number.isNaN(dataInicio.getTime()) ||
            !Number.isFinite(duracao) ||
            duracao <= 0
        ) {
            setErroModal("Data ou duração inválida.");
            return;
        }

        const ano = dataInicio.getFullYear();

        if (
            Number.isNaN(dataInicio.getTime()) ||
            ano < 1900 ||
            ano > 2100 ||
            !Number.isFinite(duracao) ||
            duracao <= 0
        ) {
            setErroModal(
                "Informe uma data válida entre os anos 1900 e 2100."
            );
            return;
        }

        const dataFim = new Date(
            dataInicio.getTime() + duracao * 60_000
        );

        if (Number.isNaN(dataFim.getTime())) {
            setErroModal("Não foi possível calcular o término da aula.");
            return;
        }

        const inicioTurma = turma.dataInicio.slice(0, 10);
        const fimTurma = turma.dataFim.slice(0, 10);

        if (dataLocal(dataInicio) < inicioTurma) {
            setErroModal(
                "A aula não pode começar antes da data inicial da turma."
            );
            return;
        }

        if (dataLocal(dataFim) > fimTurma) {
            setErroModal(
                "A aula não pode terminar após a data final da turma."
            );
            return;
        }

        const professorValido = professores.some(
            p => p._id === professorId
        );

        if (!professorValido) {
            setErroModal("Selecione um professor válido.");
            return;
        }

        try {
            setSalvando(true);

            const agendas = await Promise.all(
                turmas.map(async item => ({
                    turmaId: item.turma._id,
                    aulas: await getAgendaTurma(item.turma._id)
                }))
            );

            const conflitoTurma = agendas.some(agenda => {
                if (agenda.turmaId !== turma._id) {
                    return false;
                }

                return agenda.aulas.some(item => {
                    if (
                        item._id === aulaSelecionada._id ||
                        item.status === "CANCELADA" ||
                        !item.dataInicio ||
                        !item.dataFim
                    ) {
                        return false;
                    }

                    return horariosConflitantes(
                        dataInicio,
                        dataFim,
                        item.dataInicio,
                        item.dataFim
                    );
                });
            });

            if (conflitoTurma) {
                setErroModal(
                    "Esta turma já possui outra aula no horário selecionado."
                );
                return;
            }

            const conflitoProfessor = agendas.some(agenda => {
                if (agenda.turmaId === turma._id) {
                    return false;
                }

                return agenda.aulas.some(item => {
                    if (
                        item.status === "CANCELADA" ||
                        !item.dataInicio ||
                        !item.dataFim ||
                        item.professor?._id !== professorId
                    ) {
                        return false;
                    }

                    return horariosConflitantes(
                        dataInicio,
                        dataFim,
                        item.dataInicio,
                        item.dataFim
                    );
                });
            });

            if (conflitoProfessor) {
                setErroModal(
                    "Esse professor já possui uma aula em outra turma nesse horário."
                );
                return;
            }

            await agendarAulaTurma(aulaSelecionada._id, {
                dataInicio: dataInicio.toISOString(),
                dataFim: dataFim.toISOString(),
                professor: professorId,
                status: "AGENDADA"
            });

            const agendaAtualizada = await getAgendaTurma(
                turma._id
            );

            setAulas(agendaAtualizada);
            setAulaSelecionada(null);
            setSucesso("Aula agendada com sucesso!");
        } catch (error) {
            setErroModal(mensagemErro(error));
        } finally {
            setSalvando(false);
        }
    }

    if (loading) {
        return <p className="p-8">Carregando turmas...</p>;
    }

    return (
        <main className="mx-auto mt-8 w-full max-w-6xl rounded-2xl border border-slate-300 bg-white p-8 shadow-md">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
                Gerenciamento de Aulas
            </h1>

            <p className="mb-6 text-gray-500">
                Gerencie os horários e professores das aulas das turmas.
            </p>

            <input
                type="search"
                aria-label="Pesquisar turmas"
                placeholder="Pesquisar curso ou turno..."
                value={busca}
                onChange={e => {
                    setBusca(e.target.value);
                    setPaginaAtual(1);
                }}
                className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {erro && (
                <p role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                    {erro}
                </p>
            )}

            {sucesso && !turmaSelecionada && (
                <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                    {sucesso}
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="p-3 text-left">Curso</th>
                            <th className="p-3 text-left">Turno</th>
                            <th className="p-3 text-left">Início</th>
                            <th className="p-3 text-left">Fim</th>
                            <th className="p-3 text-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {turmasPaginadas.map(item => (
                            <tr
                                key={item.turma._id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="p-3 text-gray-700">
                                    {item.turma.curso?.name ?? "Sem curso"}
                                </td>

                                <td className="p-3 text-gray-700">
                                    {item.turma.turno}
                                </td>

                                <td className="p-3 text-gray-700">
                                    {formatarDia(item.turma.dataInicio)}
                                </td>

                                <td className="p-3 text-gray-700">
                                    {formatarDia(item.turma.dataFim)}
                                </td>

                                <td className="p-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => void abrirTurma(item)}
                                        disabled={carregandoAgenda}
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <FaCalendarAlt />
                                        Gerenciar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {turmasPaginadas.length === 0 && (
                    <p className="py-8 text-center text-gray-500">
                        Nenhuma turma encontrada.
                    </p>
                )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    type="button"
                    disabled={paginaAtual === 1}
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Anterior
                </button>

                <span className="text-sm text-gray-600">
                    Página {paginaAtual} de {totalPaginas}
                </span>

                <button
                    type="button"
                    disabled={paginaAtual >= totalPaginas}
                    onClick={() =>
                        setPaginaAtual(p => Math.min(totalPaginas, p + 1))
                    }
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>

            {turmaSelecionada && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Gerenciamento de aulas da turma"
                        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <header className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {aulaSelecionada
                                            ? "Agendamento de Aula"
                                            : `Aulas — ${turmaSelecionada.turma.curso?.name ?? "Turma"}`}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Turma {turmaSelecionada.turma.turno}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="overflow-y-auto p-6">
                            {!aulaSelecionada ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-blue-50 p-4">
                                            <p className="text-sm text-gray-600">
                                                Agendadas
                                            </p>
                                            <p className="text-2xl font-bold text-blue-700">
                                                {aulasAgendadas}/{aulas.length}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-yellow-50 p-4">
                                            <p className="text-sm text-gray-600">
                                                Pendentes
                                            </p>
                                            <p className="text-2xl font-bold text-yellow-700">
                                                {aulas.filter(a => a.status === "PENDENTE").length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{ width: `${progresso}%` }}
                                        />
                                    </div>

                                    {sucesso && (
                                        <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                                            {sucesso}
                                        </p>
                                    )}

                                    {aulasOrdenadas.length === 0 && (
                                        <p className="py-6 text-center text-gray-500">
                                            Esta turma não possui aulas cadastradas.
                                        </p>
                                    )}

                                    {aulasOrdenadas.map(item => {
                                        const agendada = item.status === "AGENDADA";
                                        const bloqueada =
                                            !item.aula ||
                                            item.status === "REALIZADA" ||
                                            item.status === "CANCELADA";

                                        return (
                                            <article
                                                key={item._id}
                                                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">
                                                            {item.aula?.ordem ?? "—"}.{" "}
                                                            {item.aula?.titulo ?? "Aula não encontrada"}
                                                        </h3>

                                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                                            <FaBookOpen className="text-blue-600" />
                                                            <span>
                                                                Matéria: {obterNomeMateria(item.aula?.materiaId)}
                                                            </span>
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                                            <FaClock />
                                                            {item.aula?.duracao ?? 0} minutos
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "AGENDADA"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.status === "PENDENTE"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-gray-200 text-gray-700"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>

                                                {item.dataInicio && (
                                                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                                                        <p>
                                                            Início: {formatarData(item.dataInicio)}
                                                        </p>

                                                        <p>
                                                            Professor: {item.professor?.name ?? "Não atribuído"}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-3 flex justify-end">
                                                    <button
                                                        type="button"
                                                        disabled={bloqueada}
                                                        onClick={() => abrirAgendamento(item)}
                                                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {agendada ? <FaPencilAlt /> : <FaCalendarAlt />}
                                                        {agendada ? "Editar" : "Agendar"}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <button
                                        type="button"
                                        onClick={voltarParaLista}
                                        disabled={salvando}
                                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        <FaArrowLeft />
                                        Voltar para as aulas
                                    </button>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {aulaSelecionada.aula?.titulo}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Matéria: {obterNomeMateria(aulaSelecionada.aula?.materiaId)}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Duração: {aulaSelecionada.aula?.duracao} minutos
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={inicioId}
                                            className="mb-1 block text-sm font-semibold text-gray-700"
                                        >
                                            Data e horário de início
                                        </label>

                                        <input
                                            id={inicioId}
                                            type="datetime-local"
                                            min="1900-01-01T00:00"
                                            max="2100-12-31T23:59"
                                            value={inicio}
                                            onChange={e => setInicio(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={professorCampoId}
                                            className="mb-1 block text-sm font-semibold text-gray-700"
                                        >
                                            Professor responsável
                                        </label>

                                        <select
                                            id={professorCampoId}
                                            value={professorId}
                                            onChange={e => setProfessorId(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                        >
                                            <option value="">Selecione um professor</option>

                                            {professores.map(professor => (
                                                <option
                                                    key={professor._id}
                                                    value={professor._id}
                                                >
                                                    {professor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {aulaSelecionada.aula && (
                                        <div className="rounded-lg bg-blue-50 p-4">
                                            <p className="text-sm text-gray-600">
                                                Término previsto
                                            </p>

                                            <p className="font-semibold text-blue-700">
                                                {calcularTerminoPrevisto(
                                                    inicio,
                                                    aulaSelecionada.aula.duracao
                                                ) ?? "Informe uma data e horário válidos"}
                                            </p>
                                        </div>
                                    )}

                                    {erroModal && (
                                        <p
                                            role="alert"
                                            className="rounded-lg bg-red-100 p-3 text-sm text-red-700"
                                        >
                                            {erroModal}
                                        </p>
                                    )}

                                    <div className="flex justify-end gap-3 pt-3">
                                        <button
                                            type="button"
                                            onClick={voltarParaLista}
                                            disabled={salvando}
                                            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => void salvarAgendamento()}
                                            disabled={salvando || !inicio || !professorId}
                                            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {salvando ? "Salvando..." : "Salvar Agendamento"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!aulaSelecionada && (
                            <footer className="border-t border-gray-200 p-4 text-right">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    className="cursor-pointer rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-300"
                                >
                                    Fechar
                                </button>
                            </footer>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}
