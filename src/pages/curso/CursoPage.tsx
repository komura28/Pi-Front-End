import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso } from "../../types/auth/auth-types";
import { deletarCursoAPI, getCurso, editarCursoAPI } from "../../services/authService"; // Adicionei o editarCursoAPI aqui

const isSubmitting = false;

export function CursoPage() {
    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados do Modal de Exclusão
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState<string | null>(null);

    // --- NOVOS ESTADOS PARA O MODAL DE EDIÇÃO ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [cursoToEditId, setCursoToEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const cursosPaginados = cursos.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const totalPaginas = Math.ceil(cursos.length / itensPorPagina);

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

    // --- FUNÇÕES DE EXCLUSÃO ---
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
            await deletarCursoAPI(cursoToDelete);
            alert("Cadastro excluído com sucesso!");
            const novaLista = cursos.filter(
                (curso) => curso._id !== cursoToDelete
            );

            setCursos(novaLista);

            const novasPaginas = Math.ceil(
                novaLista.length / itensPorPagina
            );

            if (paginaAtual > novasPaginas && novasPaginas > 0) {
                setPaginaAtual(novasPaginas);
            }
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir o curso.");
        } finally {
            fecharModal();
        }
    }

    // --- NOVAS FUNÇÕES DE EDIÇÃO ---

    // 1. Abre o modal e preenche os inputs com os dados atuais do curso
    function abrirModalEdicao(curso: authCurso) {
        setCursoToEditId(curso._id);
        setEditName(curso.name);
        setEditDescription(curso.description);
        setIsEditModalOpen(true);
    }

    // 2. Limpa os campos e fecha o modal
    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setCursoToEditId(null);
        setEditName("");
        setEditDescription("");
    }

    // 3. Envia os dados para a API e atualiza a lista na tela
    async function handleSalvarEdicao() {
        if (!cursoToEditId) return;

        try {
            // Chama a API passando o ID e os novos dados. 
            // Ajuste os parâmetros de acordo com o que sua API espera receber.
            await editarCursoAPI(cursoToEditId, { name: editName, description: editDescription });

            alert("Curso atualizado com sucesso!");

            // Atualiza a lista na tela (procura o curso pelo ID e altera apenas ele)
            setCursos(cursos.map((curso) =>
                curso._id === cursoToEditId
                    ? { ...curso, name: editName, description: editDescription }
                    : curso
            ));

        } catch (error) {
            console.log(error);
            alert("Erro ao atualizar o curso.");
        } finally {
            fecharModalEdicao();
        }
    }


    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (cursos.length === 0) {
        return <div className="p-8"><p>Nenhum curso encontrado</p></div>;
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
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Curso</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Descrição</th>
                            <th className="text-slate-800 font-medium p-2 border-b ">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {cursosPaginados.map((curso) => (
                            <tr key={curso._id} className="border-b">
                                <td className="text-slate-600 p-2 ">{curso.name}</td>
                                <td className="text-slate-600 p-2 ">{curso.description}</td>
                                <td className="p-2  gap-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button
                                            isSubmitting={isSubmitting}
                                            label={<FaPencilAlt />}
                                            loadingLabel="salvando"
                                            className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1"
                                            // AQUI: Adicionei o evento de clique para abrir a edição passando o curso atual
                                            onClick={() => abrirModalEdicao(curso)}
                                        />
                                        <Button
                                            isSubmitting={isSubmitting}
                                            label={<FaTrash />}
                                            loadingLabel="recusando"
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
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}