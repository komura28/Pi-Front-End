//import { useState } from "react";
import { useEffect, useState } from "react";
import { AtualizarMatricula, getMatricula } from "../../services/matriculaService";
import type { authMatricula } from "../../types/matricula/matricula-types";
import { api } from "../../services/api";

 const isSubmitting =(false);

export function MatriculaPage() {
    const [matriculas, setMatriculas] = useState<authMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function handleDecisao(_id: string, status: "APROVADA" | "RECUSADA") { //Aqui 
        try {
            await AtualizarMatricula(_id, status);
            setMatriculas((listaAtual) => 
                listaAtual.map((matricula) =>
            matricula._id === _id ? { ...matricula, status: status } : matricula
        
        ));
        } catch (error) {
            setError("Erro ao atualizar o status da matrícula");
        }
    }    
        useEffect(() => { //useEffect é um hook
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
                    <tbody className="border-b">
                        {matriculas.map((matricula) => (
                        <tr key={matricula._id}>
                            <td className="text-slate-600 p-2 border-b">{matricula.user.name}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.user.cpf}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.turma.curso.name}</td>
                            <td className="text-slate-600 p-2 border-b text-center">{matricula.turma.turno}</td>
                            <td>{matricula.status}</td>
                            <td className="p-2 flex gap-2 justify-center border-b.">
                                {matricula.status === "PENDENTE" && (
                                    <div>
                                <button className="cursor-pointer border-2 border-green-500 text-green-500 rounded-md px-2 py-1 mr-2"
                                onClick={() => handleDecisao(matricula._id, "APROVADA")}
                                type="button">
                                    Aceitar</button>
                                <button className="cursor-pointer border-2 border-red-500 text-red-500 rounded-md px-2 py-1"
                                onClick={() => handleDecisao(matricula._id, "RECUSADA")}
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
          </div>
    )
}