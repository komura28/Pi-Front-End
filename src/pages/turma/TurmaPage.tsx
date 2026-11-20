import { useEffect, useState } from "react";
import type { authCurso, authTurma, TurmaMatricula } from "../../types/auth/auth-types";
import { deletarTurmaAPI, editarTurmaAPI, getCurso, getTurma } from "../../services/authService";
import { formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { Pencil, Plus, Save, Trash2, Users } from "lucide-react";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";
import { AppDialog } from "../../components/ui/AppDialog";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { SuccessDialog } from "../../components/ui/SuccessDialog";

export function TurmaPage() {
    const navigate = useNavigate();
    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [erroExclusao, setErroExclusao] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const indicePrimeiroItem = (paginaAtual - 1) * itensPorPagina;
    const turmasPaginadas = turmas.slice(
        indicePrimeiroItem,
        indicePrimeiroItem + itensPorPagina
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [turmaToEditId, setTurmaToEditId] = useState<string | null>(null);
    const [editCurso, setEditCurso] = useState("");
    const [editCapacidade, setEditCapacidade] = useState("");
    const [editTurno, setEditTurno] = useState("");
    const [editDataInicio, setEditDataInicio] = useState("");
    const [editDataFim, setEditDataFim] = useState("");
    const [cursos, setCursos] = useState<authCurso[]>([]);
    const cursoSelecionado = cursos.find(
        (curso) => curso._id === editCurso
    );
    const dataFimInvalida = Boolean(
        editDataInicio && editDataFim && new Date(editDataFim) <= new Date(editDataInicio)
    );
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");


    async function handleExclusao() {
        if (!idSelecionado || isDeleting) return;

        try {
            setIsDeleting(true);
            setErroExclusao("");

            await deletarTurmaAPI(idSelecionado);

            const novaLista = turmas.filter(
                (item) => item.turma._id !== idSelecionado
            );

            setTurmas(novaLista);

            const totalPaginas = Math.max(
                1,
                Math.ceil(novaLista.length / itensPorPagina)
            );

            setPaginaAtual((pagina) =>
                Math.min(pagina, totalPaginas)
            );

            setIsModalOpen(false);
            setIdSelecionado(null);
            setMostrarModalExclusao(true);

        } catch (error) {
            console.error("Erro ao desativar turma:", error);

            setErroExclusao(
                "Não foi possível desativar a turma. Verifique se existem alunos com matrícula aprovada."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                setError("");

                const [turmasData, cursosData] =
                    await Promise.all([
                        getTurma(),
                        getCurso(),
                    ]);

                setTurmas(turmasData);
                setCursos(cursosData);

            } catch (error) {
                console.error(
                    "Erro ao carregar turmas:",
                    error
                );

                setError(
                    "Erro ao carregar os dados das turmas"
                );
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    if (loading) {
        return <div className="p-4 sm:p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-4 sm:p-8"><p>Erro: {error}</p></div>;
    }

    function abrirModalEdicao(turma: authTurma) {
        setTurmaToEditId(turma._id);
        setEditCurso(turma.curso?._id || "");
        setEditCapacidade(turma.capacidade.toString());
        setEditTurno(turma.turno);
        setEditDataInicio(turma.dataInicio.split("T")[0]);
        setEditDataFim(turma.dataFim.split("T")[0]);
        setIsEditModalOpen(true);
    }

    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setTurmaToEditId(null);
        setEditCurso("");
        setEditCapacidade("");
        setEditTurno("");
        setEditDataInicio("");
        setEditDataFim("");
    }

    function confirmarExclusaoTurma(id: string) {
        setIdSelecionado(id);
        setErroExclusao("");
        setIsModalOpen(true);
    }

    function fecharModalExclusaoTurma() {
        if (isDeleting) return;

        setIsModalOpen(false);
        setIdSelecionado(null);
        setErroExclusao("");
    }

    async function handleSalvarEdicao() {
        if (!turmaToEditId || isSavingEdit) return;

        const capacidade = Number(editCapacidade);

        if (!editCurso || !editTurno) {
            setErroEdicao("Selecione o curso e o turno.");
            return;
        }

        if (!Number.isInteger(capacidade) || capacidade < 1) {
            setErroEdicao("A capacidade deve ser um número maior que zero.");
            return;
        }

        if (!editDataInicio || !editDataFim || dataFimInvalida) {
            setErroEdicao("Informe um período válido para a turma.");
            return;
        }

        try {
            setIsSavingEdit(true);
            setErroEdicao("");

            await editarTurmaAPI(turmaToEditId, {
                curso: editCurso,
                capacidade,
                turno: editTurno,
                dataInicio: editDataInicio,
                dataFim: editDataFim
            });

            setTurmas((anteriores) =>
                anteriores.map((item) =>
                    item.turma._id === turmaToEditId
                        ? {
                            ...item,
                            turma: {
                                ...item.turma,
                                curso: cursoSelecionado || item.turma.curso,
                                capacidade,
                                turno: editTurno,
                                dataInicio: editDataInicio,
                                dataFim: editDataFim
                            }
                        }
                        : item
                )
            );

            fecharModalEdicao();
            setMostrarModalEdicao(true);

        } catch (error) {
            console.error("Erro ao atualizar turma:", error);
            setErroEdicao(
                "Não foi possível salvar as alterações da turma."
            );
        } finally {
            setIsSavingEdit(false);
        }
    }

    const colunas: TableColumn<TurmaMatricula>[] = [
        {
            id: "curso",
            titulo: "Curso",
            renderizar: (item) => (
                <span className="font-semibold text-slate-800">
                    {item.turma.curso?.name ?? "Curso não definido"}
                </span>
            )
        },
        {
            id: "turno",
            titulo: "Turno",
            renderizar: (item) => (
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.turma.turno}
                </span>
            )
        },
        {
            id: "capacidade",
            titulo: "Capacidade",
            renderizar: (item) => (
                <span>{item.turma.capacidade} vagas</span>
            )
        },
        {
            id: "inicio",
            titulo: "Data de início",
            renderizar: (item) =>
                formatDate(item.turma.dataInicio)
        },
        {
            id: "fim",
            titulo: "Data de término",
            renderizar: (item) =>
                formatDate(item.turma.dataFim)
        }
    ];

    return (
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <PageHeader
                titulo="Gerenciamento de Turmas"
                descricao="Visualize, cadastre e gerencie as turmas do Aticurando."
                categoria="PAINEL ADMINISTRATIVO"
                icone={Users}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/register-turma")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 sm:w-auto sm:text-base"
                    >
                        <Plus size={18} />
                        Nova Turma
                    </button>
                }
            />

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-800 sm:mb-5 sm:text-xl">
                    Turmas cadastradas
                </h2>

                <DataTable
                    dados={turmasPaginadas}
                    colunas={colunas}
                    chave={(item) => item.turma._id}
                    mensagemVazia="Nenhuma turma cadastrada."
                    rotuloAcoes={(item) =>
                        `Ações da turma ${item.turma.curso?.name ?? ""}`
                    }
                    acoes={(item) => [
                        {
                            texto: "Editar turma",
                            icone: Pencil,
                            executar: () => abrirModalEdicao(item.turma)
                        },
                        {
                            texto: "Desativar turma",
                            icone: Trash2,
                            perigosa: true,
                            disabled: isDeleting,
                            executar: () => confirmarExclusaoTurma(item.turma._id)
                        }
                    ]}
                />

                <div className="mt-5">
                    <Pagination
                        paginaAtual={paginaAtual}
                        totalItens={turmas.length}
                        itensPorPagina={itensPorPagina}
                        onPageChange={setPaginaAtual}
                    />
                </div>
            </section>

            <ConfirmDialog
                aberto={isModalOpen}
                aoFechar={fecharModalExclusaoTurma}
                aoConfirmar={() => {
                    void handleExclusao();
                }}
                titulo="Desativar turma"
                descricao="Confirme a desativação da turma selecionada."
                nomeRegistro={
                    turmas.find(
                        (item) => item.turma._id === idSelecionado
                    )?.turma.curso?.name ?? "Turma selecionada"
                }
                textoConfirmar="Desativar turma"
                carregando={isDeleting}
                erro={erroExclusao}
            />

            <SuccessDialog
                aberto={mostrarModalExclusao}
                aoFechar={() => setMostrarModalExclusao(false)}
                titulo="Turma desativada!"
                mensagem="A turma foi desativada com sucesso e removida da listagem de turmas ativas."
            />

            <SuccessDialog
                aberto={mostrarModalEdicao}
                aoFechar={() => setMostrarModalEdicao(false)}
                titulo="Turma atualizada!"
                mensagem="As informações da turma foram atualizadas com sucesso."
            />

            <AppDialog
                aberto={isEditModalOpen}
                aoFechar={fecharModalEdicao}
                titulo="Editar turma"
                descricao="Atualize as informações da turma selecionada."
                icone={Pencil}
                tamanho="lg"
                salvando={isSavingEdit}
                rodape={
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={fecharModalEdicao}
                            disabled={isSavingEdit}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="form-editar-turma"
                            disabled={isSavingEdit || dataFimInvalida}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={17} />
                            {isSavingEdit ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                }
            >
                <form
                    id="form-editar-turma"
                    onSubmit={(evento) => {
                        evento.preventDefault();
                        void handleSalvarEdicao();
                    }}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="edit-turma-curso"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Curso *
                        </label>

                        <select
                            id="edit-turma-curso"
                            required
                            value={editCurso}
                            onChange={(e) => setEditCurso(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Selecione um curso</option>

                            {cursos.map((curso) => (
                                <option key={curso._id} value={curso._id}>
                                    {curso.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="edit-turma-capacidade"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Capacidade *
                            </label>

                            <input
                                id="edit-turma-capacidade"
                                type="number"
                                min={1}
                                step={1}
                                required
                                value={editCapacidade}
                                onChange={(e) => setEditCapacidade(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="edit-turma-turno"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Turno *
                            </label>

                            <select
                                id="edit-turma-turno"
                                required
                                value={editTurno}
                                onChange={(e) => setEditTurno(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Selecione um turno</option>
                                <option value="MANHA">Manhã</option>
                                <option value="TARDE">Tarde</option>
                                <option value="NOITE">Noite</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="edit-turma-inicio"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Data de início *
                            </label>

                            <input
                                id="edit-turma-inicio"
                                type="date"
                                required
                                value={editDataInicio}
                                onChange={(e) => setEditDataInicio(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="edit-turma-fim"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Data de término *
                            </label>

                            <input
                                id="edit-turma-fim"
                                type="date"
                                required
                                min={editDataInicio || undefined}
                                value={editDataFim}
                                onChange={(e) => setEditDataFim(e.target.value)}
                                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 ${dataFimInvalida
                                    ? "border-red-400 focus:ring-red-100"
                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                            />
                        </div>
                    </div>

                    {dataFimInvalida && (
                        <p className="text-sm text-red-600" role="alert">
                            A data de término deve ser posterior à data de início.
                        </p>
                    )}

                    {erroEdicao && (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            {erroEdicao}
                        </p>
                    )}
                </form>
            </AppDialog>

        </div>
    );
}