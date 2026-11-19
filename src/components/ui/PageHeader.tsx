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
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-6 text-white shadow-lg md:p-8">
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-blue-200">
                        <Icone size={20} aria-hidden="true" />

                        <span className="text-sm font-semibold tracking-wide">
                            {categoria}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold">
                        {titulo}
                    </h1>

                    <p className="mt-3 max-w-xl text-blue-100">
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