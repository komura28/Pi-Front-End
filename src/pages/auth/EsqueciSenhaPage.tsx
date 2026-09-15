import { useState } from "react";
import { useForm } from "react-hook-form";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo2.png";

interface EsqueciSenhaFormData {
    email: string;
}

export function EsqueciSenhaPage() {
    const navigate = useNavigate();
    const { esqueciSenha } = useAuth();
    const [serverError, setServerError] = useState("");
    const [status, setStatus] = useState(false)
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting }
    } = useForm<EsqueciSenhaFormData>();

    async function handleEsqueciSenha(data: EsqueciSenhaFormData) {
        try {
            setStatus(false)
            setServerError("");
            const enviarSenha = await esqueciSenha(data);
            setStatus(true);
            console.log("data: ", data);
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro ao enviar a senha");
            console.log("data: ", data);
        }
    }
    function handleVoltar() {
        navigate(-1);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg rounded-lg">
                <img src={logo} alt="Logo" className="h-16 w-auto object-contain mx-auto" />
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
                    Esqueci Senha
                </h1>

                {status && (
                    <p className="rounded-lg bg-green-50 px-3 py-2 text-green-700 font-medium">
                        Se o e-mail estiver cadastrado, você receberá as instruções em breve!
                    </p>
                )}

                <p className="mb-4 text-center text-sm text-gray-500">
                    Acesse o painel do sistema
                </p>

                <form onSubmit={handleSubmit(handleEsqueciSenha)} className="space-y-4">
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
                        {
                            serverError && (
                                <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
                                    {serverError}
                                </p>
                            )
                        }
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>

                    <button
                        type="button"
                        onClick={handleVoltar}
                        className="w-full rounded-lg bg-blue-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Voltar
                    </button>
                </form>

            </section>
        </main>
    );

} 
