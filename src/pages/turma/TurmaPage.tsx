import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authTurma } from "../../types/auth/auth-types";
import {  getTurma } from "../../services/authService";


const isSubmitting = false;

export function TurmaPage() {
    const [turmas, setTurmas] = useState<authTurma[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        return <div className="p-8"><p>Nenhuma turma encontrada</p></div>;
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Turmas
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Período
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Curso
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Capacidade
                            </th>

                            <th className=" text-slate-800 font-medium p-2 border-b justify-center">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {turmas.map((turma) => (
                            <tr key={turma.id}>
                                <td className="text-slate-600 p-2 border-b">
                                    {turma.turno}
                                </td>
                                <td className="text-slate-600 p-2 border-b">
                                    {turma.curso}
                                </td>
                                <td className="text-slate-600 p-2 border-b">
                                    {turma.capacidade}
                                </td>
                                <td className="p-2 flex gap-2 justify-center">
                                    <Button isSubmitting={isSubmitting}
                                        label={<FaPencilAlt />}
                                        loadingLabel="aprovando" className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1" />
                                    <Button isSubmitting={isSubmitting}
                                        label={<FaTrash />}
                                        loadingLabel="recusando" className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}