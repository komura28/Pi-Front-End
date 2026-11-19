import { useEffect, useState } from "react";
import type { authCurso, authTurma, TurmaMatricula } from "../../types/auth/auth-types";
import { deletarTurmaAPI, editarTurmaAPI, getCurso, getTurma } from "../../services/authService";
import { Modal } from "../../components/Modal";
import { formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";

export function TurmaPage() {
    const navigate = useNavigate();
    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
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

    async function handleExclusao() {
        try {
            await deletarTurmaAPI(idSelecionado!);
            const novaLista = turmas.filter(
                (turma) => turma.turma._id !== idSelecionado
            );
            setMostrarModalExclusao(true);
            setTurmas(novaLista);
            setPaginaAtual((atual) =>
                Math.min(
                    atual,
                    Math.max(
                        1,
                        Math.ceil(novaLista.length / itensPorPagina)
                    )
                )
            );
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir a turma.");
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
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
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

    async function handleSalvarEdicao() {
        if (!turmaToEditId) return;

        try {
            await editarTurmaAPI(turmaToEditId, { curso: editCurso, capacidade: Number.parseInt(editCapacidade), turno: editTurno, dataInicio: editDataInicio, dataFim: editDataFim });

            setMostrarModalEdicao(true);

            setTurmas(
                turmas.map((item) =>
                    item.turma._id === turmaToEditId
                        ? {
                            ...item,
                            turma: {
                                ...item.turma,
                                curso: cursoSelecionado || item.turma.curso,
                                capacidade: Number.parseInt(editCapacidade),
                                turno: editTurno,
                                dataInicio: editDataInicio,
                                dataFim: editDataFim,
                            }
                        }
                        : item
                )
            );
            fecharModalEdicao();
            setMostrarModalEdicao(true);

        } catch (error) {
            console.log(error);
            alert("Erro ao atualizar a turma.");
        } finally {
            fecharModalEdicao();
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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            <PageHeader
                titulo="Gerenciamento de Turmas"
                descricao="Visualize, cadastre e gerencie as turmas do Aticurando."
                categoria="PAINEL ADMINISTRATIVO"
                icone={Users}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/register-turma")}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-blue-50"
                    >
                        <Plus size={18} />
                        Nova Turma
                    </button>
                }
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-slate-800">
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
                            texto: "Excluir turma",
                            icone: Trash2,
                            perigosa: true,
                            executar: () => {
                                setIdSelecionado(item.turma._id);
                                setIsModalOpen(true);
                            }
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

            {isModalOpen && (
                <Modal
                    titulo={`Confirmar Exclusão de Turma`}
                    decisao={null}
                    message={`Tem certeza que deseja excluir esta turma?`}
                    texto="Sim"
                    opSim={() => {
                        setIsModalOpen(false);
                        handleExclusao()
                    }}
                    opNao={() => {
                        setIsModalOpen(false);
                        setIdSelecionado(null)
                    }}
                />)}
            {mostrarModalExclusao && (
                <Modal
                    titulo="Exclusão"
                    decisao={null}
                    message="Turma Excluída com Sucesso!"
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalExclusao(false);
                        navigate("/app/turma");
                    }}
                />)}

            {mostrarModalEdicao && (
                <Modal
                    titulo="Atualização"
                    decisao={null}
                    message="Turma Atualizada com Sucesso!"
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalEdicao(false);
                        navigate("/app/turma");
                    }}
                />
            )}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Turma</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Curso
                                </label>
                                <select
                                    value={editCurso}
                                    onChange={(e) => setEditCurso(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2"
                                >
                                    <option value="">Selecione um curso</option>

                                    {cursos.map((curso) => (
                                        <option key={curso._id} value={curso._id}>
                                            {curso.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Capacidade
                                </label>
                                <input
                                    type="number"
                                    value={editCapacidade}
                                    onChange={(e) => setEditCapacidade(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Turno
                                </label>
                                <select
                                    value={editTurno}
                                    onChange={(e) => setEditTurno(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione um turno</option>
                                    <option value="MANHA">Manhã</option>
                                    <option value="TARDE">Tarde</option>
                                    <option value="NOITE">Noite</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Data de Início
                                </label>
                                <input
                                    type="date"
                                    value={editDataInicio}
                                    onChange={(e) => setEditDataInicio(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Data de Fim
                                </label>
                                <input
                                    type="date"
                                    value={editDataFim}
                                    onChange={(e) => setEditDataFim(e.target.value)}
                                    className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${dataFimInvalida ? "border-red-500" : "border-slate-300"
                                        }`}
                                />
                                {dataFimInvalida && (
                                    <p className="mt-1 text-sm text-red-600">
                                        A data de fim deve ser posterior à data de início
                                    </p>
                                )}
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
                                disabled={dataFimInvalida}
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