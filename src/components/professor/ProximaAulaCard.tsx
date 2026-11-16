import { CalendarDays, Clock3, BookOpen } from "lucide-react";

export interface ProximaAula {
    id: string;
    titulo: string;
    turma: string;
    curso: string;
    dataInicio: string;
    dataFim: string;
}

interface ProximaAulaCardProps {
    aula: ProximaAula | null;
}

export function ProximaAulaCard({
    aula
}: ProximaAulaCardProps) {

    if (!aula) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">
                    Próxima aula
                </h2>

                <p className="mt-4 text-slate-500">
                    Nenhuma aula agendada no momento.
                </p>
            </section>
        );
    }

    const data = new Date(aula.dataInicio);

    const dataFormatada = data.toLocaleDateString("pt-BR");

    const formatarHorario = (valor: string) =>
        new Date(valor).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold text-slate-800">
                Próxima aula
            </h2>

            <div className="rounded-xl bg-[#0F172A] p-6 text-white">

                <div className="mb-5">
                    <div className="mb-2 flex items-center gap-2 text-blue-300">
                        <BookOpen size={18} />
                        <span className="text-sm font-medium">
                            {aula.curso}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold">
                        {aula.titulo}
                    </h3>

                    <p className="mt-2 text-slate-300">
                        {aula.turma}
                    </p>
                </div>

                <div className="grid gap-4 border-t border-slate-700 pt-5 sm:grid-cols-2">

                    <div className="flex items-center gap-3">
                        <CalendarDays
                            size={22}
                            className="text-blue-300"
                        />

                        <div>
                            <p className="text-xs text-slate-400">
                                Data
                            </p>
                            <p className="font-medium">
                                {dataFormatada}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock3
                            size={22}
                            className="text-blue-300"
                        />

                        <div>
                            <p className="text-xs text-slate-400">
                                Horário
                            </p>
                            <p className="font-medium">
                                {formatarHorario(aula.dataInicio)}
                                {" às "}
                                {formatarHorario(aula.dataFim)}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}