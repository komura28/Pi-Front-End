import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { RegisterCursoRequest } from "../../types/auth/auth-types";

interface Materia{
    id: string;
    name: string;
}

interface CadastroCursoFormData {
    name: string;
    descricao: string;
    materias: Materia[];
}

export function CursoCadastroPage() {
    const navigate = useNavigate();
    const { cadastrarCurso } = useAuth()
    const [serverError, setServerError] = useState("");
    const [materia, setMateria] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CadastroCursoFormData>({
        defaultValues: {
            name: "",
            descricao: "",
            materias: []
        }
    });

    const { fields, append, remove} = useFieldArray({
        control,
        name: "materias"
    })

    async function handleCadastro(data: CadastroCursoFormData) {
        try {
            setServerError("");
            const dados: RegisterCursoRequest = {
                name: data.name,
                descricao: data.descricao,
                materias: data.materias.map(materia => ({ id: "",name: materia.name}))
            };
            await cadastrarCurso(dados);
            navigate("/app/curso");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
    }

    const onError = (errors: any) => {
        console.log("Erros de validação do formulário:", errors);
    }

    const handleMateria = () => {
        const limpo = materia.trim();

        if (!limpo) return;

        append({ id: "",name: limpo});

        setMateria("");
    };
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <section className="w-full max-w-md rounded-2x1 bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-2x1 font-bold text-gray-800">
                    Cadastro de Curso
                </h1>

                <form onSubmit={handleSubmit(handleCadastro, onError)} className="space-y-4">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
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
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Descrição
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite a descrição"
                            {...register("descricao", {
                                required: "A descrição é obrigatório",
                            })}
                        />
                        {errors.descricao && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.descricao.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Matéria
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={materia}
                                onChange={(e) => setMateria(e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                placeholder="Digite o nome da matériae clique em adicionar"
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
                                        Add
                                    </button>
                        </div>
                        
                        <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                        {fields.map((field, index) => (  
                            <div key={field.id} className= "flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                                    <input
                                        type= "text"
                                        readOnly
                                        {...register(`materias.${index}.name` as const, {
                                            required: "O nome da matéria é obrigatório"
                                        })}
                                    />
                                    
                        
                        {errors.materias?.[index]?.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.materias[index].name.message}
                            </p>
                        )}                    

                    
                        <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                        className="w-auto rounded-lg bg-red-100 px-3 py-2 font-medium text-red-600 transition hover:bg-red-200 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Removendo..." : "Remover"}
                    </button>
                    
                    </div>
                        ))}
                    </div>
               </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition houver:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Cadastando..." : "Cadastrar"}
                    </button>
                </form>
            </section>
        </main>
    );
};