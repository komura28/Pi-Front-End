import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ClipboardCheck,
    Users,
    CheckCircle2,
    XCircle
} from "lucide-react";

import {
    finalizarAula,
    getAlunosDaAula,
    getChamadaDaAula,
    salvarChamada
} from "../../services/chamadaService";

import type {
    MatriculaChamada,
    RegistroPresenca,
    StatusPresenca
} from "../../types/professor/chamada-types";

import { useRef } from "react";

import { getMinhasAulas } from
    "../../services/professorService";

import type { AulaTurmaProfessor } from
    "../../types/professor/professor-types";
import axios from "axios";
import { useAgora } from "../../hooks/useAgora";
import { mensagemDisponibilidadeChamada, podeAcessarChamada } from "../../utils/professor/chamadaDisponibilidade";

export function ProfessorChamadaPage() {
    const { aulaTurmaId } = useParams<{ aulaTurmaId: string }>();

    const [alunos, setAlunos] = useState<MatriculaChamada[]>([]);
    const [presencas, setPresencas] =
        useState<Record<string, StatusPresenca | null>>({});

    const [observacao, setObservacao] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");

    const [aulaAtual, setAulaAtual] =
        useState<AulaTurmaProfessor | null>(null);

    const [chamadaSalva, setChamadaSalva] = useState(false);
    const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

    const [finalizando, setFinalizando] = useState(false);
    const [erroFinalizacao, setErroFinalizacao] = useState("");
    const [sucessoFinalizacao, setSucessoFinalizacao] = useState("");

    const [confirmarAntecipada, setConfirmarAntecipada] =
        useState(false);

    const confirmacaoRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!aulaTurmaId) {
            return;
        }

        let ativo = true;

        async function carregarChamada(id: string) {
            try {
                const [matriculas, chamada, aulas] = await Promise.all([
                    getAlunosDaAula(id),
                    getChamadaDaAula(id),
                    getMinhasAulas()
                ]);

                if (!ativo) return;

                const ocorrencia = aulas.find(
                    (item) => item._id === id
                );

                if (!ocorrencia) {
                    throw new Error("Aula não encontrada.");
                }

                setAulaAtual(ocorrencia);
                setChamadaSalva(chamada !== null);
                setAlteracoesPendentes(false);

                if (!ativo) return;

                const registrosSalvos = new Map(
                    (chamada?.registros ?? []).map((registro) => [
                        registro.matricula,
                        registro.status
                    ])
                );

                const marcacoes: Record<
                    string,
                    StatusPresenca | null
                > = {};

                matriculas.forEach((matricula) => {
                    marcacoes[matricula._id] =
                        registrosSalvos.get(matricula._id) ?? null;
                });

                setAlunos(matriculas);
                setPresencas(marcacoes);
                setObservacao(chamada?.observacao ?? "");

            } catch {
                if (ativo) {
                    setErro("Não foi possível carregar a chamada.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarChamada(aulaTurmaId);

        return () => {
            ativo = false;
        };
    }, [aulaTurmaId]);

    function marcarPresenca(
        matriculaId: string,
        status: StatusPresenca
    ) {
        setPresencas((anterior) => ({
            ...anterior,
            [matriculaId]: status
        }));
        setMensagemSucesso("");
        setErroSalvar("");
        setAlteracoesPendentes(true);
    }

    const totalPresentes = Object.values(presencas).filter(
        (status) => status === "PRESENTE"
    ).length;

    const totalFaltas = Object.values(presencas).filter(
        (status) => status === "FALTA"
    ).length;

    const totalPendentes =
        alunos.length - totalPresentes - totalFaltas;

    const agora = useAgora();

    const podeEditarChamada = aulaAtual !== null &&
        podeAcessarChamada(aulaAtual, agora);

    async function handleSalvarChamada() {
        if (!aulaTurmaId || salvando || loading || erro) {
            return;
        }

        if (!aulaAtual || !podeAcessarChamada(aulaAtual)) {
            setErroSalvar(
                "A chamada ainda não está disponível para esta aula."
            );
            return;
        }

        setErroSalvar("");
        setMensagemSucesso("");

        if (alunos.length === 0) {
            setErroSalvar("Não há alunos aprovados para esta chamada.");
            return;
        }

        const registros: RegistroPresenca[] = [];

        for (const matricula of alunos) {
            const status = presencas[matricula._id];

            if (!status) {
                setErroSalvar(
                    "Marque presença ou falta para todos os alunos."
                );
                return;
            }

            registros.push({
                matricula: matricula._id,
                status
            });
        }

        try {
            setSalvando(true);

            await salvarChamada(aulaTurmaId, {
                registros,
                observacao
            });

            setMensagemSucesso(
                "Chamada salva com sucesso!"
            );
            setChamadaSalva(true);
            setAlteracoesPendentes(false);

        } catch (error: unknown) {
            console.error("Erro ao salvar chamada:", error);

            if (axios.isAxiosError(error)) {
                const resposta = error.response?.data;

                setErroSalvar(
                    resposta?.message ??
                    resposta?.error ??
                    "Não foi possível salvar a chamada."
                );
            } else {
                setErroSalvar("Erro inesperado ao salvar chamada.");
            }
        } finally {
            setSalvando(false);
        }
    }

    async function executarFinalizacao(
        antecipada: boolean
    ) {
        if (
            !aulaTurmaId ||
            finalizando ||
            !chamadaSalva ||
            alteracoesPendentes
        ) {
            return;
        }

        setConfirmarAntecipada(false);
        setErroFinalizacao("");
        setSucessoFinalizacao("");
        setFinalizando(true);

        try {
            const resultado = await finalizarAula(
                aulaTurmaId,
                antecipada
            );

            setAulaAtual((anterior) =>
                anterior
                    ? { ...anterior, status: resultado.status }
                    : anterior
            );

            setSucessoFinalizacao(
                "Aula finalizada com sucesso! A frequência já pode ser contabilizada."
            );

        } catch (error: unknown) {
            console.error("Erro ao finalizar aula:", error);

            if (axios.isAxiosError(error)) {
                const resposta = error.response?.data;

                setErroFinalizacao(
                    resposta?.message ??
                    resposta?.error ??
                    "Não foi possível finalizar a aula."
                );
            } else {
                setErroFinalizacao("Erro inesperado ao finalizar aula.");
            }
        } finally {
            setFinalizando(false);
        }
    }

    function solicitarFinalizacao() {
        if (!aulaAtual || aulaAtual.status !== "AGENDADA") {
            return;
        }

        setErroFinalizacao("");

        if (!chamadaSalva || alteracoesPendentes) {
            setErroFinalizacao(
                "Salve todas as alterações da chamada antes de finalizar."
            );
            return;
        }

        const inicio = new Date(
            aulaAtual.dataInicio ?? ""
        ).getTime();

        const fim = new Date(
            aulaAtual.dataFim ?? ""
        ).getTime();

        const agora = Date.now();

        if (
            !Number.isFinite(inicio) ||
            !Number.isFinite(fim) ||
            inicio >= fim
        ) {
            setErroFinalizacao(
                "A aula não possui um período válido."
            );
            return;
        }

        if (agora < inicio) {
            setErroFinalizacao(
                "Não é possível finalizar uma aula que ainda não começou."
            );
            return;
        }

        if (agora < fim) {
            setConfirmarAntecipada(true);
            return;
        }

        void executarFinalizacao(false);
    }

    useEffect(() => {
        const dialog = confirmacaoRef.current;

        if (!dialog) return;

        if (confirmarAntecipada && !dialog.open) {
            dialog.showModal();
        }

        if (!confirmarAntecipada && dialog.open) {
            dialog.close();
        }

        return () => {
            if (dialog.open) dialog.close();
        };
    }, [confirmarAntecipada]);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            <Link
                to="/professor/turmas"
                className="flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft size={18} />
                Voltar para Minhas Turmas
            </Link>

            <section className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-8 text-white shadow-lg">

                <div className="mb-3 flex items-center gap-2 text-blue-200">
                    <ClipboardCheck size={20} />

                    <span className="text-sm font-semibold">
                        ÁREA DO PROFESSOR
                    </span>
                </div>

                <h1 className="text-3xl font-bold">
                    Realizar Chamada
                </h1>

                <p className="mt-3 text-blue-100">
                    Registre a presença dos alunos e as observações da aula.
                </p>
            </section>

            {!loading && !erro && aulaAtual && !podeEditarChamada && (
                <div
                    role="status"
                    className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800"
                >
                    <p className="font-semibold">
                        Chamada ainda não disponível
                    </p>

                    <p className="mt-2 text-sm">
                        {mensagemDisponibilidadeChamada(aulaAtual)}
                    </p>
                </div>
            )}

            {!aulaTurmaId ? (
                <p role="alert" className="text-red-600">
                    Aula não informada.
                </p>
            ) : loading ? (
                <p className="text-slate-500">
                    Carregando chamada...
                </p>
            ) : erro ? (
                <p role="alert" className="text-red-600">
                    {erro}
                </p>
            ) : (
                <>
                    <section className="grid gap-4 sm:grid-cols-3">

                        {[
                            {
                                titulo: "Presentes",
                                valor: totalPresentes,
                                icone: CheckCircle2
                            },
                            {
                                titulo: "Faltas",
                                valor: totalFaltas,
                                icone: XCircle
                            },
                            {
                                titulo: "Não marcados",
                                valor: totalPendentes,
                                icone: Users
                            }
                        ].map((item) => (
                            <div
                                key={item.titulo}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div>
                                    <p className="text-sm text-slate-500">
                                        {item.titulo}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-800">
                                        {item.valor}
                                    </p>
                                </div>

                                <item.icone
                                    size={26}
                                    className="text-blue-600"
                                />
                            </div>
                        ))}

                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-xl font-bold text-slate-800">
                            Alunos matriculados ({alunos.length})
                        </h2>

                        {alunos.length === 0 ? (
                            <p className="text-slate-500">
                                Nenhum aluno aprovado nesta turma.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {alunos.map((matricula) => (
                                    <article
                                        key={matricula._id}
                                        className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                {matricula.user?.name ??
                                                    "Aluno não encontrado"}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {matricula.user?.email ??
                                                    "E-mail indisponível"}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                aria-pressed={
                                                    presencas[matricula._id] === "PRESENTE"
                                                }
                                                onClick={() =>
                                                    marcarPresenca(
                                                        matricula._id,
                                                        "PRESENTE"
                                                    )
                                                }
                                                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${presencas[matricula._id] === "PRESENTE"
                                                    ? "bg-green-600 text-white"
                                                    : "border border-slate-300 bg-white text-slate-600 hover:bg-green-50"
                                                    }`}
                                            >
                                                Presente
                                            </button>

                                            <button
                                                type="button"
                                                aria-pressed={
                                                    presencas[matricula._id] === "FALTA"
                                                }
                                                onClick={() =>
                                                    marcarPresenca(
                                                        matricula._id,
                                                        "FALTA"
                                                    )
                                                }
                                                className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${presencas[matricula._id] === "FALTA"
                                                    ? "bg-red-600 text-white"
                                                    : "border border-slate-300 bg-white text-slate-600 hover:bg-red-50"
                                                    }`}
                                            >
                                                Falta
                                            </button>

                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        {aulaAtual?.status === "REALIZADA" && (
                            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-5">
                                <h3 className="font-bold text-green-800">
                                    Aula realizada
                                </h3>

                                <p className="mt-2 text-sm text-green-700">
                                    Esta aula já foi finalizada. Você ainda pode
                                    corrigir presenças, faltas e observações.
                                    Salve as alterações para atualizar a frequência.
                                </p>
                            </div>
                        )}

                        <h2 className="mb-4 text-xl font-bold text-slate-800">
                            Observações da aula
                        </h2>

                        <textarea
                            value={observacao}
                            onChange={(event) => {
                                setObservacao(event.target.value)
                                setMensagemSucesso("");
                                setErroSalvar("");
                                setAlteracoesPendentes(true);
                            }}
                            maxLength={1000}
                            rows={4}
                            placeholder="Descreva como foi a aula..."
                            className="w-full resize-y rounded-xl border border-slate-300 p-4 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {erroSalvar && (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700"
                            >
                                {erroSalvar}
                            </p>
                        )}

                        {mensagemSucesso && (
                            <p
                                role="status"
                                className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700"
                            >
                                {mensagemSucesso}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => void handleSalvarChamada()}
                                disabled={
                                    salvando ||
                                    alunos.length === 0 ||
                                    totalPendentes > 0
                                }
                                className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {salvando
                                    ? "Salvando..."
                                    : aulaAtual?.status === "REALIZADA"
                                        ? "Salvar correções"
                                        : "Salvar chamada"}
                            </button>
                        </div>
                    </section>

                    {aulaAtual?.status === "AGENDADA" && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold text-slate-800">
                                Finalização da aula
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Após salvar todas as presenças, confirme
                                que a aula foi realizada.
                            </p>

                            {erroFinalizacao && (
                                <p role="alert" className="mt-4 text-sm text-red-600">
                                    {erroFinalizacao}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={solicitarFinalizacao}
                                disabled={
                                    !chamadaSalva ||
                                    alteracoesPendentes ||
                                    alunos.length === 0 ||
                                    totalPendentes > 0 ||
                                    salvando ||
                                    finalizando
                                }
                                className="mt-5 cursor-pointer rounded-xl bg-[#0F172A] px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {finalizando ? "Finalizando..." : "Finalizar aula"}
                            </button>
                        </section>
                    )}

                    {sucessoFinalizacao && (
                        <p
                            role="status"
                            className="rounded-xl bg-green-50 p-4 font-medium text-green-700"
                        >
                            {sucessoFinalizacao}
                        </p>
                    )}
                </>
            )}
            <dialog
                ref={confirmacaoRef}
                onCancel={(event) => {
                    event.preventDefault();
                    setConfirmarAntecipada(false);
                }}
                aria-labelledby="titulo-finalizacao"
                className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl backdrop:bg-slate-900/60"
            >
                <h2
                    id="titulo-finalizacao"
                    className="text-xl font-bold text-slate-800"
                >
                    Finalizar aula antecipadamente?
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    O horário previsto de término ainda não chegou.
                    Ao confirmar, a aula será marcada como REALIZADA
                    e a chamada será contabilizada na frequência.
                </p>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setConfirmarAntecipada(false)}
                        className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-600"
                    >
                        Continuar na aula
                    </button>

                    <button
                        type="button"
                        onClick={() => void executarFinalizacao(true)}
                        disabled={finalizando}
                        className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Confirmar finalização
                    </button>
                </div>
            </dialog>
        </div>
    );
}