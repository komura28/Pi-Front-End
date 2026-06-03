import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { authCurso, RegisterTurmaRequest } from "../../types/auth/auth-types";
import { getCurso } from "../../services/authService";
import { cadastrarTurma } from "../../services/admService";

interface CadastroTurmaFormData {
    curso: string;
    turno: string;
    capacidade: number;
    dataInicio: Date;
    dataFim: Date;
}

export function TurmaCadastroPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function carregarTurmas() {
            try{
                setLoading(true);
                const data = await getCurso();
                setCursos(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar cursos: ${error.message}`);
                } else {
                    setError("Erro ao carregar cursos");
                }
            } finally {
                setLoading(false);
            }

        }
        carregarTurmas();

    }, [])
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
                curso: cursos.find(curso => curso._id === data.curso)?._id || "",
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
        console.log("objeto:", data);
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
                            Curso
                        </label>

                            <select
                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 mb-10"

                                {...register("curso", {
                                    required: "O curso é obrigatório",
                                })}
                            >
                                <option value="" disabled>Selecione o curso</option>
                                {cursos.map((curso) => (
                                    <option key={curso._id} value={curso._id}>
                                        {curso.name}
                                    </option>
                                ))}
                            </select>
                            {errors.curso && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.curso.message}
                                </p>
                            )}
                    </div>


                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Capacidade
                        </label>

                        <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite a capacidade"
                            {...register("capacidade", {
                                required: "A capacidade é obrigatória",
                                min: {
                                    value: 1,
                                    message: "A capacidade deve ser um número positivo"
                                }
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
                            <option value="MANHA">Manhã</option>
                            <option value="TARDE">Tarde</option>
                            <option value="NOITE">Noite</option>
                        </select>
                        {errors.turno && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.turno.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Data de Início
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite a data de início"
                            {...register("dataInicio", {
                                required: "A data de início é obrigatória"
                            })}
                        />
                        {errors.dataInicio && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.dataInicio.message}
                            </p>
                        )}
                    </div>

                     <div>
                        <label className="mb-1 block text-gray-700 font-bold text-sm">
                            Data de Fim
                        </label>

                        <input
                            type="date"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite a data de fim"
                            {...register("dataFim", {
                                required: "A data de fim é obrigatória"
                            })}
                        />
                        {errors.dataFim && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.dataFim.message}
                            </p>
                        )}
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