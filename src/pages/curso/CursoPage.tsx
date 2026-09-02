import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso, authMateria } from "../../types/auth/auth-types";
import { deletarCursoAPI, getCurso, editarCursoAPI, editarMateriaAPI, adicionarMateriaCursoAPI, removerMateriaCursoAPI } from "../../services/authService"; // Adicionei o editarCursoAPI aqui
import { Modal } from "../../components/Modal";
import { useNavigate } from "react-router-dom";

export function CursoPage() {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const totalPaginas = Math.max(1, Math.ceil(cursos.length / itensPorPagina));

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
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        setCursoToDelete(null);
    }

    async function handleConfirmarExclusao() {
        if (!cursoToDelete) return;

        try {
            setIsDeleting(true);

            await deletarCursoAPI(cursoToDelete);

            setCursos((prevCursos) => {
                const novaLista = prevCursos.filter(
                    (curso) => curso._id !== cursoToDelete
                );

                const novasPaginas = Math.max(
                    1,
                    Math.ceil(novaLista.length / itensPorPagina)
                );

                setPaginaAtual((pagina) =>
                    pagina > novasPaginas ? novasPaginas : pagina
                );

                return novaLista;
            });

            setMostrarModalExclusao(true);
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir o curso.");
        } finally {
            setIsDeleting(false);
            fecharModal();
        }
    }

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
        setIsMateriasModalOpen(true);
    }

    function fecharModalMaterias() {
        setIsMateriasModalOpen(false);
        setCursoMateriasSelecionado(null);
    }

    function abrirModalEdicaoMateria(materia: authMateria) {
        setMateriaToEditId(materia._id);
        setEditMateriaName(materia.name ?? "");
        setEditMateriaDescription(materia.description ?? "");
        setIsMateriasModalOpen(false);
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
            alert("O nome da matéria é obrigatório.");
            return;
        }

        try {
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
            console.log(error);
            alert("Erro ao atualizar a matéria.");
        } finally {
            setIsSavingMateriaEdit(false);
        }
    }

    // --- ADICIONAR NOVA MATÉRIA DIRETO NO CURSO JÁ EXISTENTE ---
    async function handleAdicionarMateria() {
        if (!cursoMateriasSelecionado) return;

        if (!novaMateriaNome.trim()) {
            alert("O nome da matéria é obrigatório.");
            return;
        }

        try {
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
            console.log(error);
            alert("Erro ao adicionar a matéria.");
        } finally {
            setIsAddingMateria(false);
        }
    }

    // --- EXCLUSÃO DE MATÉRIA ---
    function confirmarExclusaoMateria(materiaId: string) {
        setMateriaToDeleteId(materiaId);
        setIsDeleteMateriaModalOpen(true);
    }

    function fecharModalExclusaoMateria() {
        setIsDeleteMateriaModalOpen(false);
        setMateriaToDeleteId(null);
    }

    async function handleConfirmarExclusaoMateria() {
        if (!materiaToDeleteId || !cursoMateriasSelecionado) return;

        try {
            setIsDeletingMateria(true);

            const cursoAtualizado: authCurso = await removerMateriaCursoAPI(
                cursoMateriasSelecionado._id,
                materiaToDeleteId
            );

            setCursos((prevCursos) =>
                prevCursos.map((curso) =>
                    curso._id === cursoAtualizado._id ? cursoAtualizado : curso
                )
            );

            setCursoMateriasSelecionado(cursoAtualizado);
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir a matéria.");
        } finally {
            setIsDeletingMateria(false);
            fecharModalExclusaoMateria();
        }
    }

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (cursos.length === 0) {
        return (
            <div className="p-8">
                <p>Nenhum curso encontrado</p>

        {mostrarModalExclusao && (
                <Modal
                    titulo="Exclusão"
                    message="Curso Excluído com Sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalExclusao(false);
                        navigate("/app/curso");
                    }}
                />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Cursos
                </h1>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Curso
                            </th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Descrição
                            </th>
                            <th className="text-slate-800 font-medium p-2 border-b">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {cursosPaginados.map((curso) => (
                            <tr key={curso._id} className="border-b">
                                <td className="text-slate-600 p-2">
                                    {curso.name}
                                </td>

                                <td className="text-slate-600 p-2">
                                    {curso.description}
                                </td>

                                <td className="p-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button
                                            isSubmitting={false}
                                            label="Matérias"
                                            loadingLabel="salvando"
                                            className="bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm py-1 px-2"
                                            onClick={() => abrirModalMaterias(curso)}
                                        />

                                        <Button
                                            isSubmitting={false}
                                            label={<FaPencilAlt />}
                                            loadingLabel="salvando"
                                            className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1"
                                            onClick={() => abrirModalEdicao(curso)}
                                        />

                                        <Button
                                            isSubmitting={isDeleting}
                                            label={<FaTrash />}
                                            loadingLabel="Excluindo..."
                                            className="bg-red-500 hover:bg-red-600 rounded-md text-white py-1 px-1"
                                            onClick={() => confirmarExclusao(curso._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                        disabled={paginaAtual === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <span className="text-slate-600">
                        Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                        onClick={() =>
                            setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
                        }
                        disabled={paginaAtual === totalPaginas}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            </section>

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl text-center font-semibold text-slate-900 mb-2">Confirmar Exclusão de Curso</h3>
                        <p className="text-slate-600 mb-6 justify-center text-center">
                            Tem certeza que deseja excluir este curso? Esta ação não poderá ser desfeita.
                        </p>

                        <div className="flex justify-center gap-3">

                            <button
                                onClick={handleConfirmarExclusao}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                            >
                                Sim
                            </button>

                            <button
                                onClick={fecharModal}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NOVO MODAL DE EDIÇÃO */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Curso</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome do Curso
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModalEdicao}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvarEdicao}
                                disabled={isSavingEdit}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSavingEdit ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMateriasModalOpen && cursoMateriasSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">
                            Matérias de {cursoMateriasSelecionado.name}
                        </h3>

                        <div className="max-h-80 overflow-y-auto space-y-2 mb-6">
                            {cursoMateriasSelecionado.materias.length === 0 ? (
                                <p className="text-slate-500 text-sm">
                                    Este curso ainda não possui matérias cadastradas.
                                </p>
                            ) : (
                                cursoMateriasSelecionado.materias.map((item) => (
                                    <div
                                        key={item.materia._id}
                                        className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 border border-gray-200"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-800 truncate">{item.materia.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{item.materia.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                isSubmitting={false}
                                                label={<FaPencilAlt />}
                                                className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-2"
                                                onClick={() => abrirModalEdicaoMateria(item.materia)}
                                            />

                                            <Button
                                                isSubmitting={false}
                                                label={<FaTrash />}
                                                className="bg-red-500 hover:bg-red-600 rounded-md text-white py-1 px-2"
                                                onClick={() => confirmarExclusaoMateria(item.materia._id)}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <p className="text-sm font-medium text-slate-700 mb-2">
                                Adicionar nova matéria
                            </p>

                            <div className="flex flex-col gap-2 mb-3">
                                <input
                                    type="text"
                                    value={novaMateriaNome}
                                    onChange={(e) => setNovaMateriaNome(e.target.value)}
                                    placeholder="Nome da matéria"
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={novaMateriaDescricao}
                                    onChange={(e) => setNovaMateriaDescricao(e.target.value)}
                                    placeholder="Descrição"
                                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                onClick={handleAdicionarMateria}
                                disabled={isAddingMateria}
                                className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isAddingMateria ? "Adicionando..." : "+ Adicionar Matéria"}
                            </button>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={fecharModalMaterias}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteMateriaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl text-center font-semibold text-slate-900 mb-2">
                            Confirmar Exclusão de Matéria
                        </h3>
                        <p className="text-slate-600 mb-6 justify-center text-center">
                            Tem certeza que deseja excluir esta matéria do curso? Esta ação não poderá ser desfeita.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleConfirmarExclusaoMateria}
                                disabled={isDeletingMateria}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isDeletingMateria ? "Excluindo..." : "Sim"}
                            </button>

                            <button
                                onClick={fecharModalExclusaoMateria}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            {isEditMateriaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Matéria</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome da Matéria
                                </label>
                                <input
                                    type="text"
                                    value={editMateriaName}
                                    onChange={(e) => setEditMateriaName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    value={editMateriaDescription}
                                    onChange={(e) => setEditMateriaDescription(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModalEdicaoMateria}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvarEdicaoMateria}
                                disabled={isSavingMateriaEdit}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSavingMateriaEdit ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalEdicaoMateria && (
                <Modal
                    titulo="Atualização"
                    message="Matéria atualizada com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => setMostrarModalEdicaoMateria(false)}
                />
            )}

            {mostrarModalExclusao && (
                <Modal
                    titulo="Exclusão"
                    message="Curso Excluído com Sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalExclusao(false);
                        navigate("/app/curso");
                    }}
                />)}

            {mostrarModalEdicao && (
                <Modal
                    titulo="Atualização"
                    message="Curso atualizado com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalEdicao(false);
                        navigate("/app/curso");
                    }}
                />
            )}
        </div>
    )
}