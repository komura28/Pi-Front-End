
import {
    BookOpen,
    CalendarClock,
    Clock3,
    Save,
    UserRound
} from "lucide-react";

import { AppDialog } from "../ui/AppDialog";

import type {
    AulaTurma,
    Professor
} from "../../types/auth/auth-types";

interface AgendarAulaDialogProps {
    aula: AulaTurma | null;
    curso: string;
    turno: string;
    materia: string;
    professores: Professor[];

    inicio: string;
    professorId: string;
    terminoPrevisto: string | null;

    salvando: boolean;
    erro: string;

    onInicioChange: (valor: string) => void;
    onProfessorChange: (valor: string) => void;
    onCancelar: () => void;
    onSalvar: () => void;
}

export function AgendarAulaDialog({
    aula,
    curso,
    turno,
    materia,
    professores,
    inicio,
    professorId,
    terminoPrevisto,
    salvando,
    erro,
    onInicioChange,
    onProfessorChange,
    onCancelar,
    onSalvar
}: Readonly<AgendarAulaDialogProps>) {
    const edicao = aula?.status === "AGENDADA";

    return (
        <AppDialog
            aberto={Boolean(aula)}
            aoFechar={onCancelar}
            titulo={edicao ? "Editar agendamento" : "Agendar aula"}
            descricao="Defina a data, o horário e o professor responsável."
            icone={CalendarClock}
            tamanho="lg"
            salvando={salvando}
            rodape={
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={salvando}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="form-agendar-aula"
                        disabled={
                            salvando ||
                            !inicio ||
                            !professorId ||
                            !aula?.aula
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={17} />
                        {salvando
                            ? "Salvando..."
                            : edicao
                                ? "Salvar alterações"
                                : "Salvar agendamento"}
                    </button>
                </div>
            }
        >
            {aula && (
                <form
                    id="form-agendar-aula"
                    onSubmit={(evento) => {
                        evento.preventDefault();
                        onSalvar();
                    }}
                    className="space-y-6"
                >
                    {/* IDENTIFICAÇÃO DA AULA */}
                    <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                                <BookOpen size={21} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Aula selecionada
                                </p>

                                <h3 className="mt-1 text-lg font-bold text-slate-800">
                                    {aula.aula?.titulo ?? "Aula não encontrada"}
                                </h3>

                                <p className="mt-2 text-sm text-slate-600">
                                    {materia}
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    {curso} · {turno}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700">
                                    <Clock3 size={15} />
                                    {aula.aula?.duracao ?? 0} minutos
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* DATA E HORÁRIO */}
                    <div className="space-y-2">
                        <label
                            htmlFor="agendamento-inicio"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            Data e horário de início *
                        </label>

                        <div className="relative">
                            <CalendarClock
                                size={19}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="agendamento-inicio"
                                type="datetime-local"
                                min="1900-01-01T00:00"
                                max="2100-12-31T23:59"
                                required
                                value={inicio}
                                onChange={(evento) =>
                                    onInicioChange(evento.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            O horário deve estar dentro do período da turma.
                        </p>
                    </div>

                    {/* PROFESSOR */}
                    <div className="space-y-2">
                        <label
                            htmlFor="agendamento-professor"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            Professor responsável *
                        </label>

                        <div className="relative">
                            <UserRound
                                size={19}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <select
                                id="agendamento-professor"
                                required
                                value={professorId}
                                onChange={(evento) =>
                                    onProfessorChange(evento.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Selecione um professor
                                </option>

                                {professores.map((professor) => (
                                    <option
                                        key={professor._id}
                                        value={professor._id}
                                    >
                                        {professor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-xs text-slate-500">
                            A disponibilidade será verificada ao salvar.
                        </p>
                    </div>

                    {/* TÉRMINO PREVISTO */}
                    <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2.5 text-blue-600">
                                <Clock3 size={20} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Término previsto
                                </p>

                                <p className="mt-1 font-bold text-slate-800">
                                    {terminoPrevisto ??
                                        "Informe uma data e horário válidos"}
                                </p>
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                            Calculado automaticamente de acordo com a
                            duração cadastrada para esta aula.
                        </p>
                    </section>

                    {erro && (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            {erro}
                        </p>
                    )}
                </form>
            )}
        </AppDialog>
    );
}
