import type { LucideIcon } from "lucide-react";

interface ProfessorStatCardProps {
    titulo: string;
    valor: number | string;
    icone: LucideIcon;
}

export function ProfessorStatCard({
    titulo,
    valor,
    icone: Icone
}: ProfessorStatCardProps) {

    return (
        <article className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">

            <div className="min-w-0">
                <p className="break-words text-xs font-medium text-slate-500 sm:text-sm">
                    {titulo}
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold text-slate-800 sm:text-3xl">
                    {valor}
                </h2>
            </div>

            <div className="shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600 sm:p-4">
                <Icone size={26} aria-hidden="true" />
            </div>

        </article>
    );
}