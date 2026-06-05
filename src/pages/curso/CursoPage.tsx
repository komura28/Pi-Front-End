import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso } from "../../types/auth/auth-types";
import { deletarCursoAPI, getCurso } from "../../services/authService";

const isSubmitting = false;

export function CursoPage() {
    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    //Novos estados para o Modal de Exclusão
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function carregarCursos() {
            try {
                setLoading(true);
                const data = await getCurso();
                setCursos(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados do curso: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados do curso");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarCursos();
    }, []);

    //Função que apenas abre o modal e guarda o ID do curso
    function confirmarExclusao(id: string) {
        setCursoToDelete(id);
        setIsModalOpen(true);
    }

    //Função para fechar o modal e limpar o ID selecionado
    function fecharModal() {
        setIsModalOpen(false);
        setCursoToDelete(null);
    }

    //Função que realmente deleta após o usuário confirmar
    async function handleConfirmarExclusao() {
        if (!cursoToDelete) return; // Segurança extra

        try {
            await deletarCursoAPI(cursoToDelete);
            alert("Cadastro excluído com sucesso!");
            setCursos(cursos.filter((curso) => curso._id !== cursoToDelete));
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir o curso.");
        } finally {
            fecharModal(); // Fecha o modal independentemente de dar certo ou errado
        }
    }

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    }

    if (cursos.length === 0) {
        return <div className="p-8"><p>Nenhum curso encontrado</p></div>;
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Cursos
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Curso</th>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">Descrição</th>
                            <th className="text-slate-800 font-medium p-2 border-b justify-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {cursos.map((curso) => (
                            <tr key={curso._id}>
                                <td className="text-slate-600 p-2 border-b">{curso.name}</td>
                                <td className="text-slate-600 p-2 border-b">{curso.description}</td>
                                <td className="p-2 flex gap-2 justify-center">
                                    <Button 
                                        isSubmitting={isSubmitting}
                                        label={<FaPencilAlt />}
                                        loadingLabel="aprovando" 
                                        className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1" 
                                    />
                                    <Button 
                                        isSubmitting={isSubmitting}
                                        label={<FaTrash />}
                                        loadingLabel="recusando" 
                                        className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1" 
                                        onClick={() => confirmarExclusao(curso._id)} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Confirmar Exclusão</h3>
                        <p className="text-slate-600 mb-6">
                            Tem certeza que deseja excluir este curso? Esta ação não poderá ser desfeita.
                        </p>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={fecharModal}
                                className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirmarExclusao}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                            >
                                Sim, excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}