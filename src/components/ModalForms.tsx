import type { MatriculaDTO } from "../types/matricula/matricula-types";
import type { IUserDTO } from "../types/user/user-types";

interface IModalForms {
  titulo: string;
  message: string;

  decisao:
  | "APROVADA"
  | "RECUSADA"
  | null;

  opSim?: () => void;
  opNao?: () => void;

  texto?: string;

  dados_formulario: IUserDTO | null;
  matricula: MatriculaDTO | null;
}

export function ModalForms({
  titulo,
  message,
  texto = "Sim",
  decisao,
  opSim,
  opNao,
  dados_formulario,
  matricula,
}: IModalForms) {
  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-100">

        <h1 className="text-xl font-bold text-slate-900 mb-2 text-center">
          {titulo}
        </h1>

        <p className="mb-5 text-slate-600 text-sm text-center">
          {message}
        </p>

        {/* DADOS DO CADASTRO */}
        {dados_formulario ? (
          <div className="mb-5">

            <h2 className="font-semibold text-slate-800 mb-3">
              Dados do candidato
            </h2>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">

              <p>
                <strong>Nome:</strong>{" "}
                {dados_formulario.name}
              </p>

              <p>
                <strong>CPF:</strong>{" "}
                {dados_formulario.cpf}
              </p>

              <p>
                <strong>E-mail:</strong>{" "}
                {dados_formulario.email}
              </p>

              <p>
                <strong>Data de nascimento:</strong>{" "}
                {dados_formulario.dt_nascimento
                  ? new Date(
                    dados_formulario.dt_nascimento
                  ).toLocaleDateString("pt-BR")
                  : "Não informada"}
              </p>

              <p>
                <strong>Estado civil:</strong>{" "}
                {dados_formulario.estado_civil
                  || "Não informado"}
              </p>

              <p>
                <strong>Telefone principal:</strong>{" "}
                {dados_formulario.telefone_principal
                  || "Não informado"}
              </p>

              <p>
                <strong>Telefone secundário:</strong>{" "}
                {dados_formulario.telefone_secundario
                  || "Não informado"}
              </p>

              <p>
                <strong>Profissão:</strong>{" "}
                {dados_formulario.profissao
                  || "Não informada"}
              </p>

              <p>
                <strong>Participou anteriormente:</strong>{" "}
                {dados_formulario.participacao_anterior === true
                  ? "Sim"
                  : dados_formulario.participacao_anterior === false
                    ? "Não"
                    : "Não informado"}
              </p>

              <p className="md:col-span-2">
                <strong>Problemas de saúde:</strong>{" "}
                {dados_formulario.problemas_saude
                  || "Nenhum informado"}
              </p>

            </div>
          </div>
        ) : (
          <div className="mb-5 p-4 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm text-center">
            Carregando dados do candidato...
          </div>
        )}

        {/* DADOS DA CANDIDATURA */}
        {matricula && (
          <div className="mb-5">

            <h2 className="font-semibold text-slate-800 mb-3">
              Dados da candidatura
            </h2>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">

              <p>
                <strong>Curso:</strong>{" "}
                {matricula.turma.curso.name}
              </p>

              <p>
                <strong>Turno:</strong>{" "}
                {matricula.turma.turno}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {matricula.status}
              </p>

              <p>
                <strong>Data da candidatura:</strong>{" "}
                {new Date(
                  matricula.dataHora
                ).toLocaleDateString("pt-BR")}
              </p>

              <p className="md:col-span-2">
                <strong>Interesse em serviços:</strong>{" "}
                {matricula.interesse_servicos.length > 0
                  ? matricula.interesse_servicos.join(", ")
                  : "Nenhum informado"}
              </p>

              <p className="md:col-span-2">
                <strong>Como soube do curso:</strong>{" "}
                {matricula.como_soube
                  || "Não informado"}
              </p>

            </div>
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex gap-3 justify-end w-full mt-4">

          <button
            type="button"
            onClick={opSim}
            className={`px-5 py-2 text-white font-medium rounded-md transition-colors cursor-pointer ${decisao === "RECUSADA"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {texto}
          </button>

          {opNao && (
            <button
              type="button"
              onClick={opNao}
              className="px-5 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Não
            </button>
          )}

        </div>

      </div>
    </div>
  );
}