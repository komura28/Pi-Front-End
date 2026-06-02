import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { authCurso, RegisterTurmaRequest } from "../../types/auth/auth-types";
import { getCurso } from "../../services/authService";

interface CadastroTurmaFormData {
    curso: string;
    turno: string;
    capacidade: number;
    dataInicio: Date;
    dataFim: Date;
}

export function TurmaCadastroPage() {
    const navigate = useNavigate();
    const { cadastrarTurma } = useAuth()
    const [serverError, setServerError] = useState("");
    const [materia, setMateria] = useState("");
    const [materiaDesc, setMateriaDesc] = useState("");
    const [cursos, setCursos] = useState<authCurso[]>([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CadastroTurmaFormData>();

    async function handleCadastro(data: CadastroTurmaFormData) {
        try {
            console.log("Dados do formulário:", data);
            setServerError("");
            const dados: RegisterTurmaRequest = {
                curso: cursos.find(curso => curso.id === data.curso)?.id || "",
                turno: data.turno,
                capacidade: data.capacidade,
                dataInicio: data.dataInicio,
                dataFim: data.dataFim,
            };
            await cadastrarTurma(dados);
            navigate("/app/turma");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
    }

    const onError = (errors: any) => {
        console.log("Erros de validação do formulário:", errors);
    }


    
    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4">
            <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Cadastro de Turma
                </h1>

                <form onSubmit={handleSubmit(handleCadastro, onError)} className="space-y-4">

                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Capacidade
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite a capacidade"
                            {...register("capacidade", {
                                required: "A capacidade é obrigatória",
                            })}
                        />
                        {errors.capacidade && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.capacidade.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Turno
                        </label>
                        <select
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 mb-10"

                            {...register("turno", {
                                required: "O turno é obrigatório",
                            })}
                        >
                            <option value="" disabled>Selecione o turno</option>
                            <option value="Manha">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
                        </select>
                        {errors.turno && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.turno.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Nome da Matéria
                        </label>

                        <div className="flex flex-col gap-3">
                            {/* <input
                                type="text"
                                value={materia}
                                onChange={(e) => setMateria(e.target.value)}
                                className="mb-5 flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                placeholder="Digite o nome da matéria"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleMateria();
                                    }
                                }} /> */}
                            </div>

                            <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Nome da Descrição (Matéria)
                            </label>

                            <div className="flex flex-wrap gap-2">
                             {/*    <input
                                    type="text"
                                    value={materiaDesc}
                                    onChange={(e) => setMateriaDesc(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                    placeholder="Digite a descrição da matéria"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleMateria();
                                        }
                                    }} /> */}
                                {/* <button
                                    type="button"
                                    onClick={handleMateria}
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                                >
                                    +
                                </button> */}
                        </div>
                    </div>

                    {/* <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                        {fields.length > 0 && (
                            <div className="grid grid-cols-12 gap-2 px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <span className="col-span-4">Nome</span>
                                <span className="col-span-6">Descrição</span>
                                <span className="col-span-2">Ação</span>
                            </div>
                            
                        )}
                        {fields.map((field, index) => (
                            <div key={field.id} 
                                 className="grid grid-cols-12 gap-2 items-center rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 text-sm">
                                <div className="col-span-4 font-medium text-gray-900 break-words whitespace-normal">
                                <input
                                    type="hidden"
                                    
                                    {...register(`materias.${index}.name` as const, {
                                        required: "O nome da matéria é obrigatório"
                                    })}
                                />
                                {field.name}
                                </div>

                                <div className="col-span-6 text-gray-600 break-words whitespace-normal">
                                <input

                                    type="hidden"
                                    
                                    {...register(`materias.${index}.description` as const, {
                                        required: "A descrição da matéria é obrigatório"
                                    })}
                                />
                                {field.description}
                                </div>



                                {errors.materias?.[index]?.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.materias[index].name.message}
                                    </p>
                                )}

                                <div className="col-span-2 text-right">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={isSubmitting}
                                    className="w-auto rounded-lg bg-red-100 px-3 py-2 font-medium text-red-600 transition hover:bg-red-200 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Removendo..." : "Remover"}
                                </button>
                                </div>

                                {errors.materias?.[index]?.name && (
                                    <p className="col-span-12 mt-1 text-xs text-red-600">
                                        {errors.materias[index]?.name.message}
                                    </p>
                                )}
                                </div>    
                            
                        ))}
                    </div> */}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Cadastando..." : "Cadastrar"}
                    </button>
                </form>
            </section>
        </main>
    );
};