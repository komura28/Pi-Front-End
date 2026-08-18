import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso, authTurma, TurmaMatricula } from "../../types/auth/auth-types";
import { deletarTurmaAPI, editarTurmaAPI, getCurso, getTurma } from "../../services/authService";
import { Modal } from "../../components/Modal";
import { formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";


const isSubmitting = false;

export function TurmaPage() {
    const navigate = useNavigate();
    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
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


    const turmasPaginadas = turmas.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const totalPaginas = Math.ceil(turmas.length / itensPorPagina);
    // const [mostrarModal, setMostrarModal] = useState(false);

    async function handleExclusao() {
        try {
            await deletarTurmaAPI(idSelecionado!);
            const novaLista = turmas.filter(
                (turma) => turma.turma._id !== idSelecionado
            );
            setMostrarModalExclusao(true);
            setTurmas(novaLista);
            const novasPaginas = Math.ceil(
                novaLista.length / itensPorPagina
            );

            if (paginaAtual > novasPaginas && novasPaginas > 0) {
                setPaginaAtual(novasPaginas);
            }
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir a turma.");
        }

    }

    useEffect(() => {
        async function carregarTurmas() {
            try {
                setLoading(true);
                const data = await getTurma();
                console.log("getTurma response:", data);

                if (Array.isArray(data)) {
                    setTurmas(data);
                } else if (data && Array.isArray((data as any).turmas)) {
                    setTurmas((data as any).turmas);
                } else if (data && Array.isArray((data as any).data)) {
                    setTurmas((data as any).data);
                } else if (data) {
                    setTurmas([data as any]);
                } else {
                    setTurmas([]);
                }
            } catch (error) {
                console.error("Erro ao buscar turmas", error);
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados da turma: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados da turma");
                }
            } finally {
                setLoading(false);
            }

            async function carregarCursos() {
                const data = await getCurso();
                setCursos(data);
            }

            carregarCursos();
        }


        carregarTurmas();
    }, [])

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (turmas.length === 0) {
        return (
            <div className="p-8"><p>Nenhuma turma encontrada</p>
                {/*  {mostrarModal && (
                    <Modal
                        titulo="Exclusão"
                        decisao={null}
                        message="Turma Excluída com Sucesso"
                        texto="Ok"
                        opSim={() => {
                            setMostrarModal(false);
                            navigate("/app/turma");
                        }}

                    />)} */}
            </div>
        );
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

    // 2. Limpa os campos e fecha o modal
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
            // Chama a API passando o ID e os novos dados. 
            // Ajuste os parâmetros de acordo com o que sua API espera receber.
            await editarTurmaAPI(turmaToEditId, { curso: editCurso, capacidade: parseInt(editCapacidade), turno: editTurno, dataInicio: editDataInicio, dataFim: editDataFim });

            setMostrarModalEdicao(true);

            // Atualiza a lista na tela (procura a turma pelo ID e altera apenas ela)
            setTurmas(
                turmas.map((item) =>
                    item.turma._id === turmaToEditId
                        ? {
                            ...item,
                            turma: {
                                ...item.turma,
                                curso: cursoSelecionado || item.turma.curso,
                                capacidade: parseInt(editCapacidade),
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

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Turmas
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Turno
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Curso
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Capacidade
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Data de Início
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Data de Fim
                            </th>

                            <th className=" text-slate-800 font-medium p-2 border-b">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {turmasPaginadas.map((turma) => (
                            <tr key={turma.turma._id} className="border-b">
                                <td className="text-slate-600 p-2">
                                    {turma.turma.turno}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {turma.turma.curso?.name || "Curso não definido"}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {turma.turma.capacidade}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {formatDate(turma.turma.dataInicio)}
                                </td>
                                <td className="text-slate-600 p-2">
                                    {formatDate(turma.turma.dataFim)}
                                </td>
                                <td className="p-2 gap-2">
                                    <div className="flex justify-center items-center gap-2">
                                        <Button isSubmitting={isSubmitting}
                                            label={<FaPencilAlt />}
                                            loadingLabel="aprovando" className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1"
                                            onClick={() => abrirModalEdicao(turma.turma)} />
                                        <Button isSubmitting={isSubmitting}
                                            label={<FaTrash />}
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setIdSelecionado(turma.turma._id)
                                            }}
                                            loadingLabel="excluindo"
                                            className="bg-red-500 hover:bg-red-600 rounded-md text-white py-1 px-1"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                                     className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    dataFimInvalida ? "border-red-500" : "border-slate-300"
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