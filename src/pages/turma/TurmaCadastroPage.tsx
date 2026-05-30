import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cursos, setCursos] = useState<authCurso[]>([]);

    useEffect(() => {
            async function carregarTurmas() {
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
            setServerError("");
            const dados: RegisterTurmaRequest = {
                curso: cursos.find(curso => curso.id === data.curso)?.id || "",
                turno: data.turno,
                capacidade: data.capacidade,
                dataInicio: data.dataInicio,
                dataFim: data.dataFim
            };
            await cadastrarTurma(dados);
            navigate("/app/turma");
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
        console.log("objeto: ", data);
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
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            {...register("curso", {
                                required: "O curso é obrigatório",
                            })}>
                                <option value="" disabled>Selecione um Curso</option>
                                {cursos.map((curso) =>
                                    <option key={curso.id} value={curso.id}>{curso.name}</option>)}
                        </select>
                        {errors.curso && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.curso.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            turno
                        </label>
                        <select
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 mb-10"
                            {...register("turno", {
                                required: "O turno é obrigatório",
                            })}
                        >
                            <option value="" disabled>Selecione um Turno</option>
                            <option value="manha" >Manhã</option>
                            <option value="tarde" >Tarde</option>
                            <option value="noite" >Noite</option>
                        </select>
                        {errors.turno && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.turno.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Capacidade
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="1-35"
                            max="35"
                            min="1"
                            {...register("capacidade", {
                                valueAsNumber: true,
                                required: "A capacidade é obrigatório",
                                min: {value: 1, message:"Valor menor que 1. Digite acima"},
                                max: {value: 35, message:"Valor maior que 35. Digite abaixo"},
                                
                            })}
                        />
                        
                        {errors.capacidade && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.capacidade.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
            </section>
        </main>
    );
};