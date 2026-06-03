import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CadastroFormData {
    name: string;
    cpf: string;
    email: string;
    senha: string;
}

export function RegistroPage() {
    const navigate = useNavigate();
    const { cadastrar } = useAuth()
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CadastroFormData>();

    async function handleCadastro(data: CadastroFormData) {
        try {
            setServerError("");
            await cadastrar(data);
            navigate("/app/home");
            alert("Cadastro realizado com sucesso!");
            console.log("Dados do cadastro:", data);
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
    }

    const onError = (errors: any) => {
        console.log("Erros de validação do formulário:", errors);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <section className="w-full max-w-md rounded-2x1 bg-white p-8 shadow-lg">
                <a href="/login" className="text-blue-500 hover:underline">
                    ← Voltar
                </a>
                <h1 className="mb-2 text-center text-2x1 font-bold text-gray-800">
                    Aticurando
                </h1>

                <p className="mb-b text-center text-sm text-gray-500">
                    Faça seu cadastro
                </p>

                <form onSubmit={handleSubmit(handleCadastro, onError)} className="space-y-4">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nome
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite o nome"
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
                            CPF
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite o CPF"
                            {...register("cpf", {
                                required: "O CPF é obrigatório",
                            })}
                        />
                        {errors.cpf && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.cpf.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="admin@gmail.com"
                            {...register("email", {
                                required: "O e-mail é obrigatório",
                            })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite sua senha"
                            {...register("senha", {
                                required: "A senha é obrigatório",
                            })}
                        />

                        {errors.senha && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.senha.message}
                            </p>
                        )}
                    </div>

                    {
                        serverError && (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
                                {serverError}
                            </p>
                        )
                    }
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
}