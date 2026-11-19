
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
    erro
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
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={aoConfirmar}
                        disabled={carregando}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        <Trash2 size={17} />
                        {carregando ? "Processando..." : textoConfirmar}
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-600">
                    Confirme a operação para continuar.
                </p>

                {nomeRegistro && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                            {nomeRegistro}
                        </p>
                    </div>
                )}

                {erro && (
                    <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {erro}
                    </p>
                )}
            </div>
        </AppDialog>
    );
}
