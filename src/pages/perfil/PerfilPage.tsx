import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import { FaPencilAlt } from "react-icons/fa";
import type { authUser } from "../../types/auth/auth-types";
import { editarUser } from "../../services/userService";

export function PerfilPage() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user, setUser } = useAuth();
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    useEffect(() => {
        async function carregarDados() {
            try {

                setLoading(true);
                setError("");
            } catch (error) {
                console.error(error);
                setError("Erro ao carregar dados do usuário");
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [])
    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (!user) {
        return <div className="p-8"><p>Nenhum usuário encontrado</p></div>;
    }

    function abrirModalEdicao(user: authUser) {
        setEditName(user.name || "");
        setEditEmail(user.email || "");
        setIsEditModalOpen(true);
    }

    // 2. Limpa os campos e fecha o modal
    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setEditName("");
        setEditEmail("");
    }

    async function handleSalvarEdicao() {

        try {

            const updatedUser = await editarUser({
                name: editName,
                email: editEmail,
            });

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Usuário atualizado com sucesso!");


        } catch (error) {
            console.log(error);
            alert("Erro ao atualizar o usuário.");
        } finally {
            fecharModalEdicao();
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Meu Perfil
            </h1>
            <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="name"
                        className="text-slate-800 font-medium"
                    >
                        Nome
                    </label>
                    <input
                        value={user?.name}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                        disabled
                    />
                    <label
                        htmlFor="email"
                        className="text-slate-800 font-medium"
                    >
                        E-mail
                    </label>

                    <input
                        id="email"
                        type="text"
                        value={user?.email}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                        disabled
                    />
                    <label
                        htmlFor="cpf"
                        className="text-slate-800 font-medium"
                    >
                        CPF
                    </label>

                    <input
                        value={user?.cpf}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                        disabled
                    />

                    <label
                        htmlFor="papelUsuario"
                        className="text-slate-800 font-medium"
                    >
                        Papel do Usuário
                    </label>

                    <input
                        value={user?.papelUsuario}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                        disabled
                    />

                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => abrirModalEdicao(user)}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                            <FaPencilAlt />
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </section>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Perfil</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome
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
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    )
}