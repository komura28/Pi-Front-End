import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { RegisterCursoRequest } from "../../types/auth/auth-types";
import { cadastrarCurso } from "../../services/admService";

interface Materia {
    name: string;
    description: string
}

interface CadastroCursoFormData {
    name: string;
    description: string;
    materias: Materia[];
}

export function CursoCadastroPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [materia, setMateria] = useState("");
    const [materiaDesc, setMateriaDesc] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CadastroCursoFormData>({
        defaultValues: {
            name: "",
            description: "",
            materias: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "materias"
    })

    async function handleCadastro(data: CadastroCursoFormData) {
        try {
            setServerError("");
            const dados: RegisterCursoRequest = {
                name: data.name,
                description: data.description,
                materias: data.materias.map(materia => ({name: materia.name, description: materia.description }))
            };
            await cadastrarCurso(dados);
            navigate("/app/curso");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
        console.log("objeto: ", data);
    }

    const onError = (errors: any) => {
        console.log("Erros de validação do formulário:", errors);
    }

    const handleMateria = () => {
        const limpo = materia.trim();
        const limpoDesc = materiaDesc.trim();

        if (!limpo) return;

        append({ name: limpo, description: limpoDesc });

        setMateriaDesc("");
        setMateria("");
    };

    
    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4">
            <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Cadastro de Curso
                </h1>

                <form onSubmit={handleSubmit(handleCadastro, onError)} className="space-y-4">

                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Nome
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite o nome do curso"
                            {...register("name", {
                                required: "O nome é obrigatório",
                            })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Descrição
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 mb-10"
                            placeholder="Digite a descrição"
                            {...register("description", {
                                required: "A descrição é obrigatório",
                            })}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Nome da Matéria
                        </label>

                        <div className="flex flex-col gap-3">
                            <input
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
                                }} />
                            </div>

                            <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Nome da Descrição (Matéria)
                            </label>

                            <div className="flex flex-wrap gap-2">
                                <input
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
                                    }} />
                                <button
                                    type="button"
                                    onClick={handleMateria}
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                                >
                                    +
                                </button>
                        </div>
                    </div>

                    <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
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
                    </div>

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