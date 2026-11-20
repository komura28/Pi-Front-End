import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AppDialogProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  children: ReactNode;
  rodape?: ReactNode;
  tamanho?: "md" | "lg";
  salvando?: boolean;
}

export function AppDialog({
  aberto,
  titulo,
  descricao,
  icone: Icone,
  children,
  rodape,
  tamanho = "md",
  salvando = false,
}: Readonly<AppDialogProps>) {
  return (
    <Dialog.Root open={aberto}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[5000] bg-slate-950/60 backdrop-blur-sm" />

        <Dialog.Content
          aria-busy={salvando}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className={`fixed left-1/2 top-1/2 z-[5001] flex max-h-[90dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none ${
            tamanho === "lg" ? "max-w-2xl" : "max-w-lg"
          }`}
        >
          <div className="shrink-0 bg-gradient-to-r from-[#0F172A] to-blue-800 p-4 sm:p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Icone size={23} className="text-blue-200" />
              </div>

              <div className="min-w-0">
                <Dialog.Title className="text-xl font-bold">
                  {titulo}
                </Dialog.Title>

                <Dialog.Description className="mt-1 text-sm text-blue-100">
                  {descricao}
                </Dialog.Description>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {children}
          </div>

          {rodape && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
              {rodape}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
