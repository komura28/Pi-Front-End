import { useEffect, useRef, useState } from "react";
import { ModalForms } from "../../components/ModalForms";
import { getUserById } from "../../services/userService";
import type { IUserDTO } from "../../types/user/user-types";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";
import { useOutletContext } from "react-router-dom";
import {
    Search,
    ClipboardCheck,
    UserRound,
    Eye,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import {
    aprovarMatricula,
    recusarMatricula,
    getMatriculas
} from "../../services/matriculaService";
import { SuccessDialog } from "../../components/ui/SuccessDialog";

type StatusTab = "PENDENTE" | "APROVADA" | "RECUSADA" | "CANCELADA";
type AdminOutletContext = {
    atualizarMatriculasPendentes: () => Promise<void>;
};

export function MatriculaPage() {
    const [matriculas, setMatriculas] = useState<MatriculaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [mostrarModalAprovacao, setMostrarModalAprovacao] = useState(false);
    const [mostrarModalRecusa, setMostrarModalRecusa] = useState(false);
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const [pesquisar, setPesquisar] = useState("");
    const [abaAtiva, setAbaAtiva] = useState<StatusTab>("PENDENTE");
    const { atualizarMatriculasPendentes } = useOutletContext<AdminOutletContext>();

    const [loadError, setLoadError] = useState("");
    const [actionError, setActionError] = useState("");

    const matriculasFiltro = matriculas.filter((matricula) => {
        const termo = pesquisar.trim().toLowerCase();
        const cpfPesquisado = pesquisar.replace(/\D/g, "");

        const correspondeBusca =
            !termo ||
            (matricula.user?.name ?? "")
                .toLowerCase().includes(termo) ||
            (matricula.user?.email ?? "")
                .toLowerCase().includes(termo) ||
            (matricula.turma?.curso?.name ?? "")
                .toLowerCase().includes(termo) ||
            (
                cpfPesquisado.length >= 3 &&
                String(matricula.user?.cpf ?? "")
                    .includes(cpfPesquisado)
            );

        return (
            matricula.status === abaAtiva &&
            correspondeBusca
        );
    });

    const [processandoDecisao, setProcessandoDecisao] = useState(false);

    const matriculasPaginaAtual = matriculasFiltro.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const [matriculaSelecionada, setMatriculaSelecionada] = useState<MatriculaDTO | null>(null);
    const [isModalVisualizarOpen, setIsModalVisualizarOpen] = useState(false);
    const [dadosMatricula, setDadosMatricula] = useState<IUserDTO | null>(null);

    const [carregandoDados, setCarregandoDados] = useState(false);
    const [erroDados, setErroDados] = useState("");

    const requisicaoDadosId = useRef(0);

    const totalPendentes = matriculas.filter((m) => m.status === "PENDENTE").length;
    const totalAprovadas = matriculas.filter((m) => m.status === "APROVADA").length;
    const totalRecusadas = matriculas.filter((m) => m.status === "RECUSADA").length;
    const totalCanceladas = matriculas.filter((m) => m.status === "CANCELADA").length;

    async function handleDecisao(
        id: string,
        status: "APROVADA" | "RECUSADA"
    ) {
        if (processandoDecisao) return;

        try {
            setProcessandoDecisao(true);
            setActionError("");

            if (status === "APROVADA") {
                await aprovarMatricula(id);
            } else {
                await recusarMatricula(id);
            }

            setMatriculas((listaAtual) =>
                listaAtual.map((matricula) =>
                    matricula._id === id
                        ? { ...matricula, status }
                        : matricula
                )
            );

            setPaginaAtual(1);
            setIsModalOpen(false);
            setMatriculaSelecionada(null);
            setIdSelecionado(null);
            limparDadosConsulta();

            if (status === "APROVADA") {
                setMostrarModalAprovacao(true);
            } else {
                setMostrarModalRecusa(true);
            }

            try {
                await atualizarMatriculasPendentes();
            } catch (error) {
                console.error("Erro ao sincronizar contador:", error);
                setActionError(
                    "A matrícula foi atualizada, mas o contador de pendências não pôde ser sincronizado."
                );
            }

        } catch (error) {
            console.error("Erro ao atualizar matrícula:", error);
            setActionError(
                "Não foi possível atualizar o status da matrícula."
            );
        } finally {
            setProcessandoDecisao(false);
        }
    }

    useEffect(() => {
        async function buscarMatriculas() {
            try {
                setLoadError("");

                const data =
                    await getMatriculas();

                setMatriculas(data);
            } catch {
                setLoadError(
                    "Erro ao carregar os dados do servidor"
                );
            } finally {
                setLoading(false);
            }
        }

        buscarMatriculas();
    }, []);


    async function buscarMatricula(userId: string) {
        const requisicaoAtual = ++requisicaoDadosId.current;

        setDadosMatricula(null);
        setErroDados("");
        setCarregandoDados(true);

        try {
            const formulario = await getUserById(userId);

            if (requisicaoAtual === requisicaoDadosId.current) {
                setDadosMatricula(formulario);
            }
        } catch (error) {
            console.error("Erro ao carregar candidato:", error);

            if (requisicaoAtual === requisicaoDadosId.current) {
                setErroDados(
                    "Não foi possível carregar os dados completos do candidato."
                );
            }
        } finally {
            if (requisicaoAtual === requisicaoDadosId.current) {
                setCarregandoDados(false);
            }
        }
    }

    function limparDadosConsulta() {
        requisicaoDadosId.current += 1;

        setDadosMatricula(null);
        setErroDados("");
        setCarregandoDados(false);
    }


    function abrirAnalise(matricula: MatriculaDTO) {
        if (!matricula.user?._id) return;

        setActionError("");
        setMatriculaSelecionada(matricula);
        setIdSelecionado(matricula._id);
        setIsModalOpen(true);

        void buscarMatricula(matricula.user._id);
    }

    function fecharAnalise() {
        if (processandoDecisao) return;

        setIsModalOpen(false);
        setMatriculaSelecionada(null);
        setIdSelecionado(null);
        setActionError("");

        limparDadosConsulta();
    }


    function abrirVisualizacao(matricula: MatriculaDTO) {
        setMatriculaSelecionada(matricula);
        setIsModalVisualizarOpen(true);

        if (matricula.user?._id) {
            void buscarMatricula(matricula.user._id);
        } else {
            limparDadosConsulta();
            setErroDados(
                "Os dados completos deste usuário não estão disponíveis."
            );
        }
    }

    function fecharVisualizacao() {
        setIsModalVisualizarOpen(false);
        setMatriculaSelecionada(null);

        limparDadosConsulta();
    }

    const colunas: TableColumn<MatriculaDTO>[] = [
        {
            id: "aluno",
            titulo: "Aluno",
            renderizar: (matricula) => (
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                        <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                            {matricula.user?.name ?? "Usuário não disponível"}
                        </p>

                        <p className="text-xs text-slate-500">
                            {matricula.user?.email ?? "E-mail não disponível"}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "cpf",
            titulo: "CPF",
            renderizar: (matricula) => {
                if (!matricula.user?.cpf) return "Não disponível";

                const cpf = String(matricula.user.cpf).padStart(11, "0");

                return (
                    <span className="font-mono text-sm text-slate-600">
                        ***.***.{cpf.slice(6, 9)}-{cpf.slice(9)}
                    </span>
                );
            }
        },
        {
            id: "curso",
            titulo: "Curso",
            renderizar: (matricula) => (
                <span className="font-medium text-slate-700">
                    {matricula.turma?.curso?.name ?? "Curso não disponível"}
                </span>
            )
        },
        {
            id: "turno",
            titulo: "Turno",
            renderizar: (matricula) =>
                matricula.turma?.turno ?? "-"
        },
        {
            id: "status",
            titulo: "Situação",
            renderizar: (matricula) => {
                const estilos = {
                    PENDENTE: "bg-amber-50 text-amber-700",
                    APROVADA: "bg-green-50 text-green-700",
                    RECUSADA: "bg-red-50 text-red-700",
                    CANCELADA: "bg-slate-100 text-slate-600"
                };

                const nomes = {
                    PENDENTE: "Pendente",
                    APROVADA: "Aprovada",
                    RECUSADA: "Recusada",
                    CANCELADA: "Cancelada"
                };

                return (
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[matricula.status]}`}
                    >
                        {nomes[matricula.status]}
                    </span>
                );
            }
        }
    ];

    const abas: {
        status: StatusTab;
        nome: string;
        total: number;
    }[] = [
            { status: "PENDENTE", nome: "Pendentes", total: totalPendentes },
            { status: "APROVADA", nome: "Aprovadas", total: totalAprovadas },
            { status: "RECUSADA", nome: "Recusadas", total: totalRecusadas },
            { status: "CANCELADA", nome: "Canceladas", total: totalCanceladas }
        ];

    if (loading) {
        return <div className="p-4 sm:p-8"><p>Carregando...</p></div>;
    }

    if (loadError) {
        return (
            <div className="p-4 sm:p-8">
                <p>Erro: {loadError}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <PageHeader
                titulo="Gerenciamento de Matrículas"
                descricao="Acompanhe solicitações e gerencie as matrículas dos alunos."
                categoria="PAINEL ADMINISTRATIVO"
                icone={ClipboardCheck}
            />

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">

                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Solicitações de matrícula
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Consulte, aprove, recuse e acompanhe as solicitações.
                    </p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 border-b border-slate-200 pb-4 sm:mb-6 sm:flex sm:flex-wrap">
                    {abas.map((aba) => (
                        <button
                            key={aba.status}
                            type="button"
                            onClick={() => {
                                setAbaAtiva(aba.status);
                                setPaginaAtual(1);
                            }}
                            aria-pressed={abaAtiva === aba.status}
                            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${abaAtiva === aba.status
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            {aba.nome}

                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${abaAtiva === aba.status
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-200 text-slate-600"
                                    }`}
                            >
                                {aba.total}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative mb-4 w-full max-w-lg sm:mb-6">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={pesquisar}
                        onChange={(evento) => {
                            setPesquisar(evento.target.value);
                            setPaginaAtual(1);
                        }}
                        placeholder="Buscar por nome, CPF, e-mail ou curso..."
                        aria-label="Pesquisar matrículas"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {actionError && (
                    <p
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {actionError}
                    </p>
                )}

                <DataTable
                    dados={matriculasPaginaAtual}
                    colunas={colunas}
                    chave={(matricula) => matricula._id}
                    mensagemVazia="Nenhuma matrícula encontrada."
                    rotuloAcoes={(matricula) =>
                        `Ações da matrícula de ${matricula.user?.name ?? "usuário"}`
                    }

                    acoes={(matricula) =>
                        matricula.status === "PENDENTE"
                            ? [
                                {
                                    texto: "Analisar matrícula",
                                    icone: ClipboardCheck,
                                    disabled: !matricula.user?._id,
                                    executar: () => abrirAnalise(matricula)
                                },
                                {
                                    texto: "Ver detalhes",
                                    icone: Eye,
                                    executar: () => abrirVisualizacao(matricula)
                                }
                            ]
                            : [
                                {
                                    texto: "Ver detalhes",
                                    icone: Eye,
                                    executar: () => abrirVisualizacao(matricula)
                                }
                            ]
                    }
                />

                <div className="mt-5">
                    <Pagination
                        paginaAtual={paginaAtual}
                        totalItens={matriculasFiltro.length}
                        itensPorPagina={itensPorPagina}
                        onPageChange={setPaginaAtual}
                    />
                </div>
            </section>

            {isModalOpen && matriculaSelecionada && (
                <ModalForms
                    aberto={isModalOpen}
                    titulo="Analisar matrícula"
                    message="Confira as informações do candidato e decida sobre a solicitação."
                    modo="ANALISE"
                    matricula={matriculaSelecionada}
                    dados_formulario={dadosMatricula}
                    carregando={processandoDecisao}
                    carregandoDados={carregandoDados}
                    erro={actionError}
                    erroDados={erroDados}
                    aoTentarNovamente={() => {
                        if (matriculaSelecionada.user?._id) {
                            void buscarMatricula(matriculaSelecionada.user._id);
                        }
                    }}
                    aoAprovar={() => {
                        if (idSelecionado) {
                            void handleDecisao(idSelecionado, "APROVADA");
                        }
                    }}
                    aoRecusar={() => {
                        if (idSelecionado) {
                            void handleDecisao(idSelecionado, "RECUSADA");
                        }
                    }}
                    opNao={fecharAnalise}
                />
            )}

            {isModalVisualizarOpen && matriculaSelecionada && (
                <ModalForms
                    aberto={isModalVisualizarOpen}
                    titulo="Detalhes da matrícula"
                    message="Consulte os dados do candidato e da solicitação."
                    modo="VISUALIZACAO"
                    matricula={matriculaSelecionada}
                    dados_formulario={dadosMatricula}
                    carregandoDados={carregandoDados}
                    erroDados={erroDados}
                    aoTentarNovamente={() => {
                        if (matriculaSelecionada.user?._id) {
                            void buscarMatricula(matriculaSelecionada.user._id);
                        }
                    }}
                    opNao={fecharVisualizacao}
                />
            )}


            <SuccessDialog
                aberto={mostrarModalAprovacao}
                aoFechar={() => setMostrarModalAprovacao(false)}
                titulo="Matrícula aprovada!"
                mensagem="A solicitação foi aprovada com sucesso e já aparece na lista de matrículas aprovadas."
            />

            <SuccessDialog
                aberto={mostrarModalRecusa}
                aoFechar={() => setMostrarModalRecusa(false)}
                titulo="Matrícula recusada!"
                mensagem="A solicitação foi recusada e já aparece na lista de matrículas recusadas."
            />

        </div>
    )
}