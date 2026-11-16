import { useEffect, useRef } from "react";
import {
    Clock3,
    CalendarDays,
    Users,
    BookOpen
} from "lucide-react";

import type {
    AulaTurmaProfessor,
    StatusAula
} from "../../types/professor/professor-types";

interface AulaDetalhesModalProps {
    aula: AulaTurmaProfessor;
    onClose: () => void;
}

const coresStatus: Record<StatusAula, string> = {
    AGENDADA: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    REALIZADA: "bg-blue-100 text-blue-700",
    CANCELADA: "bg-red-100 text-red-700"
};

function formatarDataHora(valor?: string | null) {
    if (!valor) return "A definir";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function AulaDetalhesModal({
    aula,
    onClose
}: AulaDetalhesModalProps) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (!dialog.open) {
            dialog.showModal();
        }

        return () => {
            if (dialog.open) {
                dialog.close();
            }
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            aria-labelledby="titulo-detalhes-aula"
            className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 open:flex open:flex-col"
        >
            <header className="shrink-0 bg-[#0F172A] p-6 text-white">

                <div className="mb-4 flex items-center justify-between gap-3">

                    <span className="text-sm font-semibold text-blue-300">
                        DETALHES DA AULA
                    </span>

                </div>

                <h2
                    id="titulo-detalhes-aula"
                    className="text-2xl font-bold"
                >
                    {aula.aula?.titulo ?? "Aula sem título"}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-3">

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${coresStatus[aula.status]}`}
                    >
                        {aula.status}
                    </span>

                    <span className="text-sm text-slate-300">
                        {aula.turma?.curso?.name ??
                            "Curso não informado"}
                    </span>

                </div>
            </header>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">

                <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users size={18} />
                            Turma
                        </div>

                        <p className="mt-2 font-semibold text-slate-800">
                            {aula.turma?.turno ?? "Não informada"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 size={18} />
                            Duração
                        </div>

                        <p className="mt-2 font-semibold text-slate-800">
                            {aula.aula?.duracao != null
                                ? `${aula.aula.duracao} minutos`
                                : "Não informada"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={18} />
                            Início
                        </div>

                        <p className="mt-2 font-semibold text-slate-800">
                            {formatarDataHora(aula.dataInicio)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={18} />
                            Término
                        </div>

                        <p className="mt-2 font-semibold text-slate-800">
                            {formatarDataHora(aula.dataFim)}
                        </p>
                    </div>

                </div>

                <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <BookOpen
                            size={20}
                            className="text-blue-600"
                        />
                        Descrição da aula
                    </h3>

                    <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
                        {aula.aula?.descricao ||
                            "Nenhuma descrição cadastrada para esta aula."}
                    </p>
                </section>

                <div className="flex justify-end border-t border-slate-200 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Fechar
                    </button>
                </div>

            </div>
        </dialog>
    );
}