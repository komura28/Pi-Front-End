import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    titulo: string;
    descricao: string;
    categoria: string;
    icone: LucideIcon;
    acao?: ReactNode;
}

export function PageHeader({
    titulo,
    descricao,
    categoria,
    icone: Icone,
    acao
}: Readonly<PageHeaderProps>) {
    return (
        <section className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-4 text-white shadow-lg sm:p-6 md:p-8">
            <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-2 text-blue-200">
                        <Icone size={20} aria-hidden="true" />

                        <span className="text-sm font-semibold tracking-wide">
                            {categoria}
                        </span>
                    </div>

                    <h1 className="break-words text-2xl font-bold sm:text-3xl">
                        {titulo}
                    </h1>

                    <p className="mt-3 max-w-xl break-words text-sm text-blue-100 sm:text-base">
                        {descricao}
                    </p>
                </div>

                {acao && (
                    <div className="shrink-0">
                        {acao}
                    </div>
                )}
            </div>

            <Icone
                size={190}
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -bottom-14 hidden rotate-[-15deg] text-white/10 lg:block"
            />
        </section>
    );
}