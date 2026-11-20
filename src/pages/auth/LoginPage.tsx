import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo2.png";
import { FaArrowLeft } from "react-icons/fa6";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
    email: string;
    senha: string;
}

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>();
    const [mostrarSenha, setMostrarSenha] = useState(false);

    async function handleLogin(data: LoginFormData) {
        try {
            setServerError("");

            const loggedUser = await login(data);

            if (loggedUser.papelUsuario === "ALUNO") {
                navigate("/api/home");
            } else if (loggedUser.papelUsuario === "ADM") {
                navigate("/app/home");
            } else if (loggedUser.papelUsuario === "PROFESSOR") {
                navigate("/professor/home");
            }

        } catch {
            setServerError(
                "Usuário ou senha inválidos. Verifique os dados informados e tente novamente."
            );
        }
    }


    return (
        <main className="flex min-h-dvh items-center justify-center bg-[#0F172A] px-4 py-6 sm:px-6 sm:py-8">
            <section className="w-full min-w-0 max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-8">
                <Link
                    to="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                    <FaArrowLeft aria-hidden="true" />
                    Voltar para a Home
                </Link>
                <img src={logo} alt="Logo" className="mx-auto h-12 w-auto object-contain sm:h-16" />
                <h1 className="mb-2 text-center text-xl font-bold text-gray-800 sm:text-2xl">
                    Aticurando
                </h1>

                <p className="mb-6 text-center text-sm text-gray-500">
                    Acesse o painel do sistema
                </p>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none focus:border-blue-500"
                            placeholder="Digite seu e-mail"
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
                        <label
                            htmlFor="senha"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Senha
                        </label>

                        <div className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">

                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                autoComplete="current-password"
                                className="min-w-0 flex-1 bg-transparent py-1 text-base outline-none"
                                placeholder="Digite sua senha"
                                {...register("senha", {
                                    required: "A senha é obrigatória",
                                })}
                            />

                            <button
                                type="button"
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="shrink-0 cursor-pointer rounded-md p-2 text-slate-500 transition hover:bg-slate-100"
                                onClick={() => setMostrarSenha((atual) => !atual)}
                            >
                                {mostrarSenha ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {errors.senha && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.senha.message}
                            </p>
                        )}
                    </div>

                    <div className="flex w-full flex-col items-center gap-3 pt-2 text-sm sm:flex-row sm:justify-between">

                        <Link
                            to="/cadastro"
                            className="text-blue-600 hover:underline"
                        >
                            Cadastre-se
                        </Link>

                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:underline"
                        >
                            Esqueci Minha Senha
                        </Link>

                    </div>

                    {
                        serverError && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                            >
                                {serverError}
                            </p>
                        )
                    }

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    );
} 
