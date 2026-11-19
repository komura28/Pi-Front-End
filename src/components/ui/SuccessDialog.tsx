import { CheckCircle2 } from "lucide-react";
import { AppDialog } from "./AppDialog";

interface SuccessDialogProps {
    aberto: boolean;
    aoFechar: () => void;
    titulo: string;
    mensagem: string;
}

export function SuccessDialog({
    aberto,
    aoFechar,
    titulo,
    mensagem
}: Readonly<SuccessDialogProps>) {
    return (
        <AppDialog
            aberto={aberto}
            aoFechar={aoFechar}
            titulo={titulo}
            descricao="Operação concluída com sucesso."
            icone={CheckCircle2}
            rodape={
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={aoFechar}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Entendi
                    </button>
                </div>
            }
        >
            <div
                role="status"
                className="flex flex-col items-center gap-4 py-4 text-center"
            >
                <div className="rounded-full bg-green-50 p-4">
                    <CheckCircle2
                        size={44}
                        className="text-green-600"
                        aria-hidden="true"
                    />
                </div>

                <p className="max-w-sm text-sm leading-relaxed text-slate-600">
                    {mensagem}
                </p>
            </div>
        </AppDialog>
    );
}