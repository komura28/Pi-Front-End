import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../../assets/logo2.png";
import { cpf } from "cpf-cnpj-validator";
import { Modal } from "../../components/Modal";

interface CadastroFormData {
    name: string;
    cpf: number;
    email: string;
    senha: string;
    confirmarSenha: string;
}

export function RegistroPage() {
    const navigate = useNavigate();
    const { cadastrar } = useAuth()
    const [serverError, setServerError] = useState("");
    const [modal, setModal] = useState(false);
    const [mostrConfirmSenha, setMostrConfirmSenha] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const formatarCPF = (valor: string) => {
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
            .substring(0, 14);
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CadastroFormData>({ mode: "onBlur" });

    const senhaUser = watch("senha");

    async function handleCadastro(data: CadastroFormData) {
        try {
            setServerError("");
            await cadastrar(data);
            console.log("Dados do cadastro:", data);
            setModal(true);
        } catch (error) {
            console.log(error);
            setServerError(error instanceof Error ? error.message : "Erro na hora de realizar o cadastro")
        }
    }

    const onError = (errors: any) => {
        console.log("Erros de validação do formulário:", errors);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg rounded-lg">

                <a href="/login" className="text-blue-500 hover:underline">
                    ← Voltar
                </a>
                <img src={logo} alt="Logo" className="h-16 w-auto object-contain mx-auto" />
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
                            type="text"
                            maxLength={14}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Digite o CPF"
                            {...register("cpf", {
                                required: "O CPF é obrigatório",
                                onChange: (e) => {
                                    e.target.value = formatarCPF(e.target.value);
                                },
                                setValueAs: (valorFormatado) => Number(valorFormatado.replace(/\D/g, "")),

                                validate: async (CPFValido) => {
                                    if (!cpf.isValid(String(CPFValido))) {
                                        return "CPF Inválido"
                                    }
                                }
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
                        <div className="gap-2 flex items-center w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                className="w-full bg-transparent outline-none"
                                placeholder="Digite sua Senha"
                                {...register("senha", {
                                    required: "Senha é obrigatório",
                                })}
                            />
                            <button className="cursor-pointer"
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}>
                                {mostrarSenha ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )}</button>
                        </div>

                        {errors.senha && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.senha.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Confirmar Senha
                        </label>
                        <div className="gap-2 flex items-center w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
                            <input
                                type={mostrConfirmSenha ? "text" : "password"}
                                className="w-full bg-transparent outline-none"
                                placeholder="Confirme sua Senha"
                                {...register("confirmarSenha", {
                                    required: "Confirmação é obrigatório",
                                    validate: (senhaValida) => {
                                        if (senhaUser !== senhaValida) {
                                            return "Senhas não coincidem"
                                        }
                                    },
                                })}
                            />
                            <button className="cursor-pointer"
                                type="button"
                                onClick={() => setMostrConfirmSenha(!mostrConfirmSenha)}>
                                {mostrConfirmSenha ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )
                                }</button>
                        </div>

                        {errors.confirmarSenha && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.confirmarSenha.message}
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

                {modal && (
                    <Modal
                        titulo="Cadastro"
                        message="Usuário Cadastrado com Sucesso"
                        decisao={null}
                        texto="Ok"
                        opSim={() => {
                            setModal(false);
                            navigate("/login");

                        }}
                    />
                )}
            </section>
        </main>
    );
}