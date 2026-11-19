import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletarUserAPI, getUser } from "../../services/authService";
import type { IUserDTO } from "../../types/user/user-types";
import { Users, Search, Trash2, UserPlus, UserRound } from "lucide-react";

import { PageHeader } from "../../components/ui/PageHeader";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { SuccessDialog } from "../../components/ui/SuccessDialog";

export function UserPage() {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [users, setUsers] = useState<IUserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);

    const [busca, setBusca] = useState("");
    const [filtroPapel, setFiltroPapel] = useState("TODOS");
    const [filtroSituacao, setFiltroSituacao] = useState("TODOS");
    const [erroExclusao, setErroExclusao] = useState("");

    const usuariosFiltrados = users.filter((user) => {
        const termo = busca.trim().toLowerCase();
        const cpfDigitado = busca.replace(/\D/g, "");

        const correspondeBusca =
            user.name.toLowerCase().includes(termo) ||
            user.email.toLowerCase().includes(termo) ||
            (
                cpfDigitado.length >= 3 &&
                String(user.cpf).padStart(11, "0").includes(cpfDigitado)
            );

        const correspondePapel =
            filtroPapel === "TODOS" ||
            user.papelUsuario === filtroPapel;

        const correspondeSituacao =
            filtroSituacao === "TODOS" ||
            (filtroSituacao === "ATIVOS" && user.active) ||
            (filtroSituacao === "INATIVOS" && !user.active);

        return correspondeBusca &&
            correspondePapel &&
            correspondeSituacao;
    });

    const itensPorPagina = 5;

    const usuariosPaginados = usuariosFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

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


    function confirmarExclusao(id: string) {
        setUserToDelete(id);
        setErroExclusao("");
        setIsModalOpen(true);
    }

    function fecharModal() {
        if (isDeleting) return;

        setIsModalOpen(false);
        setUserToDelete(null);
        setErroExclusao("");
    }

    async function handleConfirmarExclusao() {
        if (!userToDelete || isDeleting) return;

        try {
            setIsDeleting(true);
            setErroExclusao("");

            await deletarUserAPI(userToDelete);

            setUsers((anteriores) =>
                anteriores.filter(
                    (user) => user._id !== userToDelete
                )
            );

            const quantidadeRestante = usuariosFiltrados.filter(
                (user) => user._id !== userToDelete
            ).length;

            const totalPaginas = Math.max(
                1,
                Math.ceil(quantidadeRestante / itensPorPagina)
            );

            setPaginaAtual((pagina) =>
                Math.min(pagina, totalPaginas)
            );

            setIsModalOpen(false);
            setUserToDelete(null);
            setMostrarModalExclusao(true);

        } catch (error) {
            console.error("Erro ao excluir usuário:", error);

            setErroExclusao(
                "Não foi possível excluir o usuário. Nenhuma alteração foi realizada na listagem."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    const colunas: TableColumn<IUserDTO>[] = [
        {
            id: "nome",
            titulo: "Usuário",
            renderizar: (user) => (
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                        <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "cpf",
            titulo: "CPF",
            renderizar: (user) => {
                const cpf = String(user.cpf).padStart(11, "0");

                return (
                    <span className="font-mono text-sm text-slate-600">
                        ***.***.{cpf.slice(6, 9)}-{cpf.slice(9)}
                    </span>
                );
            }
        },
        {
            id: "papel",
            titulo: "Perfil",
            renderizar: (user) => {
                const nomes = {
                    ADM: "Administrador",
                    ALUNO: "Aluno",
                    PROFESSOR: "Professor"
                };

                return (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {nomes[user.papelUsuario]}
                    </span>
                );
            }
        },
        {
            id: "situacao",
            titulo: "Situação",
            renderizar: (user) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.active
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                        }`}
                >
                    {user.active ? "Ativo" : "Inativo"}
                </span>
            )
        }
    ];

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }


    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <PageHeader
                titulo="Gerenciamento de Usuários"
                descricao="Consulte e gerencie os usuários cadastrados no Aticurando."
                categoria="PAINEL ADMINISTRATIVO"
                icone={Users}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/register-professor")}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-blue-50"
                    >
                        <UserPlus size={18} />
                        Cadastrar professor
                    </button>
                }
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        Usuários cadastrados
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Pesquise usuários e filtre por perfil ou situação.
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="search"
                            value={busca}
                            onChange={(e) => {
                                setBusca(e.target.value);
                                setPaginaAtual(1);
                            }}
                            placeholder="Buscar nome, e-mail ou CPF..."
                            aria-label="Buscar usuários"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={filtroPapel}
                        aria-label="Filtrar por perfil"
                        onChange={(e) => {
                            setFiltroPapel(e.target.value);
                            setPaginaAtual(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="TODOS">Todos os perfis</option>
                        <option value="ALUNO">Alunos</option>
                        <option value="PROFESSOR">Professores</option>
                        <option value="ADM">Administradores</option>
                    </select>

                    <select
                        value={filtroSituacao}
                        aria-label="Filtrar por situação"
                        onChange={(e) => {
                            setFiltroSituacao(e.target.value);
                            setPaginaAtual(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="TODOS">Todas as situações</option>
                        <option value="ATIVOS">Ativos</option>
                        <option value="INATIVOS">Inativos</option>
                    </select>
                </div>

                <DataTable
                    dados={usuariosPaginados}
                    colunas={colunas}
                    chave={(user) => user._id}
                    mensagemVazia="Nenhum usuário encontrado."
                    rotuloAcoes={(user) => `Ações de ${user.name}`}
                    acoes={(user) => [
                        {
                            texto: "Excluir usuário",
                            icone: Trash2,
                            perigosa: true,
                            disabled: isDeleting ||
                                user.papelUsuario !== "ALUNO",
                            executar: () => confirmarExclusao(user._id)
                        }
                    ]}
                />

                <div className="mt-5">
                    <Pagination
                        paginaAtual={paginaAtual}
                        totalItens={usuariosFiltrados.length}
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
                titulo="Excluir usuário"
                descricao="Confirme a exclusão permanente do usuário."
                nomeRegistro={
                    users.find(
                        (user) => user._id === userToDelete
                    )?.name
                }
                textoConfirmar="Excluir usuário"
                carregando={isDeleting}
                erro={erroExclusao}
            />

            <SuccessDialog
                aberto={mostrarModalExclusao}
                aoFechar={() => setMostrarModalExclusao(false)}
                titulo="Usuário excluído!"
                mensagem="O usuário foi excluído com sucesso e removido da listagem."
            />
        </div>
    );
}