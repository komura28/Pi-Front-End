import { Trash2, TriangleAlert } from "lucide-react";
import { AppDialog } from "./AppDialog";

interface ConfirmDialogProps {
  aberto: boolean;
  aoFechar: () => void;
  aoConfirmar: () => void;
  titulo: string;
  descricao: string;
  nomeRegistro?: string;
  textoConfirmar?: string;
  carregando?: boolean;
  erro?: string;
}

export function ConfirmDialog({
  aberto,
  aoFechar,
  aoConfirmar,
  titulo,
  descricao,
  nomeRegistro,
  textoConfirmar = "Excluir",
  carregando = false,
  erro,
}: Readonly<ConfirmDialogProps>) {
  return (
    <AppDialog
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={titulo}
      descricao={descricao}
      icone={TriangleAlert}
      salvando={carregando}
      rodape={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={aoFechar}
            disabled={carregando}
            className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={aoConfirmar}
            disabled={carregando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:w-auto"
          >
            <Trash2 size={17} />
            {carregando ? "Processando..." : textoConfirmar}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="break-words text-sm text-slate-600">
          Confirme a operação para continuar.
        </p>

        {nomeRegistro && (
          <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="break-words text-sm font-semibold text-slate-800">
              {nomeRegistro}
            </p>
          </div>
        )}

        {erro && (
          <p
            role="alert"
            className="break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </p>
        )}
      </div>
    </AppDialog>
  );
}
