import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";

import {
    Award,
    CheckCircle2,
    Clock3,
    Download,
    FileCheck2,
    UsersRound
} from "lucide-react";

import { getTurma } from "../../services/authService";

import {
    getElegibilidadeTurma,
    getCertificadosEmitidos,
    emitirCertificado,
    baixarCertificado
} from "../../services/certificadoService";

import type {
    TurmaMatricula
} from "../../types/auth/auth-types";

import type {
    AlunoElegibilidade,
    CertificadoEmitido,
    ElegibilidadeTurma
} from "../../types/certificado/certificado-types";

import { PageHeader } from "../../components/ui/PageHeader";
import { TurmaSelector } from "../../components/turmas/TurmaSelector";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { AppDialog } from "../../components/ui/AppDialog";

const POR_PAGINA = 5;

function mensagemErro(error: unknown): string {
    if (isAxiosError(error)) {
        const resposta = error.response?.data as
            | { message?: unknown; error?: unknown }
            | undefined;

        const mensagem = resposta?.message ?? resposta?.error;

        if (typeof mensagem === "string") {
            return mensagem;
        }
    }

    return error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado.";
}

export function CertificadosPage() {
    const [turmas, setTurmas] =
        useState<TurmaMatricula[]>([]);

    const [turmaSelecionada, setTurmaSelecionada] =
        useState<TurmaMatricula | null>(null);

    const [elegibilidade, setElegibilidade] =
        useState<ElegibilidadeTurma | null>(null);

    const [emitidos, setEmitidos] =
        useState<CertificadoEmitido[]>([]);

    const [carregandoTurmas, setCarregandoTurmas] =
        useState(true);

    const [carregandoPainel, setCarregandoPainel] =
        useState(false);

    const [emitindoId, setEmitindoId] =
        useState<string | null>(null);

    const [baixandoId, setBaixandoId] =
        useState<string | null>(null);

    const [confirmacao, setConfirmacao] =
        useState<AlunoElegibilidade | null>(null);

    const [buscaTurma, setBuscaTurma] = useState("");
    const [buscaAluno, setBuscaAluno] = useState("");

    const [paginaTurmas, setPaginaTurmas] = useState(1);
    const [paginaAlunos, setPaginaAlunos] = useState(1);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const requisicaoId = useRef(0);

    useEffect(() => {
        const requisicaoIdRef = requisicaoId;
        let ativo = true;

        async function carregarTurmas() {
            try {
                const resultado = await getTurma();

                if (ativo) {
                    setTurmas(resultado);
                }
            } catch (error) {
                if (ativo) {
                    setErro(mensagemErro(error));
                }
            } finally {
                if (ativo) {
                    setCarregandoTurmas(false);
                }
            }
        }

        void carregarTurmas();

        return () => {
            ativo = false;
            requisicaoIdRef.current++;
        };
    }, []);

    async function selecionarTurma(
        turma: TurmaMatricula
    ) {
        const requisicaoAtual = ++requisicaoId.current;

        setTurmaSelecionada(turma);
        setElegibilidade(null);
        setEmitidos([]);
        setBuscaAluno("");
        setPaginaAlunos(1);
        setConfirmacao(null);
        setErro("");
        setSucesso("");
        setCarregandoPainel(true);

        try {
            const [dados, certificados] = await Promise.all([
                getElegibilidadeTurma(turma.turma._id),
                getCertificadosEmitidos(turma.turma._id)
            ]);

            if (requisicaoAtual !== requisicaoId.current) {
                return;
            }

            setElegibilidade(dados);
            setEmitidos(certificados);

        } catch (error) {
            if (requisicaoAtual === requisicaoId.current) {
                setErro(mensagemErro(error));
            }
        } finally {
            if (requisicaoAtual === requisicaoId.current) {
                setCarregandoPainel(false);
            }
        }
    }

    async function confirmarEmissao() {
        if (
            !confirmacao ||
            !turmaSelecionada ||
            emitindoId
        ) {
            return;
        }

        const matriculaId = confirmacao.matriculaId;
        const turmaId = turmaSelecionada.turma._id;

        setEmitindoId(matriculaId);
        setErro("");
        setSucesso("");

        try {
            await emitirCertificado(matriculaId);

            // Atualiza os indicadores após a emissão
            const [dados, certificados] = await Promise.all([
                getElegibilidadeTurma(turmaId),
                getCertificadosEmitidos(turmaId)
            ]);

            setElegibilidade(dados);
            setEmitidos(certificados);
            setConfirmacao(null);

            setSucesso(
                "Certificado emitido com sucesso!"
            );

        } catch (error) {
            setErro(mensagemErro(error));
        } finally {
            setEmitindoId(null);
        }
    }

    async function baixar(
        certificado: CertificadoEmitido
    ) {
        if (baixandoId) return;

        setBaixandoId(certificado._id);
        setErro("");

        try {
            await baixarCertificado(
                certificado._id,
                certificado.codigoVerificacao
            );
        } catch (error) {
            setErro(mensagemErro(error));
        } finally {
            setBaixandoId(null);
        }
    }

    const termoTurma = buscaTurma.trim().toLowerCase();

    const turmasFiltradas = turmas.filter((item) => {
        const nome = item.turma.curso?.name ?? "";
        const turno = item.turma.turno;

        return `${nome} ${turno}`
            .toLowerCase()
            .includes(termoTurma);
    });

    const turmasPaginadas = turmasFiltradas.slice(
        (paginaTurmas - 1) * POR_PAGINA,
        paginaTurmas * POR_PAGINA
    );

    const termoAluno = buscaAluno.trim().toLowerCase();

    const alunosFiltrados = (
        elegibilidade?.alunos ?? []
    ).filter((aluno) =>
        aluno.nome.toLowerCase().includes(termoAluno) ||
        (aluno.email ?? "").toLowerCase().includes(termoAluno)
    );

    const alunosPaginados = alunosFiltrados.slice(
        (paginaAlunos - 1) * POR_PAGINA,
        paginaAlunos * POR_PAGINA
    );

    const certificadosPorMatricula = new Map(
        emitidos
            .filter((item) => Boolean(item.matricula))
            .map((item) => [item.matricula, item])
    );

    const pendentesEmissao = (
        elegibilidade?.alunos ?? []
    ).filter(
        (aluno) =>
            aluno.elegivel &&
            !certificadosPorMatricula.has(aluno.matriculaId)
    ).length;

    const colunas: TableColumn<AlunoElegibilidade>[] = [
        {
            id: "aluno",
            titulo: "Aluno",
            renderizar: (aluno) => (
                <div>
                    <p className="font-semibold text-slate-800">
                        {aluno.nome}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {aluno.email ?? "E-mail não informado"}
                    </p>
                </div>
            )
        },
        {
            id: "frequencia",
            titulo: "Frequência",
            renderizar: (aluno) => (
                <div>
                    <p className="font-semibold text-slate-800">
                        {aluno.frequenciaPercentual === null
                            ? "Não calculada"
                            : `${aluno.frequenciaPercentual}%`}
                    </p>

                    <p className="text-xs text-slate-500">
                        {aluno.presentes} presenças
                        {" · "}
                        {aluno.faltas} faltas
                    </p>
                </div>
            )
        },
        {
            id: "situacao",
            titulo: "Situação",
            renderizar: (aluno) => {
                const certificado =
                    certificadosPorMatricula.get(aluno.matriculaId);

                if (certificado) {
                    return (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <FileCheck2 size={14} />
                            Emitido
                        </span>
                    );
                }

                if (aluno.elegivel) {
                    return (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={14} />
                            Elegível
                        </span>
                    );
                }

                return (
                    <div className="max-w-xs">
                        <span className="font-semibold text-amber-700">
                            Não elegível
                        </span>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {aluno.motivos.join(" ")}
                        </p>
                    </div>
                );
            }
        },
        {
            id: "acao",
            titulo: "Ação",
            renderizar: (aluno) => {
                const certificado =
                    certificadosPorMatricula.get(aluno.matriculaId);

                const ocupado =
                    emitindoId !== null ||
                    baixandoId !== null;

                if (certificado) {
                    return (
                        <button
                            type="button"
                            disabled={ocupado}
                            onClick={() => {
                                void baixar(certificado);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Download size={15} />
                            {baixandoId === certificado._id
                                ? "Baixando..."
                                : "Baixar PDF"}
                        </button>
                    );
                }

                if (!aluno.elegivel) {
                    return (
                        <span className="text-xs text-slate-400">
                            Indisponível
                        </span>
                    );
                }

                return (
                    <button
                        type="button"
                        disabled={ocupado}
                        onClick={() => {
                            setErro("");
                            setConfirmacao(aluno);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        <Award size={15} />
                        Emitir
                    </button>
                );
            }
        }
    ];

    return (
        <main className="@container mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">
            <PageHeader
                titulo="Gerenciamento de Certificados"
                descricao="Acompanhe a conclusão das turmas e emita certificados para os alunos elegíveis."
                categoria="PAINEL ADMINISTRATIVO"
                icone={Award}
            />

            {erro && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {erro}
                </p>
            )}

            {sucesso && (
                <p
                    role="status"
                    className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >
                    {sucesso}
                </p>
            )}

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 @2xl:grid-cols-[minmax(220px,28%)_minmax(0,1fr)] @4xl:gap-6">

                {/* COLUNA ESQUERDA */}
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    {carregandoTurmas ? (
                        <p className="text-sm text-slate-500">
                            Carregando turmas...
                        </p>
                    ) : (
                        <>
                            <TurmaSelector
                                turmas={turmasPaginadas}
                                selecionadaId={
                                    turmaSelecionada?.turma._id ?? null
                                }
                                descricao="Selecione uma turma para consultar e emitir certificados."
                                busca={buscaTurma}
                                onBuscaChange={(valor) => {
                                    setBuscaTurma(valor);
                                    setPaginaTurmas(1);
                                }}
                                onSelecionar={(turma) => {
                                    if (emitindoId) return;
                                    void selecionarTurma(turma);
                                }}
                            />

                            {turmasFiltradas.length > POR_PAGINA && (
                                <div className="mt-5">
                                    <Pagination
                                        paginaAtual={paginaTurmas}
                                        totalItens={turmasFiltradas.length}
                                        itensPorPagina={POR_PAGINA}
                                        onPageChange={setPaginaTurmas}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* COLUNA DIREITA */}
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                    {!turmaSelecionada ? (
                        <div className="flex min-h-80 flex-col items-center justify-center text-center">
                            <Award
                                size={40}
                                className="text-blue-600"
                            />

                            <h2 className="mt-4 text-xl font-bold text-slate-800">
                                Selecione uma turma
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Consulte a elegibilidade e os certificados emitidos.
                            </p>
                        </div>
                    ) : carregandoPainel ? (
                        <p role="status" className="py-12 text-center text-slate-500">
                            Carregando certificados...
                        </p>
                    ) : !elegibilidade ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Não foi possível carregar os dados desta turma.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    void selecionarTurma(turmaSelecionada);
                                }}
                                className="mt-4 font-semibold text-blue-700 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Turma selecionada
                                </p>

                                <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                                    {elegibilidade.turma.curso}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Turno: {elegibilidade.turma.turno}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                                <Indicador
                                    titulo="Alunos aprovados"
                                    valor={elegibilidade.resumo.alunosAprovados}
                                    icone={<UsersRound size={19} />}
                                />

                                <Indicador
                                    titulo="Elegíveis"
                                    valor={elegibilidade.resumo.alunosElegiveis}
                                    icone={<CheckCircle2 size={19} />}
                                />

                                <Indicador
                                    titulo="Emitidos"
                                    valor={emitidos.length}
                                    icone={<FileCheck2 size={19} />}
                                />

                                <Indicador
                                    titulo="A emitir"
                                    valor={pendentesEmissao}
                                    icone={<Clock3 size={19} />}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="font-semibold text-slate-800">
                                    {elegibilidade.resumo.turmaConcluida
                                        ? "Turma concluída"
                                        : "Turma em andamento"}
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    {elegibilidade.resumo.aulasRealizadas}
                                    {" de "}
                                    {elegibilidade.resumo.aulasObrigatorias}
                                    {" aulas obrigatórias realizadas"}
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    Carga horária:{" "}
                                    {elegibilidade.resumo.cargaHorariaHoras} h
                                    {" · Frequência mínima: "}
                                    {elegibilidade.frequenciaMinima}%
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Alunos da turma
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Consulte a situação e emita os certificados disponíveis.
                                </p>
                            </div>

                            <input
                                type="search"
                                value={buscaAluno}
                                onChange={(evento) => {
                                    setBuscaAluno(evento.target.value);
                                    setPaginaAlunos(1);
                                }}
                                placeholder="Buscar aluno por nome ou e-mail..."
                                aria-label="Pesquisar alunos para certificados"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            />

                            <DataTable
                                dados={alunosPaginados}
                                colunas={colunas}
                                chave={(aluno) => aluno.matriculaId}
                                mensagemVazia="Nenhum aluno encontrado."
                            />

                            {alunosFiltrados.length > POR_PAGINA && (
                                <Pagination
                                    paginaAtual={paginaAlunos}
                                    totalItens={alunosFiltrados.length}
                                    itensPorPagina={POR_PAGINA}
                                    onPageChange={setPaginaAlunos}
                                />
                            )}
                        </div>
                    )}
                </section>
            </div>

            <AppDialog
                aberto={Boolean(confirmacao)}
                aoFechar={() => {
                    if (!emitindoId) setConfirmacao(null);
                }}
                titulo="Confirmar emissão"
                descricao="Verifique os dados antes de emitir o certificado."
                icone={Award}
                salvando={Boolean(emitindoId)}
                rodape={
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            disabled={Boolean(emitindoId)}
                            onClick={() => setConfirmacao(null)}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            disabled={Boolean(emitindoId)}
                            onClick={() => {
                                void confirmarEmissao();
                            }}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {emitindoId
                                ? "Emitindo..."
                                : "Confirmar emissão"}
                        </button>
                    </div>
                }
            >
                <p className="text-sm leading-relaxed text-slate-600">
                    Emitir o certificado de{" "}
                    <strong>{confirmacao?.nome}</strong>
                    {" para o curso "}
                    <strong>{elegibilidade?.turma.curso}</strong>?
                </p>
            </AppDialog>
        </main>
    );
}

function Indicador({
    titulo,
    valor,
    icone
}: Readonly<{
    titulo: string;
    valor: number;
    icone: React.ReactNode;
}>) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-blue-600">
                {icone}
            </div>

            <p className="mt-3 text-xs text-slate-500">
                {titulo}
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-800">
                {valor}
            </p>
        </div>
    );
}
