import { useEffect, useState } from "react";
import type { authUser } from "../../types/auth/auth-types";
import { Modal } from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { deletarUserAPI, getUser } from "../../services/authService";

export function UserPage() {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [users, setUsers] = useState<authUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
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
                    setError(`Erro ao carregar os dados do usuário: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados do usuário");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarUsers();
    }, []);

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

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    return (
        <div>
            <section className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8 border border-slate-300 justify-center items-center mx-auto mt-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Usuários
                </h1>

                {users.length === 0 ? (
                    <p className="text-slate-500 py-4">Nenhum usuário encontrado</p>
                ) : (
                    <>
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
                                </tr>
                            </thead>

                            <tbody className="border-b">
                                {usersPaginados.map((user) => (
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                                disabled={paginaAtual === 1}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl text-center font-semibold text-slate-900 mb-2">Confirmar Exclusão de Usuário</h3>
                        <p className="text-slate-600 mb-6 justify-center text-center">
                            Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleConfirmarExclusao}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Excluindo..." : "Sim"}
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
                />
            )}

            {mostrarModalEdicao && (
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
            )}
        </div>
    );
}