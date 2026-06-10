import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo2.png";
 
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

    async function handleLogin(data: LoginFormData) {
        try {
            setServerError("");
             const loggedUser= await login(data);
                if (loggedUser.papelUsuario === "ALUNO") {
                    navigate("/api/home");
                } else if (loggedUser.papelUsuario === "ADM") {
                    navigate("/app/home");
                }
            console.log("data: ", data);
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro ao realisar login. Verifique os dados informados");
            console.log("data: ", data);
        } 
    }



    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
            <section className="w-full max-w-md rounded-2x1 bg-white p-8 shadow-lg rounded-lg">
                <img src={logo} alt="Logo" className="h-16 w-auto object-contain mx-auto" />
                <h1 className="mb-2 text-center text-2x1 font-bold text-gray-800">
                    Aticurando
                </h1>

                <p className="mb-b text-center text-sm text-gray-500">
                    Acesse o painel do sistema
                </p>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
                        {/* {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )} */}
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

                        {/* {errors.senha && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.senha.message}
                            </p>
                        )} */}
                    </div>

                    {
                        serverError && (
                            <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
                                Usuario ou senha inválidos. Verifique os dados informados e tente novamente.
                            </p>
                        )
                    }
                    <Link to="/cadastro" className="text-blue-600 hover:underline">
                        Cadastre-se
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    ); 
} 
