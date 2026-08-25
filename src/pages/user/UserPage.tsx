import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authUser } from "../../types/auth/auth-types";
import { Modal } from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { deletarCursoAPI, deletarUserAPI, getMe, getUser } from "../../services/authService";

export function UserPage() {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [users, setUsers] = useState<authUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados do Modal de Exclusão
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    
    // --- NOVOS ESTADOS PARA O MODAL DE EDIÇÃO ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSenha, setEditSenha] = useState("");
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const usersPaginados = users.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const totalPaginas = Math.max(1, Math.ceil(users.length / itensPorPagina));

    useEffect(() => {
        async function carregarUsers() {
            try {
                setLoading(true);
                const data = await getUser();
                setUsers(data);
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

        carregarUsers();
    }, []);

    // --- FUNÇÕES DE EXCLUSÃO ---
    function confirmarExclusao(id: string) {
        setUserToDelete(id);
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        setUserToDelete(null);
    }

    async function handleConfirmarExclusao() {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);

            await deletarUserAPI(userToDelete);

            setUsers((prevUsers) => {
                const novaLista = prevUsers.filter(
                    (user) => user._id !== userToDelete
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
            alert("Erro ao excluir o usuário.");
        } finally {
            setIsDeleting(false);
            fecharModal();
        }
    }

    // --- NOVAS FUNÇÕES DE EDIÇÃO ---

    // 1. Abre o modal e preenche os inputs com os dados atuais do curso
    // Aguardando Back atualizar para editar a senha //
     /* function abrirModalEdicao(curso: authUser) {
        setEditSenha(user.password ?? "");
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
    */
    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (users.length === 0) {
        return (
            <div className="p-8">
                <p>Nenhum usuário encontrado</p>

        {mostrarModalExclusao && (
                <Modal
                    titulo="Exclusão"
                    message="Usuário Excluído com Sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalExclusao(false);
                        navigate("/app/user");
                    }}
                />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Usuários
                </h1>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Nome
                            </th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                CPF
                            </th>
                            <th className="text-slate-800 font-medium p-2 border-b">
                                Email
                            </th>
                            <th className="text-slate-800 font-medium p-2 border-b">
                                Papel
                            </th>
                            <th className="text-slate-800 font-medium p-2 border-b">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {usersPaginados.map((user) => (
                            //Aqui onde trazemos os dados para uma tabela
                            <tr key={user._id} className="border-b">
                                <td className="text-slate-600 p-2">
                                    {user.name}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {user.cpf}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {user.email}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {user.papelUsuario}
                                </td>
                                <td className="p-2">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* <Button
                                            isSubmitting={false}
                                            label={<FaPencilAlt />}
                                            loadingLabel="salvando"
                                            className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1"
                                            onClick={() => abrirModalEdicao(curso)}
                                        /> */}

                                        <Button
                                            isSubmitting={isDeleting}
                                            label={<FaTrash />}
                                            loadingLabel="Excluindo..."
                                            className="bg-red-500 hover:bg-red-600 rounded-md text-white py-1 px-1"
                                            onClick={() => confirmarExclusao(user._id)}
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
                            Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.
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

            {/* NOVO MODAL DE EDIÇÃO 
            Aguardando Back
            */}
            {/* {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Usuário</h3>

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
            )} */}

            {mostrarModalExclusao && (
                <Modal
                    titulo="Exclusão"
                    message="Usuário Excluído com Sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalExclusao(false);
                        navigate("/app/user");
                    }}
                />)}

            {/* {mostrarModalEdicao && (
                <Modal
                    titulo="Atualização"
                    message="Usuário atualizado com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalEdicao(false);
                        navigate("/app/user");
                    }}
                />
            )} */}
        </div>
    )
}