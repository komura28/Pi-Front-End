import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

import type { TurmaMatricula } from "../../types/auth/auth-types";

interface TurmaSelectorProps {
  turmas: TurmaMatricula[];
  selecionadaId: string | null;
  busca: string;
  onBuscaChange: (valor: string) => void;
  onSelecionar: (turma: TurmaMatricula) => void;
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarTurno(turno: string) {
  const turnos: Record<string, string> = {
    MANHA: "Manhã",
    TARDE: "Tarde",
    NOITE: "Noite",
  };

  return turnos[turno] ?? turno;
}

export function TurmaSelector({
  turmas,
  selecionadaId,
  busca,
  onBuscaChange,
  onSelecionar,
}: Readonly<TurmaSelectorProps>) {
  return (
    <aside className="w-full min-w-0 space-y-4">
      <div>
        <h2 className="break-words text-lg font-bold text-slate-800">Turmas</h2>

        <p className="mt-1 break-words text-sm text-slate-500">
          Selecione uma turma para planejar suas aulas.
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          aria-label="Pesquisar turmas"
          placeholder="Buscar curso ou turno..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="max-h-[65vh] min-w-0 space-y-3 overflow-y-auto overscroll-contain pr-1">
        {turmas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
            Nenhuma turma encontrada.
          </p>
        ) : (
          turmas.map((item) => {
            const turma = item.turma;
            const selecionada = selecionadaId === turma._id;

            return (
              <button
                key={turma._id}
                type="button"
                onClick={() => onSelecionar(item)}
                aria-pressed={selecionada}
                className={`w-full min-w-0 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:p-4 ${
                  selecionada
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        selecionada
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <GraduationCap size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-bold text-slate-800">
                        {turma.curso?.name ?? "Curso não informado"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatarTurno(turma.turno)}
                      </p>
                    </div>
                  </div>

                  {selecionada && (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-blue-600"
                    />
                  )}
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                  <div className="flex min-w-0 items-start gap-2 text-xs text-slate-600">
                    <CalendarDays size={15} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      {formatarData(turma.dataInicio)}
                      {" até "}
                      {formatarData(turma.dataFim)}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-start gap-2 text-xs text-slate-600">
                    <Users size={15} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      {turma.capacidade} vagas · {item.vagasDisponiveis}{" "}
                      disponíveis
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
