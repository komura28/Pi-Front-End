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
        <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">

            <div>
                <p className="text-sm font-medium text-slate-500">
                    {titulo}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                    {valor}
                </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
                <Icone size={26} aria-hidden="true" />
            </div>

        </article>
    );
}