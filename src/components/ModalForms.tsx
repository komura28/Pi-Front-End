import type { IUserDTO } from "../types/user/user-types";

interface IModalForms {
  titulo: string;
  message: string;
  decisao: "APROVADA" | "RECUSADA" | null;
  opSim?: () => void;
  opNao?: () => void;
  texto?: string;
  dados_formulario: IUserDTO | null;
}

export function ModalForms({
  titulo,
  message,
  texto = "Sim",
  decisao,
  opSim,
  opNao,
  dados_formulario,
}: IModalForms) {
  // Log para inspecionar no Console (F12) o objeto que está chegando
  console.log("Dados do formulário recebidos no Modal:", dados_formulario);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center border border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 mb-2 text-center">
          {titulo}
        </h1>

        <p className="mb-4 text-slate-600 text-sm text-center whitespace-pre-line">
          {message}
        </p>

        {/* Bloco dos Dados do Formulário */}
        {dados_formulario ? (
          <div className="w-full my-2 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 flex flex-col gap-2 text-left">
            <p>
              <strong>Nome:</strong>{" "}
              {dados_formulario.name || (dados_formulario as any).name || "Não informado"}
            </p>
            <p>
              <strong>Data de Nascimento:</strong>{" "}
              {dados_formulario.dt_nascimento
                ? new Date(dados_formulario.dt_nascimento).toLocaleDateString("pt-BR")
                : (dados_formulario as any).dt_nascimento
                ? new Date((dados_formulario as any).dt_nascimento).toLocaleDateString("pt-BR")
                : "Não informada"}
            </p>
            <p>
              <strong>Telefone:</strong>{" "}
              {dados_formulario.telefone_principal || (dados_formulario as any).telefone_principal || "Não informado"}
            </p>
            <p>
              <strong>Profissão:</strong>{" "}
              {dados_formulario.profissao || "Não informada"}
            </p>
            <p>
              <strong>Problemas de Saúde:</strong>{" "}
              {dados_formulario.problemas_saude || "Nenhum informado"}
            </p>
          </div>
        ) : (
          <div className="w-full my-2 p-4 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm text-center">
            Nenhum dado de formulário/usuário selecionado.
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-center w-full mt-4">
          <button
            onClick={opSim}
            className={`px-5 py-2 text-white font-medium rounded-md transition-colors cursor-pointer ${
              decisao === "RECUSADA"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {texto}
          </button>

          {opNao && (
            <button
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