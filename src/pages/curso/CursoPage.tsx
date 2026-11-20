import { useEffect, useState } from "react";
import type { authCurso, authMateria } from "../../types/auth/auth-types";
import { deletarCursoAPI, getCurso, editarCursoAPI, editarMateriaAPI, adicionarMateriaCursoAPI, removerMateriaCursoAPI } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import {
    DataTable,
    type TableColumn
} from "../../components/ui/DataTable";
import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    Layers3
} from "lucide-react";
import { AppDialog } from "../../components/ui/AppDialog";
import { Save } from "lucide-react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TableActionMenu } from "../../components/ui/TableActionMenu";
import { SuccessDialog } from "../../components/ui/SuccessDialog";

export function CursoPage() {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [erroExclusao, setErroExclusao] = useState("");
    const [erroAdicionarMateria, setErroAdicionarMateria] = useState("");
    const [erroEdicaoMateria, setErroEdicaoMateria] = useState("");
    const [erroRemoverMateria, setErroRemoverMateria] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [cursoToEditId, setCursoToEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);

    const [isMateriasModalOpen, setIsMateriasModalOpen] = useState(false);
    const [cursoMateriasSelecionado, setCursoMateriasSelecionado] = useState<authCurso | null>(null);

    const [isEditMateriaModalOpen, setIsEditMateriaModalOpen] = useState(false);
    const [materiaToEditId, setMateriaToEditId] = useState<string | null>(null);
    const [editMateriaName, setEditMateriaName] = useState("");
    const [editMateriaDescription, setEditMateriaDescription] = useState("");
    const [isSavingMateriaEdit, setIsSavingMateriaEdit] = useState(false);
    const [mostrarModalEdicaoMateria, setMostrarModalEdicaoMateria] = useState(false);

    const [novaMateriaNome, setNovaMateriaNome] = useState("");
    const [novaMateriaDescricao, setNovaMateriaDescricao] = useState("");
    const [isAddingMateria, setIsAddingMateria] = useState(false);

    const [isDeleteMateriaModalOpen, setIsDeleteMateriaModalOpen] = useState(false);
    const [materiaToDeleteId, setMateriaToDeleteId] = useState<string | null>(null);
    const [isDeletingMateria, setIsDeletingMateria] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const cursosPaginados = cursos.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    useEffect(() => {
        async function carregarCursos() {
            try {
                setLoading(true);
                const data = await getCurso();
                setCursos(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados do curso: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados do curso");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarCursos();
    }, []);

    function confirmarExclusao(id: string) {
        setCursoToDelete(id);
        setErroExclusao("");
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        setCursoToDelete(null);
    }

    async function handleConfirmarExclusao() {
        if (!cursoToDelete || isDeleting) return;

        try {
            setIsDeleting(true);
            setErroExclusao("");

            await deletarCursoAPI(cursoToDelete);

            const novaLista = cursos.filter(
                (curso) => curso._id !== cursoToDelete
            );

            setCursos(novaLista);

            const novasPaginas = Math.max(
                1,
                Math.ceil(novaLista.length / itensPorPagina)
            );

            setPaginaAtual((pagina) =>
                Math.min(pagina, novasPaginas)
            );

            fecharModal();
            setMostrarModalExclusao(true);

        } catch (error) {
            console.error("Erro ao excluir curso:", error);

            setErroExclusao(
                "Não foi possível excluir o curso. Verifique se ele possui vínculos com outras informações."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    const colunas: TableColumn<authCurso>[] = [
        {
            id: "nome",
            titulo: "Curso",
            renderizar: (curso) => (
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                        <BookOpen size={20} />
                    </div>

                    <span className="font-semibold text-slate-800">
                        {curso.name}
                    </span>
                </div>
            )
        },
        {
            id: "descricao",
            titulo: "Descrição",
            renderizar: (curso) => (
                <p className="max-w-md text-sm text-slate-500">
                    {curso.description || "Sem descrição"}
                </p>
            )
        },
        {
            id: "materias",
            titulo: "Matérias",
            renderizar: (curso) => (
                <span className="inline-flex whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {curso.materias?.length ?? 0} matérias
                </span>
            )
        },
        {
            id: "situacao",
            titulo: "Situação",
            renderizar: (curso) => (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${curso.active
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                        }`}
                >
                    {curso.active ? "Ativo" : "Inativo"}
                </span>
            )
        }
    ];


    function abrirModalEdicao(curso: authCurso) {
        setCursoToEditId(curso._id);
        setEditName(curso.name ?? "");
        setEditDescription(curso.description ?? "");
        setIsEditModalOpen(true);
    }

    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setCursoToEditId(null);
        setEditName("");
        setEditDescription("");
    }

    async function handleSalvarEdicao() {
        if (!cursoToEditId) return;

        if (!editName.trim()) {
            alert("O nome do curso é obrigatório.");
            return;
        }

        try {
            setIsSavingEdit(true);

            await editarCursoAPI(cursoToEditId, {
                name: editName.trim(),
                description: editDescription.trim(),
            });

            setCursos((prevCursos) =>
                prevCursos.map((curso) =>
                    curso._id === cursoToEditId
                        ? {
                            ...curso,
                            name: editName.trim(),
                            description: editDescription.trim(),
                        }
                        : curso
                )
            );

            fecharModalEdicao();
            setMostrarModalEdicao(true);
        } catch (error) {
            console.log(error);
            alert("Erro ao atualizar o curso.");
        } finally {
            setIsSavingEdit(false);
        }
    }

    function abrirModalMaterias(curso: authCurso) {
        setCursoMateriasSelecionado(curso);
        setErroAdicionarMateria("");
        setMostrarModalEdicaoMateria(false);
        setIsMateriasModalOpen(true);
    }

    function fecharModalMaterias() {
        setIsMateriasModalOpen(false);
        setCursoMateriasSelecionado(null);
        setNovaMateriaNome("");
        setNovaMateriaDescricao("");
        setErroAdicionarMateria("");
        setMostrarModalEdicaoMateria(false);
    }

    function abrirModalEdicaoMateria(materia: authMateria) {
        setMateriaToEditId(materia._id);
        setEditMateriaName(materia.name ?? "");
        setEditMateriaDescription(materia.description ?? "");
        setIsMateriasModalOpen(false);
        setErroEdicaoMateria("");
        setMostrarModalEdicaoMateria(false);
        setIsEditMateriaModalOpen(true);
    }

    function fecharModalEdicaoMateria() {
        setIsEditMateriaModalOpen(false);
        setMateriaToEditId(null);
        setEditMateriaName("");
        setEditMateriaDescription("");
        setIsMateriasModalOpen(true);
    }

    async function handleSalvarEdicaoMateria() {
        if (!materiaToEditId) return;

        if (!editMateriaName.trim()) {
            setErroEdicaoMateria("O nome da matéria é obrigatório.");
            return;
        }

        try {
            setErroEdicaoMateria("");
            setIsSavingMateriaEdit(true);

            await editarMateriaAPI(materiaToEditId, {
                name: editMateriaName.trim(),
                description: editMateriaDescription.trim(),
            });

            const atualizarMateria = (materia: authMateria) =>
                materia._id === materiaToEditId
                    ? {
                        ...materia,
                        name: editMateriaName.trim(),
                        description: editMateriaDescription.trim(),
                    }
                    : materia;

            setCursos((prevCursos) =>
                prevCursos.map((curso) => ({
                    ...curso,
                    materias: curso.materias.map((item) => ({
                        materia: atualizarMateria(item.materia),
                    })),
                }))
            );

            setCursoMateriasSelecionado((prev) =>
                prev
                    ? {
                        ...prev,
                        materias: prev.materias.map((item) => ({
                            materia: atualizarMateria(item.materia),
                        })),
                    }
                    : prev
            );

            setIsEditMateriaModalOpen(false);
            setMateriaToEditId(null);
            setEditMateriaName("");
            setEditMateriaDescription("");
            setIsMateriasModalOpen(true);
            setMostrarModalEdicaoMateria(true);
        } catch (error) {
            console.error("Erro ao atualizar matéria:", error);
            setErroEdicaoMateria("Não foi possível atualizar a matéria.");
        } finally {
            setIsSavingMateriaEdit(false);
        }
    }

    async function handleAdicionarMateria() {
        if (!cursoMateriasSelecionado) return;

        if (!novaMateriaNome.trim()) {
            setErroAdicionarMateria("O nome da matéria é obrigatório.");
            return;
        }

        try {
            setErroAdicionarMateria("");
            setIsAddingMateria(true);

            const cursoAtualizado: authCurso = await adicionarMateriaCursoAPI(
                cursoMateriasSelecionado._id,
                {
                    name: novaMateriaNome.trim(),
                    description: novaMateriaDescricao.trim(),
                }
            );

            setCursos((prevCursos) =>
                prevCursos.map((curso) =>
                    curso._id === cursoAtualizado._id ? cursoAtualizado : curso
                )
            );

            setCursoMateriasSelecionado(cursoAtualizado);

            setNovaMateriaNome("");
            setNovaMateriaDescricao("");
        } catch (error) {
            console.error("Erro ao adicionar matéria:", error);
            setErroAdicionarMateria("Não foi possível adicionar a matéria.");
        } finally {
            setIsAddingMateria(false);
        }
    }

    function confirmarExclusaoMateria(materiaId: string) {
        setMateriaToDeleteId(materiaId);
        setErroRemoverMateria("");
        setIsDeleteMateriaModalOpen(true);
    }

    function fecharModalExclusaoMateria() {
        setIsDeleteMateriaModalOpen(false);
        setMateriaToDeleteId(null);
    }


    async function handleConfirmarExclusaoMateria() {
        if (
            !materiaToDeleteId ||
            !cursoMateriasSelecionado ||
            isDeletingMateria
        ) return;

        try {
            setIsDeletingMateria(true);
            setErroRemoverMateria("");

            const cursoAtualizado: authCurso =
                await removerMateriaCursoAPI(
                    cursoMateriasSelecionado._id,
                    materiaToDeleteId
                );

            setCursos((prevCursos) =>
                prevCursos.map((curso) =>
                    curso._id === cursoAtualizado._id
                        ? cursoAtualizado
                        : curso
                )
            );

            setCursoMateriasSelecionado(cursoAtualizado);
            fecharModalExclusaoMateria();

        } catch (error) {
            console.error("Erro ao remover matéria:", error);

            setErroRemoverMateria(
                "Não foi possível remover a matéria deste curso."
            );
        } finally {
            setIsDeletingMateria(false);
        }
    }

    if (loading) {
        return <div className="p-4 sm:p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-4 sm:p-8"><p>Erro: {error}</p></div>;
    }


    return (
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <PageHeader
                titulo="Gerenciamento de Cursos"
                descricao="Organize os cursos e suas matérias no Aticurando."
                categoria="PAINEL ADMINISTRATIVO"
                icone={BookOpen}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/register-curso")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 sm:w-auto sm:text-base"
                    >
                        <Plus size={18} />
                        Novo Curso
                    </button>
                }
            />

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                        Cursos cadastrados
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Consulte e gerencie os cursos disponíveis no sistema.
                    </p>
                </div>

                <DataTable
                    dados={cursosPaginados}
                    colunas={colunas}
                    chave={(curso) => curso._id}
                    mensagemVazia="Nenhum curso cadastrado."
                    rotuloAcoes={(curso) =>
                        `Ações do curso ${curso.name}`
                    }
                    acoes={(curso) => [
                        {
                            texto: "Editar curso",
                            icone: Pencil,
                            executar: () => abrirModalEdicao(curso)
                        },
                        {
                            texto: "Gerenciar matérias",
                            icone: Layers3,
                            executar: () => abrirModalMaterias(curso)
                        },
                        {
                            texto: "Excluir curso",
                            icone: Trash2,
                            perigosa: true,
                            disabled: isDeleting,
                            executar: () => confirmarExclusao(curso._id)
                        }
                    ]}
                />

                <div className="mt-5">
                    <Pagination
                        paginaAtual={paginaAtual}
                        totalItens={cursos.length}
                        itensPorPagina={itensPorPagina}
                        onPageChange={setPaginaAtual}
                    />
                </div>
            </section>

            <ConfirmDialog
                aberto={isModalOpen}
                aoFechar={fecharModal}
                aoConfirmar={() => {
                    void handleConfirmarExclusao();
                }}
                titulo="Excluir curso"
                descricao="Confirme a exclusão do curso selecionado."
                nomeRegistro={
                    cursos.find((curso) => curso._id === cursoToDelete)?.name
                }
                textoConfirmar="Excluir curso"
                carregando={isDeleting}
                erro={erroExclusao}
            />

            <AppDialog
                aberto={isEditModalOpen}
                aoFechar={fecharModalEdicao}
                titulo="Editar curso"
                descricao="Atualize as informações do curso selecionado."
                icone={Pencil}
                rodape={
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={fecharModalEdicao}
                            disabled={isSavingEdit}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="form-editar-curso"
                            disabled={isSavingEdit || !editName.trim()}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={17} />
                            {isSavingEdit ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                }
                salvando={isSavingEdit}
            >
                <form
                    onSubmit={(evento) => {
                        evento.preventDefault();
                        void handleSalvarEdicao();
                    }}
                    className="space-y-5"
                    id="form-editar-curso"
                >
                    <div>
                        <label
                            htmlFor="edit-nome-curso"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Nome do curso *
                        </label>

                        <input
                            id="edit-nome-curso"
                            type="text"
                            required
                            value={editName}
                            onChange={(evento) =>
                                setEditName(evento.target.value)
                            }
                            placeholder="Digite o nome do curso"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="edit-descricao-curso"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="edit-descricao-curso"
                            rows={4}
                            value={editDescription}
                            onChange={(evento) =>
                                setEditDescription(evento.target.value)
                            }
                            placeholder="Descreva o objetivo do curso"
                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </form>
            </AppDialog>

            <AppDialog
                aberto={isMateriasModalOpen && !isDeleteMateriaModalOpen}
                aoFechar={fecharModalMaterias}
                titulo="Gerenciar matérias"
                descricao={`Matérias do curso ${cursoMateriasSelecionado?.name ?? ""}`}
                icone={Layers3}
                tamanho="lg"
                salvando={isAddingMateria}
                rodape={
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={fecharModalMaterias}
                            disabled={isAddingMateria}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Fechar
                        </button>
                    </div>
                }
            >
                {cursoMateriasSelecionado && (
                    <div className="space-y-6">

                        {mostrarModalEdicaoMateria && (
                            <p
                                role="status"
                                className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                            >
                                Matéria atualizada com sucesso!
                            </p>
                        )}

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">
                                    Matérias vinculadas
                                </h3>

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {cursoMateriasSelecionado.materias.length} matérias
                                </span>
                            </div>

                            {cursoMateriasSelecionado.materias.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                                    Nenhuma matéria vinculada a este curso.
                                </div>
                            ) : (
                                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                                    {cursoMateriasSelecionado.materias.map((item) => (
                                        <div
                                            key={item.materia._id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/40"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="shrink-0 rounded-lg bg-blue-50 p-2.5 text-blue-600">
                                                    <BookOpen size={19} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-800">
                                                        {item.materia.name}
                                                    </p>

                                                    <p className="truncate text-xs text-slate-500">
                                                        {item.materia.description || "Sem descrição"}
                                                    </p>
                                                </div>
                                            </div>

                                            <TableActionMenu
                                                rotulo={`Ações da matéria ${item.materia.name}`}
                                                acoes={[
                                                    {
                                                        texto: "Editar matéria",
                                                        icone: Pencil,
                                                        executar: () =>
                                                            abrirModalEdicaoMateria(item.materia)
                                                    },
                                                    {
                                                        texto: "Remover matéria",
                                                        icone: Trash2,
                                                        perigosa: true,
                                                        executar: () =>
                                                            confirmarExclusaoMateria(item.materia._id)
                                                    }
                                                ]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <form
                            onSubmit={(evento) => {
                                evento.preventDefault();
                                void handleAdicionarMateria();
                            }}
                            className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={19} className="text-blue-600" />
                                <h3 className="font-bold text-slate-800">
                                    Adicionar nova matéria
                                </h3>
                            </div>

                            <div>
                                <label
                                    htmlFor="nova-materia-nome"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Nome da matéria *
                                </label>

                                <input
                                    id="nova-materia-nome"
                                    type="text"
                                    required
                                    disabled={isAddingMateria}
                                    value={novaMateriaNome}
                                    onChange={(e) => setNovaMateriaNome(e.target.value)}
                                    placeholder="Nome da matéria"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="nova-materia-descricao"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Descrição
                                </label>

                                <textarea
                                    id="nova-materia-descricao"
                                    rows={3}
                                    disabled={isAddingMateria}
                                    value={novaMateriaDescricao}
                                    onChange={(e) => setNovaMateriaDescricao(e.target.value)}
                                    placeholder="Descreva a matéria"
                                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {erroAdicionarMateria && (
                                <p role="alert" className="text-sm text-red-600">
                                    {erroAdicionarMateria}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isAddingMateria || !novaMateriaNome.trim()}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus size={18} />
                                {isAddingMateria ? "Adicionando..." : "Adicionar matéria"}
                            </button>
                        </form>
                    </div>
                )}
            </AppDialog>

            <ConfirmDialog
                aberto={isDeleteMateriaModalOpen}
                aoFechar={fecharModalExclusaoMateria}
                aoConfirmar={() => {
                    void handleConfirmarExclusaoMateria();
                }}
                titulo="Remover matéria"
                descricao="Remova a matéria vinculada ao curso."
                nomeRegistro={
                    cursoMateriasSelecionado?.materias.find(
                        (item) => item.materia._id === materiaToDeleteId
                    )?.materia.name
                }
                textoConfirmar="Remover matéria"
                carregando={isDeletingMateria}
                erro={erroRemoverMateria}
            />

            <AppDialog
                aberto={isEditMateriaModalOpen}
                aoFechar={fecharModalEdicaoMateria}
                titulo="Editar matéria"
                descricao="Atualize o nome e a descrição da matéria."
                icone={Pencil}
                salvando={isSavingMateriaEdit}
                rodape={
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={fecharModalEdicaoMateria}
                            disabled={isSavingMateriaEdit}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="form-editar-materia"
                            disabled={isSavingMateriaEdit || !editMateriaName.trim()}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={17} />
                            {isSavingMateriaEdit
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>
                    </div>
                }
            >
                <form
                    id="form-editar-materia"
                    onSubmit={(evento) => {
                        evento.preventDefault();
                        void handleSalvarEdicaoMateria();
                    }}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="edit-materia-nome"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Nome da matéria *
                        </label>

                        <input
                            id="edit-materia-nome"
                            type="text"
                            required
                            value={editMateriaName}
                            onChange={(e) => setEditMateriaName(e.target.value)}
                            placeholder="Digite o nome da matéria"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="edit-materia-descricao"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="edit-materia-descricao"
                            rows={4}
                            value={editMateriaDescription}
                            onChange={(e) =>
                                setEditMateriaDescription(e.target.value)
                            }
                            placeholder="Descreva a matéria"
                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {erroEdicaoMateria && (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            {erroEdicaoMateria}
                        </p>
                    )}
                </form>
            </AppDialog>

            <SuccessDialog
                aberto={mostrarModalExclusao}
                aoFechar={() => setMostrarModalExclusao(false)}
                titulo="Curso desativado!"
                mensagem="O curso foi desativado com sucesso e removido da listagem de cursos ativos."
            />

            <SuccessDialog
                aberto={mostrarModalEdicao}
                aoFechar={() => setMostrarModalEdicao(false)}
                titulo="Curso atualizado!"
                mensagem="As informações do curso foram atualizadas com sucesso."
            />

        </div>
    )
}