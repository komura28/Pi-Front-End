import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import logo from "../../assets/logo2.png";
import { cpf } from "cpf-cnpj-validator";
import { Modal } from "../../components/Modal";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

interface CadastroFormData {
  name: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dt_nascimento: string;
  participacao_anterior: boolean;
  estado_civil: string;
  profissao: string;
  profissao_custom?: string;
  tem_problema_saude: string;
  problemas_saude_custom?: string;
  telefone_principal: string;
  telefone_secundario: string;
  aceite_lgpd: boolean;
  photo?: FileList;
}

export function RegistroPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const voltarPara =
    location.state?.origem === "home" ? "/" : "/login";
  const { cadastrar, login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [modal, setModal] = useState(false);
  const [modalLgpdOpen, setModalLgpdOpen] = useState(false);
  const [mostrConfirmSenha, setMostrConfirmSenha] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const formatarCPF = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
      .substring(0, 14);
  };

  const formatarTelefone = (valor: string) => {
    const digitos = valor.replace(/\D/g, "").substring(0, 11);
    if (digitos.length <= 10) {
      return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ mode: "onBlur" });

  const senhaUser = watch("senha");
  const profissaoSelecionada = watch("profissao");
  const temProblemaSaude = watch("tem_problema_saude");
  const previewFoto = watch("photo")?.[0];

  useEffect(() => {
    if (!previewFoto) {
      setPreviewURL(null);
      return;
    }

    const url = URL.createObjectURL(previewFoto);
    setPreviewURL(url);

    return () => URL.revokeObjectURL(url);
  }, [previewFoto]);

  const removeFoto = () => {
    setValue("photo", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  async function handleCadastro(data: CadastroFormData) {
    try {
      setServerError("");

      const { photo, ...dadosCadastro } = data;

      const payload = {
        ...dadosCadastro,
        cpf: Number(data.cpf.replace(/\D/g, "")),
        profissao:
          data.profissao === "Outro"
            ? (data.profissao_custom ?? "")
            : data.profissao,
        problemas_saude:
          data.tem_problema_saude === "Sim"
            ? (data.problemas_saude_custom ?? "")
            : "Não",
      };

      await cadastrar(payload, photo?.[0]);
      await login({
        email: data.email,
        senha: data.senha,
      });
      setModal(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const mensagem = error.response?.data?.message;

        if (
          status === 409 &&
          typeof mensagem === "string" &&
          mensagem.includes("E-mail já cadastrado")
        ) {
          setError("email", {
            type: "server",
            message: "Este e-mail já está cadastrado. Utilize outro ou faça login.",
          });

          return;
        }

        if (
          status === 409 &&
          typeof mensagem === "string" &&
          mensagem.includes("CPF já cadastrado")
        ) {
          setError("cpf", {
            type: "server",
            message: "Este CPF já está cadastrado.",
          });

          return;
        }

        setServerError(
          typeof mensagem === "string"
            ? mensagem
            : "Não foi possível realizar o cadastro."
        );

        return;
      }

      setServerError("Erro inesperado ao realizar o cadastro.");
    }
  }

  const onError = (errors: FieldErrors<CadastroFormData>) => {
    console.log("Erros de validação do formulário:", errors);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <Link
          to={voltarPara}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
        >
          <FaArrowLeft aria-hidden="true" />
          Voltar
        </Link>
        <img
          src={logo}
          alt="Logo"
          className="mx-auto h-16 w-auto object-contain"
        />
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Aticurando
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Faça seu cadastro
        </p>

        <form
          onSubmit={handleSubmit(handleCadastro, onError)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Nome <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Digite o nome"
              {...register("name", {
                required: "O nome é obrigatório",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cpf" className="mb-1 block text-sm font-medium text-gray-700">
                CPF <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="cpf"
                type="text"
                maxLength={14}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="000.000.000-00"
                {...register("cpf", {
                  required: "O CPF é obrigatório",
                  onChange: (e) => {
                    setValue("cpf", formatarCPF(e.target.value));
                  },
                  validate: (v) =>
                    cpf.isValid(v.replace(/\D/g, "")) || "CPF Inválido",
                })}
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cpf.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dt_nascimento" className="mb-1 block text-sm font-medium text-gray-700">
                Data de Nascimento <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="dt_nascimento"
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                {...register("dt_nascimento", {
                  required: "Data de nascimento é obrigatória",
                })}
              />
              {errors.dt_nascimento && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dt_nascimento.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              E-mail <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="telefone_principal" className="mb-1 block text-sm font-medium text-gray-700">
                Telefone Principal <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="telefone_principal"
                type="text"
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="(00) 00000-0000"
                {...register("telefone_principal", {
                  required: "Telefone principal é obrigatório",
                  onChange: (e) => {
                    setValue(
                      "telefone_principal",
                      formatarTelefone(e.target.value),
                    );
                  },
                })}
              />
              {errors.telefone_principal && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefone_principal.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="telefone_secundario" className="mb-1 block text-sm font-medium text-gray-700">
                Contato de Emergência  <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="telefone_secundario"
                type="text"
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="(00) 00000-0000"
                {...register("telefone_secundario", {
                  required: "Telefone secundário é obrigatório",
                  onChange: (e) => {
                    setValue(
                      "telefone_secundario",
                      formatarTelefone(e.target.value),
                    );
                  },
                })}
              />
              {errors.telefone_secundario && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefone_secundario.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="estado_civil" className="mb-1 block text-sm font-medium text-gray-700">
                Estado Civil <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="estado_civil"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                {...register("estado_civil", {
                  required: "Selecione o estado civil",
                })}
              >
                <option value="">Selecione...</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viuvo(a)">Viúvo(a)</option>
                <option value="Uniao Estavel">União Estável</option>
              </select>
              {errors.estado_civil && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.estado_civil.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="profissao" className="mb-1 block text-sm font-medium text-gray-700">
                Profissão <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="profissao"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                {...register("profissao", {
                  required: "Selecione a profissão",
                })}
              >
                <option value="">Selecione...</option>
                <option value="Estudante">Estudante</option>
                <option value="Empregado">Empregado</option>
                <option value="Autônomo">Autônomo</option>
                <option value="Desempregado">Desempregado</option>
                <option value="Aposentado">Aposentado</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.profissao && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profissao.message}
                </p>
              )}
            </div>
          </div>

          {profissaoSelecionada === "Outro" && (
            <div>
              <label htmlFor="profissao_custom" className="mb-1 block text-sm font-medium text-gray-700">
                Especifique a profissão <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="profissao_custom"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Qual sua profissão?"
                {...register("profissao_custom", {
                  required: "Especifique sua profissão",
                })}
              />
              {errors.profissao_custom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profissao_custom.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tem_problema_saude" className="mb-1 block text-sm font-medium text-gray-700">
                Possui problema de saúde? <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="tem_problema_saude"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                {...register("tem_problema_saude", {
                  required: "Selecione uma opção",
                })}
              >
                <option value="">Selecione...</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
              {errors.tem_problema_saude && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tem_problema_saude.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="participacao_anterior" className="mb-1 block text-sm font-medium text-gray-700">
                Você já foi ou é palhaço voluntário? <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="participacao_anterior"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                {...register("participacao_anterior", {
                  setValueAs: (v) => (v === "" ? undefined : v === "true"),
                  validate: (val) =>
                    val !== undefined || "Selecione se já participou",
                })}
              >
                <option value="">Selecione...</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
              {errors.participacao_anterior && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.participacao_anterior.message}
                </p>
              )}
            </div>
          </div>

          {temProblemaSaude === "Sim" && (
            <div>
              <label htmlFor="problemas_saude_custom" className="mb-1 block text-sm font-medium text-gray-700">
                Qual problema de saúde/doença você possui? <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="problemas_saude_custom"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Digite a doença ou condição de saúde"
                {...register("problemas_saude_custom", {
                  required: "Descreva o problema de saúde",
                })}
              />
              {errors.problemas_saude_custom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.problemas_saude_custom.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium text-gray-700">
              Senha <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                className="w-full bg-transparent outline-none"
                placeholder="Digite sua Senha"
                {...register("senha", {
                  required: "Senha é obrigatório",
                  minLength: {
                    value: 8,
                    message: "A senha deve possuir pelo menos 8 caracteres",
                  },

                  deps: ["confirmarSenha"],
                })}
              />
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 0 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.senha && (
              <p className="mt-1 text-sm text-red-600">
                {errors.senha.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="mb-1 block text-sm font-medium text-gray-700">
              Confirmar Senha <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
              <input
                id="confirmarSenha"
                type={mostrConfirmSenha ? "text" : "password"}
                className="w-full bg-transparent outline-none"
                placeholder="Confirme sua Senha"
                {...register("confirmarSenha", {
                  required: "A confirmação da senha é obrigatória",

                  minLength: {
                    value: 8,
                    message: "A confirmação deve possuir pelo menos 8 caracteres",
                  },

                  validate: (valor) =>
                    valor === senhaUser || "As senhas não coincidem",
                })}
              />
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => setMostrConfirmSenha(!mostrConfirmSenha)}
              >
                {mostrConfirmSenha ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.confirmarSenha && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="photo"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Foto de Perfil
              <span className="ml-1 font-normal text-gray-400">(Opcional)</span>
            </label>
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-blue-400 hover:bg-blue-50/30">
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="sr-only"
                {...register("photo")}
              />

              {previewURL && (
                <div className="relative mx-auto h-40 w-40">
                  <img
                    src={previewURL}
                    alt="Preview da Foto"
                    className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
                  />

                  <button
                    type="button"
                    onClick={removeFoto}
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 cursor-pointer"
                    aria-label="Remover Foto">
                    X
                  </button>
                </div>
              )}

              {!previewURL && (
                <label
                  htmlFor="photo"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2"
                >
                  <div className="rounded-full bg-blue-100 p-4">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 16V4m0 0L8 8m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                      />
                    </svg>

                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    Clique para Selecionar uma imagem
                  </p>

                  <p className="text-xs text-gray-500">JPG, PNG ou WEBP</p>
                </label>
              )}
            </div>


          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="aceite_lgpd"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register("aceite_lgpd", {
                required: "Você deve aceitar os termos da LGPD para continuar",
              })}
            />
            <label htmlFor="aceite_lgpd" className="text-xs text-gray-600">
              Concordo com a coleta e tratamento dos meus dados pessoais em
              conformidade com a LGPD.{" "}
              <button
                type="button"
                onClick={() => setModalLgpdOpen(true)}
                className="font-semibold text-blue-600 underline hover:text-blue-800 cursor-pointer"
              >
                Leia os termos completos
              </button>
            </label>
          </div>
          {errors.aceite_lgpd && (
            <p className="text-sm text-red-600">{errors.aceite_lgpd.message}</p>
          )}

          {serverError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {modal && (
          <Modal
            titulo="Cadastro"
            message="Usuário Cadastrado com Sucesso!"
            decisao={null}
            texto="Ok"
            opSim={() => {
              setModal(false);
              navigate("/login");
            }}
          />
        )}

        {modalLgpdOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 sm:p-8 shadow-2xl">
              <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">
                Termos de Privacidade e Proteção de Dados (LGPD)
              </h2>

              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Para fins de transparência e em cumprimento à Lei Geral de
                  Proteção de Dados (Lei nº 13.709/2018), informamos
                  detalhadamente quais dados são coletados e qual a sua
                  finalidade:
                </p>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    1. Dados Pessoais Identificáveis:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Nome completo:</strong> Para identificação do
                      usuário na plataforma.
                    </li>
                    <li>
                      <strong>CPF:</strong> Para validação única e autenticidade
                      da conta.
                    </li>
                    <li>
                      <strong>Data de Nascimento:</strong> Para validação de
                      faixa etária.
                    </li>
                    <li>
                      <strong>E-mail:</strong> Para login, comunicações e
                      recuperação de senha.
                    </li>
                    <li>
                      <strong>Telefones (Principal e Secundário):</strong> Para
                      contato e avisos organizacionais.
                    </li>
                    <li>
                      <strong>Estado Civil e Profissão:</strong> Para mapeamento
                      de perfil dos integrantes.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    2. Dados Sensíveis (Saúde):
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Problemas de Saúde e Condições Médicas:</strong>{" "}
                      Utilizados exclusivamente para segurança do participante
                      em atividades presenciais ou eventos da instituição.
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    3. Finalidade e Armazenamento:
                  </h3>
                  <p>
                    Os dados são armazenados em ambiente seguro com controle de
                    acesso estrito e não são compartilhados com terceiros para
                    fins comerciais.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalLgpdOpen(false)}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Entendi e Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}