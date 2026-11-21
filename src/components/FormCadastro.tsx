import { useNavigate } from "react-router-dom";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { formatarCPF, formatarTelefone } from "../utils/formatters";
import { cpf } from "cpf-cnpj-validator";
import { UploadFoto } from "./UploadFoto.tsx";
import { Modal } from "./Modal";
import { CampoSenha } from "./CampoSenha.tsx";
import { cadastrarProfessor } from "../services/admService";
import { SuccessDialog } from "./ui/SuccessDialog.tsx";
import { ShieldCheck, UserPlus } from "lucide-react";
import { AppDialog } from "./ui/AppDialog.tsx";

interface CadastroFormDataProps {
  tipo?: "comum" | "professor";
}

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

export function FormCadastro({ tipo = "comum" }: CadastroFormDataProps) {
  const navigate = useNavigate();
  const { cadastrar, login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [modal, setModal] = useState(false);
  const [modalLgpdOpen, setModalLgpdOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({ mode: "onBlur" });

  const senhaUser = useWatch({ control, name: "senha" });
  const profissaoSelecionada = useWatch({ control, name: "profissao" });
  const temProblemaSaude = useWatch({ control, name: "tem_problema_saude" });
  const fotoSelecionada = useWatch({ control, name: "photo" });

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

      if (tipo === "professor") {
        await cadastrarProfessor(payload, photo?.[0]);
      } else {
        await cadastrar(payload, photo?.[0]);
        await login({
          email: data.email,
          senha: data.senha,
        });
      }
      setModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "Erros detalhados:",
          JSON.stringify(error.response?.data, null, 2),
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
    <section
      className={
        tipo === "professor"
          ? "w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
          : "w-full min-w-0 max-w-xl rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:p-8"
      }
    >
      {tipo === "professor" && (
        <div className="mb-6 border-b border-slate-200 pb-5 sm:mb-8">
    <h2 className="break-words text-lg font-bold text-slate-800 sm:text-xl">
            Informações do professor
          </h2>

          <p className="mt-2 break-words text-sm text-slate-500">
            Preencha os dados pessoais, de contato e de acesso.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleCadastro, onError)}
        className="space-y-4 sm:space-y-5"
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
            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
            placeholder="Digite o nome"
            {...register("name", {
              required: "O nome é obrigatório",
            })}
          />
          {errors.name && (
            <p className="mt-1 break-words text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
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
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
              <p className="mt-1 break-words text-sm text-red-600">{errors.cpf.message}</p>
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
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
              {...register("dt_nascimento", {
                required: "Data de nascimento é obrigatória",
              })}
            />
            {errors.dt_nascimento && (
              <p className="mt-1 break-words text-sm text-red-600">
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
            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
            placeholder="admin@gmail.com"
            {...register("email", {
              required: "O e-mail é obrigatório",
            })}
          />
          {errors.email && (
            <p className="mt-1 break-words text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
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
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
              <p className="mt-1 break-words text-sm text-red-600">
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
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
              <p className="mt-1 break-words text-sm text-red-600">
                {errors.telefone_secundario.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="estado_civil"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Estado Civil
            </label>
            <select
              id="estado_civil"
              className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
              <p className="mt-1 break-words text-sm text-red-600">
                {errors.estado_civil.message}
              </p>
            )}
          </div>

          {tipo === "comum" && (
            <div>
              <label
                htmlFor="profissao"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Profissão
              </label>
              <select
                id="profissao"
                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
                <p className="mt-1 break-words text-sm text-red-600">
                  {errors.profissao.message}
                </p>
              )}
            </div>
          )}
        </div>

        {tipo === "comum" && profissaoSelecionada === "Outro" && (
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
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
              placeholder="Qual sua profissão?"
              {...register("profissao_custom", {
                required: "Especifique sua profissão",
              })}
            />
            {errors.profissao_custom && (
              <p className="mt-1 break-words text-sm text-red-600">
                {errors.profissao_custom.message}
              </p>
            )}
          </div>
        )}

        {tipo === "comum" && (
          <>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="tem_problema_saude"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Possui problema de saúde?
                </label>
                <select
                  id="tem_problema_saude"
                  className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
                  {...register("tem_problema_saude", {
                    required: "Selecione uma opção",
                  })}
                >
                  <option value="">Selecione...</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.tem_problema_saude && (
                  <p className="mt-1 break-words text-sm text-red-600">
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
                  className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
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
                  <p className="mt-1 break-words text-sm text-red-600">
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
                  className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 sm:text-sm"
                  placeholder="Digite a doença ou condição de saúde"
                  {...register("problemas_saude_custom", {
                    required: "Descreva o problema de saúde",
                  })}
                />
                {errors.problemas_saude_custom && (
                  <p className="mt-1 break-words text-sm text-red-600">
                    {errors.problemas_saude_custom.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <CampoSenha
          id="senha"
          label="Senha"
          placeholder="Digite sua senha"
          register={register}
          error={errors.senha?.message}
        />

        <CampoSenha
          id="confirmarSenha"
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          register={register}
          error={errors.confirmarSenha?.message}
          validate={(senhaValida) => {
            if (senhaUser !== senhaValida) {
              return "Senhas não coincidem";
            }
          }}
        />

        <UploadFoto
          foto={fotoSelecionada?.[0]}
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

        <div className="flex min-w-0 items-start gap-2 pt-2">
          <input
            type="checkbox"
            id="aceite_lgpd"
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register("aceite_lgpd", {
              required: "Você deve aceitar os termos da LGPD para continuar",
            })}
          />
          <label htmlFor="aceite_lgpd" className="min-w-0 break-words text-xs leading-relaxed text-gray-600">
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
          <p className="break-words text-sm text-red-600">{errors.aceite_lgpd.message}</p>
        )}

        {serverError && (
          <p className="break-words rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </p>
        )}

        {tipo === "professor" ? (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/app/user")}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <UserPlus size={18} />

              {isSubmitting ? "Cadastrando..." : "Cadastrar professor"}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        )}
      </form>

      {tipo === "professor" ? (
        <SuccessDialog
          aberto={modal}
          aoFechar={() => {
            setModal(false);
            navigate("/app/user");
          }}
          titulo="Professor cadastrado!"
          mensagem="O professor foi cadastrado com sucesso e já possui uma conta no Aticurando."
        />
      ) : (
        modal && (
          <Modal
            titulo="Cadastro"
            message="Usuário cadastrado com sucesso!"
            decisao={null}
            texto="Ok"
            opSim={() => {
              setModal(false);
              navigate("/login");
            }}
          />
        )
      )}

      <AppDialog
        aberto={modalLgpdOpen}
        aoFechar={() => setModalLgpdOpen(false)}
        titulo="Termos de Privacidade e Proteção de Dados"
        descricao="Leia as informações sobre o tratamento dos dados pessoais."
        icone={ShieldCheck}
        tamanho="lg"
        rodape={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setModalLgpdOpen(false)}
              className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Entendi e fechar
            </button>
          </div>
        }
      >
        <div className="min-w-0 space-y-4 text-sm text-slate-600">
          <div className="min-w-0 space-y-4 text-sm text-gray-600">
            <p>
              Para fins de transparência e em cumprimento à Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018), informamos detalhadamente
              quais dados são coletados e qual a sua finalidade:
            </p>

            <div className="min-w-0 break-words rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                1. Dados Pessoais Identificáveis:
              </h3>
              <ul className="list-disc space-y-1 break-words pl-5">
                <li>
                  <strong>Nome completo:</strong> Para identificação do usuário
                  na plataforma.
                </li>
                <li>
                  <strong>CPF:</strong> Para validação única e autenticidade da
                  conta.
                </li>
                <li>
                  <strong>Data de Nascimento:</strong> Para validação de faixa
                  etária.
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
                  <strong>Estado Civil e Profissão:</strong> Para mapeamento de
                  perfil dos integrantes.
                </li>
              </ul>
            </div>

            <div className="min-w-0 break-words rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                2. Dados Sensíveis (Saúde):
              </h3>
              <ul className="list-disc space-y-1 break-words pl-5">
                <li>
                  <strong>Problemas de Saúde e Condições Médicas:</strong>{" "}
                  Utilizados exclusivamente para segurança do participante em
                  atividades presenciais ou eventos da instituição.
                </li>
              </ul>
            </div>

            <div className="min-w-0 break-words rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                3. Finalidade e Armazenamento:
              </h3>
              <p>
                Os dados são armazenados em ambiente seguro com controle de
                acesso estrito e não são compartilhados com terceiros para fins
                comerciais.
              </p>
            </div>
          </div>
        </div>
      </AppDialog>
    </section>
  );
}
