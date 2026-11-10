import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { cpf } from "cpf-cnpj-validator";
import { Modal } from "../../components/Modal";
import { cadastrarProfessor } from "../../services/admService";
import { formatarCPF, formatarTelefone } from "../../utils/formatters";
import { ModalLGPD } from "../../components/ModalLGPD";
import { CampoSenha } from "../../components/CampoSenha";
import { UploadFoto } from "../../components/UploadFoto";

interface CadastroFormData {
  name: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dt_nascimento: string;
  estado_civil: string;
  telefone_principal: string;
  telefone_secundario?: string;
  aceite_lgpd: boolean;
  photo?: FileList;
}

export function RegisterProfessorPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [modal, setModal] = useState(false);
  const [modalLgpdOpen, setModalLgpdOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ mode: "onBlur" });

  const senhaUser = watch("senha")

  async function handleCadastrarProfessor(data: CadastroFormData) {
    try {
      setServerError("");

      const { photo, ...dadosCadastro } = data;

      const payload = {
        ...dadosCadastro,
        cpf: Number(data.cpf.replace(/\D/g, "")),
      };

      if (data.senha.length < 8) {
        setServerError("A senha deve ter no mínimo 8 caracteres.");
        return;
      }

      await cadastrarProfessor(payload, photo?.[0]);
      setModal(true);
    } catch (error) {
      console.log(error);
      setServerError(
        error instanceof Error
          ? error.message
          : "Erro na hora de realizar o cadastro",
      );
    }
  }

  const onError = (errors: FieldErrors<CadastroFormData>) => {
    console.log("Erros de validação do formulário:", errors);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Cadastro de Professor
        </h1>

        <form
          onSubmit={handleSubmit(handleCadastrarProfessor, onError)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nome
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
              <label
                htmlFor="cpf"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                CPF
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
              <label
                htmlFor="dt_nascimento"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Data de Nascimento
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
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-mail
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
              <label
                htmlFor="telefone_principal"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Telefone Principal
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
              <label
                htmlFor="telefone_secundario"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Telefone Secundário/Reserva
              </label>
              <input
                id="telefone_secundario"
                type="text"
                maxLength={15}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="(00) 00000-0000"
                {...register("telefone_secundario", {
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
              <label
                htmlFor="estado_civil"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Estado Civil
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
          </div>

          <CampoSenha
            id="senha"
            label="Senha"
            placeholder="Digite sua Senha"
            registro={register("senha", {
              required: "Senha é obrigatória",
            })}
            erro={errors.senha?.message}
          />

          <CampoSenha
            id="confirmarSenha"
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            registro={register("confirmarSenha", {
              required: "Confirmação é obrigatória",
              validate: (senhaValida) =>
                senhaUser === senhaValida || "Senhas não coincidem",
            })}
            erro={errors.confirmarSenha?.message}
          />

          <UploadFoto
                      foto={watch("photo")?.[0]}
                      onChange={(foto) => {
                        setValue(
                          "photo",
                          foto ? ([foto] as unknown as FileList) : undefined,
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                      }}
                      onError={setServerError}
                    />

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
            message="Professor Cadastrado com Sucesso!"
            decisao={null}
            texto="Ok"
            opSim={() => {
              setModal(false);
              navigate("/app/home");
            }}
          />
        )}

        {modalLgpdOpen && (
          <ModalLGPD onFechar={() => setModalLgpdOpen(false)} />

        )}
      </section>
    </main>
  );
}
