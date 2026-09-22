//import { useState } from "react";
import { useEffect, useState } from "react";
import { AtualizarMatricula, getMatricula } from "../../services/matriculaService";
import type { authMatricula } from "../../types/matricula/matricula-types";
import { Modal } from "../../components/Modal";
import { Search } from "lucide-react";


export function MatriculaPage() {
    const [matriculas, setMatriculas] = useState<authMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [decisao, setDecisao] = useState<"APROVADA" | "RECUSADA" | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;
    const [mostrarModalAprovacao, setMostrarModalAprovacao] = useState(false);
    const [mostrarModalRecusa, setMostrarModalRecusa] = useState(false);
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<"TODOS" | "APROVADA" | "RECUSADA" | "PENDENTE">("TODOS");
    const [pesquisar, setPesquisar] = useState("");

    const matriculasFiltro = matriculas.filter((matriculas) => {
        
        const digitado = pesquisar.toLowerCase();

        const name = matriculas.user.name.toLowerCase().includes(digitado);
        const cpf = matriculas.user.cpf.toString().toLowerCase().includes(digitado);
        const pesquisarTudo = name || cpf;

        const addStatus = filtro === "TODOS" || matriculas.status === filtro;

        return pesquisarTudo && addStatus;
        
        }
    );

    const totalPaginas = Math.max(Math.ceil(matriculasFiltro.length / itensPorPagina), 1);

    const matriculasPaginaAtual = matriculasFiltro.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const [isModalEdicaoOpen, setIsModalEdicaoOpen] = useState(false);
    const [formEdicao, setFormEdicao] = useState<{ name: string; status: "APROVADA" | "RECUSADA" }>({
        name: "",
        status: "APROVADA",
    });


    async function handleDecisao(_id: string, status: "APROVADA" | "RECUSADA") {
        try {
            await AtualizarMatricula(_id, status);
            setMatriculas((listaAtual) =>
                listaAtual.map((matricula) =>
                    matricula._id === _id ? { ...matricula, status: status } : matricula

                ));
            if (status === "APROVADA") {
                setMostrarModalAprovacao(true);
            } else {
                setMostrarModalRecusa(true);
            }
        } catch (error) { //Trata Erros
            setError("Erro ao atualizar o status da matrícula");
        }
    }

    function handleAbrirEdicao(matricula: authMatricula) {
        setIdSelecionado(matricula._id);
        setFormEdicao({
            name: matricula.user?.name || "",
            status: matricula.status === "RECUSADA" ? "RECUSADA" : "APROVADA",
        });
        setIsModalEdicaoOpen(true);
    }

    async function handleSalvarEdicao() {
        if (!idSelecionado) return;

        try {
            await AtualizarMatricula(idSelecionado, formEdicao.status);

            setMatriculas((listaAtual) =>
                listaAtual.map((item) =>
                    item._id === idSelecionado
                        ? {
                            ...item,
                            status: formEdicao.status,
                            user: { ...item.user, name: formEdicao.name },
                        }
                        : item
                )
            );
            setIsModalEdicaoOpen(false);
            setIdSelecionado(null);
        } catch (error) {
            setError("Erro ao editar matrícula");
        }
    }

    useEffect(() => {
        function handleClickFora(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest(".dropdown-container")) {
                setMenuAbertoId(null);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    useEffect(() => {
        async function buscarMatriculasPendentes() { 
            try {
                setError("");
                const data = await getMatricula();
                setMatriculas(data);
            } catch (error) {
                setError("Erro ao carregar os dados do Servidor");
            } finally {
                setLoading(false);
            }
        }

        buscarMatriculasPendentes();
    }, []);

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (matriculas.length === 0) {
        return <div className="p-8"><p>Nenhuma Matrícula Encontrada</p></div>;
    }

    return (
        <div>
            <section className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8 border border-slate-300 justify-center items-center mx-auto mt-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Lista de Matrículas Aprovadas ou Recusadas
                </h1>

                <div className="flex w-full items-center justify-between gap-4">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={pesquisar}
                            onChange={(e) => {setPesquisar(e.target.value)
                                              setPaginaAtual(1);}
                            }
                            
                            className="relative w-250px rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 shadow-sm transition-colors duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search className="h-4 w-4" />
                        </div>
                    </div>

                    <select
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value as "TODOS" | "APROVADA" | "RECUSADA" | "PENDENTE");
                            setPaginaAtual(1);
                        }}
                        className="p-2 border border-slate-300 rounded-md bg-white text-slate-700"
                    >
                        <option value="TODOS">Todas Matrículas</option>
                        <option value="APROVADA">Aprovadas</option>
                        <option value="RECUSADA">Recusadas</option>
                        <option value="PENDENTE">Pendentes</option>
                    </select>
                </div>



                <table className="w-full table-fixed ">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Nome</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">CPF</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Curso</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Turno</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Status</th>
                            <th className="text-center text-slate-800 font-medium p-2 border-b">Ações</th>
                        </tr>
                    </thead>
                    {/*Aqui onde lista as matrículas solicitadas */}
                    <tbody className="border-b">
                        {matriculasPaginaAtual.map((matricula) => (
                            <tr key={matricula._id} className="border-b">
                                <td className="text-slate-600 p-2 ">{matricula.user.name || "Nome não definido"}</td>
                                <td className="text-slate-600 p-2  ">{matricula.user.cpf || "CPF não definido"}</td>
                                <td className="text-slate-600 p-2  ">{matricula.turma?.curso?.name || "Curso não definido"}</td>
                                <td className="text-slate-600 p-2  ">{matricula.turma?.turno || "Turno não definido"}</td>
                                <td>{matricula.status}</td>
                                <td className="p-2 flex justify-center items-center gap-2">

                                    {matricula.status === "PENDENTE" && ( //Aqui onde tem uma codição, se status for PENDENTE, ele cria 2 botões, aceitar ou recusar
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="cursor-pointer border-2 border-green-500 text-white bg-green-500 rounded-md px-3 py-1"
                                                onClick={() => { //Atualiza os estados, para abrir o modal(true), receber a matrícula selecionada e a decisao selecionada
                                                    setIsModalOpen(true);
                                                    setIdSelecionado(matricula._id);
                                                    setDecisao("APROVADA");
                                                }}
                                                type="button">
                                                Aceitar</button>
                                            <button className="cursor-pointer border-2 border-red-500 text-white bg-red-500 rounded-md px-3 py-1"
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setIdSelecionado(matricula._id);
                                                    setDecisao("RECUSADA");
                                                }}
                                                type="button">
                                                Recusar</button>
                                        </div>
                                    )}

                                    {matricula.status !== "PENDENTE" && (
                                        <div className="relative dropdown-container">
                                            <button
                                                type="button"
                                                onClick={() => setMenuAbertoId(menuAbertoId === matricula._id ? null : matricula._id)}
                                                className="inline-flex items-center justify-center p-2 hover:bg-slate-100 rounded-full cursor-pointer text-slate-600 font-bold text-xl leading-none"
                                                title="Opções"
                                            >
                                                ⋯
                                            </button>

                                            {menuAbertoId === matricula._id && (
                                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-50 overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAbrirEdicao(matricula)}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-colors"
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                        disabled={paginaAtual === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <span>
                        Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                        onClick={() =>
                            setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
                        }
                        disabled={paginaAtual === totalPaginas}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>

            </section>

            

            {isModalEdicaoOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Editar Matrícula</h2>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nome do Aluno
                                </label>
                                <input
                                    type="text"
                                    value={formEdicao.name}
                                    onChange={(e) => setFormEdicao({ ...formEdicao, name: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formEdicao.status}
                                    onChange={(e) =>
                                        setFormEdicao({
                                            ...formEdicao,
                                            status: e.target.value as "APROVADA" | "RECUSADA",
                                        })
                                    }
                                    className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="APROVADA">APROVADA</option>
                                    <option value="RECUSADA">RECUSADA</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalEdicaoOpen(false)}
                                className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSalvarEdicao}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*Aqui onde ele abre o Modal (Componente) para o ADM fazer a validação do usuário */}
            {isModalOpen && (
                <Modal
                    titulo={`${decisao === "APROVADA" ? "Aprovar" : "Recusar"} Matrícula`}
                    message={`Tem certeza que deseja ${decisao === "APROVADA" ? "aprovar" : "recusar"} esta matrícula?`}
                    decisao={decisao}
                    texto="Sim"
                    opSim={() => {
                        handleDecisao(idSelecionado!, decisao!);
                        setIsModalOpen(false)
                    }}
                    opNao={() => {
                        setIsModalOpen(false);
                        setDecisao(null);
                        setIdSelecionado(null)
                    }}


                />)}

            {mostrarModalAprovacao && (
                <Modal
                    titulo="Matrícula Aprovada"
                    message="A matrícula foi aprovada com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalAprovacao(false);
                    }}
                />
            )}

            {mostrarModalRecusa && (
                <Modal
                    titulo="Matrícula Recusada"
                    message="A matrícula foi recusada com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => {
                        setMostrarModalRecusa(false);
                    }}
                />
            )}
        </div>
    )
}