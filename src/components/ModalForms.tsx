import { ClipboardCheck, Eye, CheckCircle2, XCircle } from "lucide-react";

import { AppDialog } from "./ui/AppDialog";
import { formatDate } from "../utils/formatters";

import type { MatriculaDTO } from "../types/matricula/matricula-types";
import type { IUserDTO } from "../types/user/user-types";

interface IModalForms {
  aberto: boolean;
  titulo: string;
  message: string;
  matricula: MatriculaDTO | null;
  dados_formulario: IUserDTO | null;
  opNao: () => void;
  carregando?: boolean;
  carregandoDados?: boolean;
  erro?: string;
  erroDados?: string;
  aoTentarNovamente?: () => void;
  modo: "ANALISE" | "VISUALIZACAO";
  aoAprovar?: () => void;
  aoRecusar?: () => void;
}

function Campo({
  titulo,
  valor
}: Readonly<{
  titulo: string;
  valor?: string | number | null;
}>) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-semibold text-slate-500">
        {titulo}
      </p>

      <p className="break-words text-sm text-slate-800">
        {valor === null || valor === undefined || valor === ""
          ? "Não informado"
          : valor}
      </p>
    </div>
  );
}

export function ModalForms({
  aberto,
  titulo,
  message,
  matricula,
  dados_formulario,
  opNao,
  carregando = false,
  carregandoDados = false,
  erro,
  erroDados,
  modo,
  aoAprovar,
  aoRecusar,
  aoTentarNovamente
}: Readonly<IModalForms>) {
  const visualizacao = modo === "VISUALIZACAO";

  const Icone = visualizacao ? Eye : ClipboardCheck;

  const usuario = dados_formulario ?? matricula?.user;

  return (
    <AppDialog
      aberto={aberto}
      aoFechar={opNao}
      titulo={titulo}
      descricao={message}
      icone={Icone}
      tamanho="lg"
      salvando={carregando}
      rodape={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={opNao}
            disabled={carregando}
            className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
          >
            {visualizacao ? "Fechar" : "Cancelar"}
          </button>

          {!visualizacao && (
            <>
              <button
                type="button"
                onClick={aoRecusar}
                disabled={
                  carregando ||
                  carregandoDados ||
                  !dados_formulario
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 sm:w-auto"
              >
                <XCircle size={17} />
                {carregando ? "Processando..." : "Recusar"}
              </button>

              <button
                type="button"
                onClick={aoAprovar}
                disabled={
                  carregando ||
                  carregandoDados ||
                  !dados_formulario
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 sm:w-auto"
              >
                <CheckCircle2 size={17} />
                {carregando ? "Processando..." : "Aprovar"}
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="min-w-0 space-y-6">
        {erro && (
          <p
            role="alert"
            className="break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4"
          >
            {erro}
          </p>
        )}

        {erroDados && (
          <div
            role="alert"
            className="min-w-0 space-y-3 break-words rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 sm:p-4"
          >
            <p>{erroDados}</p>

            {aoTentarNovamente && (
              <button
                type="button"
                onClick={aoTentarNovamente}
                className="font-semibold underline"
              >
                Tentar carregar novamente
              </button>
            )}
          </div>
        )}

        <section className="space-y-3">
          <h3 className="break-words text-base font-bold text-slate-800 sm:text-lg">
            Dados do candidato
          </h3>

          {carregandoDados && (
            <p role="status" className="text-sm text-blue-600">
              Carregando informações completas...
            </p>
          )}

          <div className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 sm:p-4">
            <Campo titulo="Nome" valor={usuario?.name} />
            <Campo titulo="CPF" valor={usuario?.cpf} />
            <Campo titulo="E-mail" valor={usuario?.email} />

            <Campo
              titulo="Data de nascimento"
              valor={
                dados_formulario?.dt_nascimento
                  ? formatDate(dados_formulario.dt_nascimento)
                  : null
              }
            />

            <Campo
              titulo="Estado civil"
              valor={dados_formulario?.estado_civil}
            />

            <Campo
              titulo="Telefone principal"
              valor={dados_formulario?.telefone_principal}
            />

            <Campo
              titulo="Telefone secundário"
              valor={dados_formulario?.telefone_secundario}
            />

            <Campo
              titulo="Profissão"
              valor={dados_formulario?.profissao}
            />

            <Campo
              titulo="Participou anteriormente?"
              valor={
                dados_formulario?.participacao_anterior === true
                  ? "Sim"
                  : dados_formulario?.participacao_anterior === false
                    ? "Não"
                    : null
              }
            />

            <div className="sm:col-span-2">
              <Campo
                titulo="Informações de saúde declaradas"
                valor={dados_formulario?.problemas_saude}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="break-words text-base font-bold text-slate-800 sm:text-lg">
            Dados da candidatura
          </h3>

          <div className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 sm:p-4">
            <Campo
              titulo="Curso"
              valor={matricula?.turma?.curso?.name}
            />

            <Campo
              titulo="Turno"
              valor={matricula?.turma?.turno}
            />

            <Campo
              titulo="Situação"
              valor={matricula?.status}
            />

            <Campo
              titulo="Data da candidatura"
              valor={
                matricula?.dataHora
                  ? formatDate(matricula.dataHora)
                  : null
              }
            />

            <div className="sm:col-span-2">
              <Campo
                titulo="Interesse em serviços"
                valor={
                  matricula?.interesse_servicos?.join(", ")
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Campo
                titulo="Como soube do curso"
                valor={matricula?.como_soube}
              />
            </div>
          </div>
        </section>
      </div>
    </AppDialog>
  );
}
