import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authTurma } from "../../types/auth/auth-types";
import {  getTurma } from "../../services/authService";


const isSubmitting = false;

export function TurmaPage() {
    const [cursos, setTurmas] = useState<authTurma[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function carregarTurmas() {
            try {
                setLoading(true);
                const data = await getTurma();
                setTurmas(data);
            } catch (error) {
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

    if (cursos.length === 0) {
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
                        {cursos.map((turmas) => (
                            <tr key={turmas.id}>
                                <td className="text-slate-600 p-2 border-b">
                                    {turmas.turno}
                                </td>
                                <td className="text-slate-600 p-2 border-b">
                                    {turmas.curso.name}
                                </td>
                                <td className="text-slate-600 p-2 border-b">
                                    {turmas.capacidade}
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