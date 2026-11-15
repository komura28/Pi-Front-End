
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
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold text-slate-800">
                {nomeCurso}
            </h3>

            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    Frequência
                </span>

                <span className="text-2xl font-bold text-blue-600">
                    {percentual === null
                        ? "—"
                        : `${percentual}%`}
                </span>
            </div>

            {percentual !== null ? (
                <div
                    className="mb-5 h-3 overflow-hidden rounded-full bg-slate-200"
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

            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                <div>
                    <p className="text-xl font-bold text-green-600">
                        {frequencia.presentes}
                    </p>
                    <p className="text-xs text-slate-500">
                        Presenças
                    </p>
                </div>

                <div>
                    <p className="text-xl font-bold text-red-600">
                        {frequencia.faltas}
                    </p>
                    <p className="text-xs text-slate-500">
                        Faltas
                    </p>
                </div>

                <div>
                    <p className="text-xl font-bold text-slate-800">
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
