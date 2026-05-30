import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso } from "../../types/auth/auth-types";
import { getCurso } from "../../services/authService";


const isSubmitting = false;

interface CursoFormData {
    name: string,
    description: string
}

export function CursoPage() {
    const [serverError, setServerError] = useState("");
    const [curso, setCurso] = useState<authCurso | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function carregarCursos() {
            try {
                setLoading(true);
                const data = await getCurso();
                setCurso(data);
            } catch (error) {
                setError("Erro ao carregar os dados do curso");
            } finally {
                setLoading(false);
            }
        }

        carregarCursos();
    }, [])
    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (!curso) {
        return <div className="p-8"><p>Nenhum curso encontrado</p></div>;
    }
    ;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Cursos
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Curso
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Descrição
                            </th>

                            <th className=" text-slate-800 font-medium p-2 border-b justify-center">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        <tr>
                            <td  className="text-slate-600 p-2 border-b">
                                {curso.name}
                            </td>
                            <td  className="text-slate-600 p-2 border-b">
                                {curso.description}
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
                    </tbody>
                </table>
            </section>
        </div>
    );
}