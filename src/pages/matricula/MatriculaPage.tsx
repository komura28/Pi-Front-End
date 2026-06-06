//import { useState } from "react";
import { useEffect, useState } from "react";
import { AtualizarMatricula, getMatricula } from "../../services/matriculaService";
import type { authMatricula } from "../../types/matricula/matricula-types";
import { Modal } from "../../components/Modal";

export function MatriculaPage() { //Aqui onde criamos a página de matrículas, começando pelos estados
    const [matriculas, setMatriculas] = useState<authMatricula[]>([]); //EStado para armazenar as matrículas
    const [loading, setLoading] = useState(true); //Estado para carregar os dados
    const [error, setError] = useState(""); //Estado para erros
    const [decisao, setDecisao] = useState<"APROVADA" | "RECUSADA" | null>(null); //Estado para decisão do ADM
    const [isModalOpen, setIsModalOpen] = useState(false); //Estado do noss componente modal, para abrir e fechar ele
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null); //Aqui onde ele controla o ID que selecionamos, e o que fazer com ele
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const matriculasPaginaAtual = matriculas.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    const totalPaginas = Math.ceil(matriculas.length / itensPorPagina);


    async function handleDecisao(_id: string, status: "APROVADA" | "RECUSADA") { //Aqui onde ele atualiza o status da matricula e do BD
        try {
            await AtualizarMatricula(_id, status); //Aguarda o BD autorizar os dados
            setMatriculas((listaAtual) => //Atualiza o estado da lista para armazenar a nova lista, com o novo status
                listaAtual.map((matricula) =>
                    matricula._id === _id ? { ...matricula, status: status } : matricula

                ));
        } catch (error) { //Trata Erros
            setError("Erro ao atualizar o status da matrícula");
        }
    }
    useEffect(() => { //useEffect é um hook
        async function buscarMatriculasPendentes() { //Função para trazer as matrículas
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
        return <div className="p-8"><p>NenhumA Matrícula Encontrado</p></div>;
    }

    return (
        <div>
            <section className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8 border border-slate-300 justify-center items-center mx-auto mt-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Lista de Matrículas
                </h1>

                <table className="w-full table-fixed ">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Nome</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">CPF</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Curso</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Turno</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Status</th>
                            <th className="text-slate-800 font-medium p-2 border-b">Ações</th>
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
                                <td className="p-2 flex gap-2 ">

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

            {/*Aqui onde ele abre o Modal (Componente) para o ADM fazer a validação do usuário */}
            {isModalOpen && (
                <Modal
                    titulo = {`${decisao === "APROVADA" ? "Aprovar" : "Recusar"} Matrícula`}
                    message={`Tem certeza que deseja ${decisao === "APROVADA" ? "aprovar" : "recusar"} esta matrícula?`}
                    decisao={decisao}
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
        </div>
    )
}