import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { authCurso, RegisterTurmaRequest } from "../../types/auth/auth-types";
import { getCurso } from "../../services/authService";
import { cadastrarTurma } from "../../services/admService";
import { PageHeader } from "../../components/ui/PageHeader";
import { SuccessDialog } from "../../components/ui/SuccessDialog";
import {
    Users,
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Save
} from "lucide-react";

import axios from "axios";

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
    const [modal, setModal] = useState(false);

    useEffect(() => {
        async function carregarTurmas() {
            try {
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
        formState: { errors, isSubmitting }
    } = useForm<CadastroTurmaFormData>({
        defaultValues: {
            curso: "",
            turno: ""
        }
    });

    if (loading) {
        return (
            <div className="p-8">
                <p>Carregando cursos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                <p>{error}</p>
            </div>
        );
    }


    async function handleCadastro(data: CadastroTurmaFormData) {
        try {
            setServerError("");

            const dados: RegisterTurmaRequest = {
                curso: data.curso,
                turno: data.turno,
                capacidade: data.capacidade,
                dataInicio: data.dataInicio,
                dataFim: data.dataFim
            };

            await cadastrarTurma(dados);

            setModal(true);

        } catch (error: unknown) {
            console.error("Erro ao cadastrar turma:", error);

            const mensagemBackend = axios.isAxiosError<{
                message?: string
            }>(error)
                ? error.response?.data?.message
                : undefined;

            setServerError(
                mensagemBackend ??
                "Não foi possível cadastrar a turma. Tente novamente."
            );
        }
    }

    return (
        <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <PageHeader
                titulo="Cadastrar turma"
                descricao="Configure o curso, as vagas e o período da nova turma."
                categoria="PAINEL ADMINISTRATIVO"
                icone={Users}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/turma")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 sm:w-auto sm:text-base"
                    >
                        <ArrowLeft size={18} />
                        Voltar às turmas
                    </button>
                }
            />

            <form
                onSubmit={handleSubmit(handleCadastro)}
                className="space-y-6"
            >
                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">

                    <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:items-center">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <BookOpen size={22} className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 sm:p-3" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                                Informações da turma
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Selecione o curso e configure as vagas.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="min-w-0">
                            <label
                                htmlFor="turma-curso"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Curso *
                            </label>

                            <select
                                id="turma-curso"
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm"
                                {...register("curso", {
                                    required: "O curso é obrigatório"
                                })}
                            >
                                <option value="">
                                    Selecione um curso
                                </option>

                                {cursos.map((curso) => (
                                    <option
                                        key={curso._id}
                                        value={curso._id}
                                    >
                                        {curso.name}
                                    </option>
                                ))}
                            </select>

                            {errors.curso && (
                                <p role="alert" className="mt-2 text-sm text-red-600">
                                    {errors.curso.message}
                                </p>
                            )}
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                            <div className="min-w-0">
                                <label
                                    htmlFor="turma-capacidade"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Capacidade *
                                </label>

                                <input
                                    id="turma-capacidade"
                                    type="number"
                                    min={1}
                                    step={1}
                                    placeholder="Número de vagas"
                                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm"
                                    {...register("capacidade", {
                                        valueAsNumber: true,
                                        required: "A capacidade é obrigatória",
                                        min: {
                                            value: 1,
                                            message: "A capacidade deve ser maior que zero"
                                        },
                                        validate: (value) =>
                                            Number.isInteger(value) ||
                                            "Informe um número inteiro"
                                    })}
                                />

                                {errors.capacidade && (
                                    <p role="alert" className="mt-2 text-sm text-red-600">
                                        {errors.capacidade.message}
                                    </p>
                                )}
                            </div>

                            <div className="min-w-0">
                                <label
                                    htmlFor="turma-turno"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Turno *
                                </label>

                                <select
                                    id="turma-turno"
                                    className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm"
                                    {...register("turno", {
                                        required: "O turno é obrigatório"
                                    })}
                                >
                                    <option value="">
                                        Selecione um turno
                                    </option>
                                    <option value="MANHA">Manhã</option>
                                    <option value="TARDE">Tarde</option>
                                    <option value="NOITE">Noite</option>
                                </select>

                                {errors.turno && (
                                    <p role="alert" className="mt-2 text-sm text-red-600">
                                        {errors.turno.message}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">

                    <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:items-center">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <CalendarDays size={22} className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 sm:p-3" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                                Período da turma
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Defina as datas de início e término.
                            </p>
                        </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

                        <div className="min-w-0">
                            <label
                                htmlFor="turma-inicio"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Data de início *
                            </label>

                            <input
                                id="turma-inicio"
                                type="date"
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm"
                                {...register("dataInicio", {
                                    valueAsDate: true,
                                    required: "A data de início é obrigatória"
                                })}
                            />

                            {errors.dataInicio && (
                                <p role="alert" className="mt-2 text-sm text-red-600">
                                    {errors.dataInicio.message}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0">
                            <label
                                htmlFor="turma-fim"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Data de término *
                            </label>

                            <input
                                id="turma-fim"
                                type="date"
                                className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm"
                                {...register("dataFim", {
                                    valueAsDate: true,
                                    required: "A data de término é obrigatória",
                                    validate: (fim, valores) => {
                                        const inicio = valores.dataInicio;

                                        if (!inicio) return true;

                                        return fim > inicio ||
                                            "A data de término deve ser posterior à data de início";
                                    }
                                })}
                            />

                            {errors.dataFim && (
                                <p role="alert" className="mt-2 text-sm text-red-600">
                                    {errors.dataFim.message}
                                </p>
                            )}
                        </div>

                    </div>
                </section>

                {serverError && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                    >
                        {serverError}
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() => navigate("/app/turma")}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || cursos.length === 0}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSubmitting
                            ? "Cadastrando..."
                            : "Cadastrar turma"}
                    </button>

                </div>
            </form>

            <SuccessDialog
                aberto={modal}
                aoFechar={() => {
                    setModal(false);
                    navigate("/app/turma");
                }}
                titulo="Turma cadastrada!"
                mensagem="A turma foi cadastrada com sucesso e já está disponível na listagem."
            />

        </main>
    );
};