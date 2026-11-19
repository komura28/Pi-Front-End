import { useEffect, useRef, useState } from "react";

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

import { CalendarDays } from "lucide-react";

import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { TurmaSelector } from "../../components/turmas/TurmaSelector";
import { AgendaTurmaPanel } from "../../components/aulas/AgendaTurmaPanel";
import { AgendarAulaDialog } from "../../components/aulas/AgendarAulaDialog";

const ITENS_POR_PAGINA = 5;

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

    const [erroAgenda, setErroAgenda] = useState("");
    const requisicaoAgendaId = useRef(0);

    const [busca, setBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    const [turmaEmFoco, setTurmaEmFoco] =
        useState<TurmaMatricula | null>(null);

    const [aulas, setAulas] = useState<AulaTurma[]>([]);

    const [aulaSelecionada, setAulaSelecionada] =
        useState<AulaTurma | null>(null);

    const [inicio, setInicio] = useState("");
    const [professorId, setProfessorId] = useState("");

    const [erro, setErro] = useState("");
    const [erroModal, setErroModal] = useState("");
    const [sucesso, setSucesso] = useState("");

    const [cursos, setCursos] = useState<authCurso[]>([]);


    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                setErro("");

                const [
                    listaTurmas,
                    listaProfessores,
                    listaCursos
                ] = await Promise.all([
                    getTurma(),
                    getProfessores(),
                    getCurso()
                ]);

                setTurmas(listaTurmas);
                setProfessores(listaProfessores);
                setCursos(listaCursos);

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

    const turmasPaginadas = turmasFiltradas.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA,
        paginaAtual * ITENS_POR_PAGINA
    );

    function fecharAgendamento() {
        if (salvando) return;

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
        if (!aulaSelecionada || !turmaEmFoco || salvando) {
            return;
        }

        setErroModal("");

        const turma = turmaEmFoco.turma;
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


    async function selecionarTurma(turma: TurmaMatricula) {
        const requisicaoAtual = ++requisicaoAgendaId.current;

        setTurmaEmFoco(turma);
        setAulas([]);
        setErroAgenda("");
        setSucesso("");
        setCarregandoAgenda(true);

        try {
            const agenda = await getAgendaTurma(turma.turma._id);

            if (requisicaoAtual !== requisicaoAgendaId.current) {
                return;
            }

            setAulas(agenda);

        } catch (error) {
            if (requisicaoAtual !== requisicaoAgendaId.current) {
                return;
            }

            setErroAgenda(mensagemErro(error));

        } finally {
            if (requisicaoAtual === requisicaoAgendaId.current) {
                setCarregandoAgenda(false);
            }
        }
    }

    if (loading) {
        return <p className="p-8">Carregando turmas...</p>;
    }

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <PageHeader
                titulo="Gerenciamento de Aulas"
                descricao="Organize o planejamento, os horários e os professores responsáveis pelas aulas."
                categoria="PAINEL ADMINISTRATIVO"
                icone={CalendarDays}
            />

            {erro && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {erro}
                </p>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <TurmaSelector
                        turmas={turmasPaginadas}
                        selecionadaId={turmaEmFoco?.turma._id ?? null}
                        busca={busca}
                        onBuscaChange={(valor) => {
                            setBusca(valor);
                            setPaginaAtual(1);
                            setTurmaEmFoco(null);
                        }}
                        onSelecionar={(turma) => {
                            void selecionarTurma(turma);
                        }}
                    />

                    <div className="mt-5">
                        <Pagination
                            paginaAtual={paginaAtual}
                            totalItens={turmasFiltradas.length}
                            itensPorPagina={ITENS_POR_PAGINA}
                            onPageChange={setPaginaAtual}
                        />
                    </div>
                </section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <AgendaTurmaPanel
                        key={turmaEmFoco?.turma._id ?? "sem-turma"}
                        turma={turmaEmFoco}
                        aulas={aulas}
                        carregando={carregandoAgenda}
                        erro={erroAgenda}
                        sucesso={sucesso}
                        obterNomeMateria={obterNomeMateria}
                        onAgendar={abrirAgendamento}
                        onTentarNovamente={() => {
                            if (turmaEmFoco) {
                                void selecionarTurma(turmaEmFoco);
                            }
                        }}
                    />
                </section>
            </div>

            <AgendarAulaDialog
                aula={aulaSelecionada}
                curso={
                    turmaEmFoco?.turma.curso?.name ??
                    "Curso não informado"
                }
                turno={turmaEmFoco?.turma.turno ?? ""}
                materia={
                    aulaSelecionada
                        ? obterNomeMateria(
                            aulaSelecionada.aula?.materiaId
                        )
                        : ""
                }
                professores={professores}
                inicio={inicio}
                professorId={professorId}
                terminoPrevisto={
                    aulaSelecionada?.aula
                        ? calcularTerminoPrevisto(
                            inicio,
                            aulaSelecionada.aula.duracao
                        )
                        : null
                }
                salvando={salvando}
                erro={erroModal}
                onInicioChange={setInicio}
                onProfessorChange={setProfessorId}
                onCancelar={fecharAgendamento}
                onSalvar={() => {
                    void salvarAgendamento();
                }}
            />
        </main>
    );
}
