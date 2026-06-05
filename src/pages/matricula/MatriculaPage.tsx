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
            <section>
                <h1>
                    Lista de Matrículas
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Nome</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">CPF</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Curso</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Turma</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Status</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Ações</th>
                        </tr>
                    </thead>
                    {/*Aqui onde lista as matrículas solicitadas */}
                    <tbody className="border-b"> 
                        {matriculas.map((matricula) => (
                        <tr key={matricula._id}>
                            <td className="text-slate-600 p-2 border-b">{matricula.user.name}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.user.cpf}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.turma.curso?.name}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.turma.turno}</td>
                            <td>{matricula.status}</td>
                            <td className="p-2 flex gap-2 justify-center border-b.">

                                {matricula.status === "PENDENTE" && ( //Aqui onde tem uma codição, se status for PENDENTE, ele cria 2 botões, aceitar ou recusar
                                    <div>
                                <button className="cursor-pointer border-2 border-green-500 text-green-500 rounded-md px-2 py-1 mr-2"
                                onClick={() => { //Atualiza os estados, para abrir o modal(true), receber a matrícula selecionada e a decisao selecionada
                                    setIsModalOpen(true);
                                    setIdSelecionado(matricula._id);
                                    setDecisao("APROVADA");
                                }}
                                type="button">
                                    Aceitar</button>
                                <button className="cursor-pointer border-2 border-red-500 text-red-500 rounded-md px-2 py-1"
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


            </section>

            {/*Aqui onde ele abre o Modal (Componente) para o ADM fazer a validação do usuário */}
            {isModalOpen && (
                <Modal
                titulo = {`Tem certeza que deseja ${decisao === "APROVADA" ? "aprovar" : "recusar"} esta matrícula?`}
                decisao = {decisao}
                opSim = {() => { handleDecisao(idSelecionado!, decisao!);
                                setIsModalOpen(false) }}
                opNao = {() => {setIsModalOpen(false);
                               setDecisao(null);
                               setIdSelecionado(null)}}
                

                 /> )}
          </div>
    )
}