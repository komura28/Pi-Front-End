import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import logo from "../../assets/logo2.png";
import { cpf } from "cpf-cnpj-validator";
import { Modal } from "../../components/Modal";
import { UploadFoto } from "../../components/UploadFoto";
import axios from "axios";
import { formatarCPF, formatarTelefone } from "../../utils/formatters";
import { ModalLGPD } from "../../components/ModalLGPD";
import { CampoSenha } from "../../components/CampoSenha";

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
  const { cadastrar, login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [modalLgpdOpen, setModalLgpdOpen] = useState(false);

  const [modal, setModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ mode: "onBlur" });

  const senhaUser = watch("senha");
  const profissaoSelecionada = watch("profissao");
  const temProblemaSaude = watch("tem_problema_saude");

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

      if (data.senha.length < 8) {
        setServerError("A senha deve ter no mínimo 8 caracteres.");
        return;
      }

      await cadastrar(payload, photo?.[0]);
      await login({
        email: data.email,
        senha: data.senha,
      });
      setModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Erros detalhados:",
          JSON.stringify(error.response?.data, null, 2)
        );
      }

      console.error(error);
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
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <Link to="/login" className="text-blue-500 hover:underline">
          ← Voltar
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

            <div>
              <label
                htmlFor="profissao"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Profissão
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
              <label
                htmlFor="profissao_custom"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Especifique a profissão
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
              <label
                htmlFor="tem_problema_saude"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Possui problema de saúde?
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
              <label
                htmlFor="participacao_anterior"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Você já foi ou é palhaço voluntário?
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
              <label
                htmlFor="problemas_saude_custom"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Qual problema de saúde/doença você possui?
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
          <ModalLGPD onFechar={() => setModalLgpdOpen(false)} />
        )}
      </section>
    </main>
  );
}
