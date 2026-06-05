import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import type { authCurso } from "../../types/auth/auth-types";
import { deletarCursoAPI, getCurso, editarCursoAPI } from "../../services/authService";

const isSubmitting = false;

interface Materia {
    name: string;
    description: string;
}

export function CursoPage() {
    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados do Modal de Exclusão
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState<string | null>(null);

    // Estados do Modal de Edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [cursoToEditId, setCursoToEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    // --- NOVOS ESTADOS PARA AS MATÉRIAS NA EDIÇÃO ---
    const [editMaterias, setEditMaterias] = useState<Materia[]>([]);
    const [novaMateriaNome, setNovaMateriaNome] = useState("");
    const [novaMateriaDesc, setNovaMateriaDesc] = useState("");

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

    // --- FUNÇÕES DE EXCLUSÃO ---
    function confirmarExclusao(id: string) {
        setCursoToDelete(id);
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        setCursoToDelete(null);
    }

    async function handleConfirmarExclusao() {
        if (!cursoToDelete) return;

        try {
            await deletarCursoAPI(cursoToDelete);
            alert("Cadastro excluído com sucesso!");
            setCursos(cursos.filter((curso) => curso._id !== cursoToDelete));
        } catch (error) {
            console.log(error);
            alert("Erro ao excluir o curso.");
        } finally {
            fecharModal();
        }
    }

    // FUNÇÕES DE EDIÇÃO
    function abrirModalEdicao(curso: authCurso) {
        setCursoToEditId(curso._id);
        setEditName(curso.name);
        setEditDescription(curso.description);
        // Carrega as matérias do curso ou um array vazio se não houver
        setEditMaterias(curso.materias ? [...curso.materias] : []); 
        setIsEditModalOpen(true);
    }

    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setCursoToEditId(null);
        setEditName("");
        setEditDescription("");
        setEditMaterias([]);
        setNovaMateriaNome("");
        setNovaMateriaDesc("");
    }

    // Função para alterar o texto de uma matéria já existente na lista
    function handleMateriaChange(index: number, campo: keyof Materia, valor: string) {
        const novasMaterias = [...editMaterias];
        novasMaterias[index][campo] = valor;
        setEditMaterias(novasMaterias);
    }

    // Função para remover uma matéria da lista
    function removerMateria(index: number) {
        const novasMaterias = editMaterias.filter((_, i) => i !== index);
        setEditMaterias(novasMaterias);
    }

    // Função para adicionar uma nova matéria à lista do modal
    function adicionarNovaMateria() {
        const limpo = novaMateriaNome.trim();
        const limpoDesc = novaMateriaDesc.trim();

        if (!limpo) return;

        setEditMaterias([...editMaterias, { name: limpo, description: limpoDesc }]);
        setNovaMateriaNome("");
        setNovaMateriaDesc("");
    }

    async function handleSalvarEdicao() {
        if (!cursoToEditId) return;

        try {
            // Agora enviamos também o array de matérias atualizado
            const dadosAtualizados = { 
                name: editName, 
                description: editDescription,
                materias: editMaterias
            };

            await editarCursoAPI(cursoToEditId, dadosAtualizados);
            
            alert("Curso atualizado com sucesso!");
            
            setCursos(cursos.map((curso) => 
                curso._id === cursoToEditId 
                    ? { ...curso, ...dadosAtualizados } 
                    : curso
            ));
            
        } catch (error) {
            console.log(error);
            alert("Erro ao atualizar o curso.");
        } finally {
            fecharModalEdicao();
        }
    }


    if (loading) return <div className="p-8"><p>Carregando...</p></div>;
    if (error) return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
    if (cursos.length === 0) return <div className="p-8"><p>Nenhum curso encontrado</p></div>;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Lista de Cursos</h1>

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
                                        loadingLabel="salvando" 
                                        className="bg-gray-500 hover:bg-gray-600 rounded-md text-white py-1 px-1" 
                                        onClick={() => abrirModalEdicao(curso)}
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

            {/* MODAL DE EXCLUSÃO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Confirmar Exclusão</h3>
                        <p className="text-slate-600 mb-6">Tem certeza que deseja excluir este curso?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={fecharModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300">Cancelar</button>
                            <button onClick={handleConfirmarExclusao} className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700">Sim, excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE EDIÇÃO */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Editar Curso</h3>
                        
                        {/* DADOS DO CURSO */}
                        <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Curso</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Curso</label>
                                <textarea 
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                />
                            </div>
                        </div>

                        {/* SEÇÃO DE MATÉRIAS */}
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-slate-800 mb-3">Matérias do Curso</h4>
                            
                            {/* Lista de matérias existentes permitindo edição direta */}
                            <div className="space-y-3 mb-4">
                                {editMaterias.map((materia, index) => (
                                    <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-md border border-slate-200">
                                        <div className="flex-1 space-y-2">
                                            <input 
                                                type="text" 
                                                value={materia.name}
                                                onChange={(e) => handleMateriaChange(index, 'name', e.target.value)}
                                                placeholder="Nome da Matéria"
                                                className="w-full border border-slate-300 rounded-md p-1.5 text-sm"
                                            />
                                            <input 
                                                type="text" 
                                                value={materia.description}
                                                onChange={(e) => handleMateriaChange(index, 'description', e.target.value)}
                                                placeholder="Descrição da Matéria"
                                                className="w-full border border-slate-300 rounded-md p-1.5 text-sm"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => removerMateria(index)}
                                            className="mt-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                                {editMaterias.length === 0 && (
                                    <p className="text-sm text-slate-500 italic">Nenhuma matéria cadastrada neste curso.</p>
                                )}
                            </div>

                            {/* Adicionar nova matéria */}
                            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                <h5 className="text-sm font-semibold text-blue-800 mb-2">Adicionar Nova Matéria</h5>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={novaMateriaNome}
                                        onChange={(e) => setNovaMateriaNome(e.target.value)}
                                        placeholder="Nome"
                                        className="flex-1 border border-slate-300 rounded-md p-2 text-sm"
                                    />
                                    <input 
                                        type="text" 
                                        value={novaMateriaDesc}
                                        onChange={(e) => setNovaMateriaDesc(e.target.value)}
                                        placeholder="Descrição"
                                        className="flex-1 border border-slate-300 rounded-md p-2 text-sm"
                                    />
                                    <button 
                                        type="button"
                                        onClick={adicionarNovaMateria}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                                    >
                                        + Adicionar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* BOTÕES DO MODAL */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button onClick={fecharModalEdicao} className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300">
                                Cancelar
                            </button>
                            <button onClick={handleSalvarEdicao} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}