import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { LucideIcon } from "lucide-react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

export interface TableAction {
    texto: string;
    icone: LucideIcon;
    executar: () => void;
    perigosa?: boolean;
    disabled?: boolean;
}

interface TableActionMenuProps {
    acoes: TableAction[];
    rotulo?: string;
}

export function TableActionMenu({
    acoes,
    rotulo = "Ações do registro"
}: Readonly<TableActionMenuProps>) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label={rotulo}
                    title={rotulo}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <HiEllipsisHorizontal size={19} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    collisionPadding={8}
                    className="z-[100] min-w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl outline-none"
                >
                    {acoes.map((acao) => {
                        const Icone = acao.icone;

                        return (
                            <DropdownMenu.Item
                                key={acao.texto}
                                disabled={acao.disabled}
                                onSelect={acao.executar}
                                className={`flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-40 ${
                                    acao.perigosa
                                        ? "text-red-600 data-[highlighted]:bg-red-50"
                                        : "text-slate-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700"
                                }`}
                            >
                                <Icone size={17} />
                                <span>{acao.texto}</span>
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}