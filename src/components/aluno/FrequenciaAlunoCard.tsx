
import type {
    FrequenciaAlunoDashboard
} from "../../types/matricula/matricula-types";

interface FrequenciaAlunoCardProps {
    frequencia: FrequenciaAlunoDashboard;
    nomeCurso: string;
}

export function FrequenciaAlunoCard({
    frequencia,
    nomeCurso
}: Readonly<FrequenciaAlunoCardProps>) {

    const percentual = frequencia.frequenciaPercentual;

    return (
        <article className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            <h3 className="mb-4 wrap-break-words text-base font-semibold text-slate-800 sm:text-lg">
                {nomeCurso}
            </h3>

            <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm text-slate-500">
                    Frequência
                </span>

                <span className="shrink-0 text-xl font-bold text-blue-600 sm:text-2xl">
                    {percentual === null
                        ? "—"
                        : `${percentual}%`}
                </span>
            </div>

            {percentual !== null ? (
                <div
                    className="mb-5 h-3 w-full overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-label={`Frequência em ${nomeCurso}`}
                    aria-valuenow={percentual}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${percentual}%` }}
                    />
                </div>
            ) : (
                <p className="mb-5 text-sm text-slate-500">
                    Ainda não há aulas contabilizadas.
                </p>
            )}

            <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-4 text-center sm:gap-3">
                <div className="min-w-0">
                    <p className="text-lg font-bold text-green-600 sm:text-xl">
                        {frequencia.presentes}
                    </p>
                    <p className="text-xs text-slate-500">
                        Presenças
                    </p>
                </div>

                <div className="min-w-0">
                    <p className="text-lg font-bold text-red-600 sm:text-xl">
                        {frequencia.faltas}
                    </p>
                    <p className="text-xs text-slate-500">
                        Faltas
                    </p>
                </div>

                <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-800 sm:text-xl">
                        {frequencia.aulasContabilizadas}
                    </p>
                    <p className="text-xs text-slate-500">
                        Aulas
                    </p>
                </div>
            </div>
        </article>
    );
}
