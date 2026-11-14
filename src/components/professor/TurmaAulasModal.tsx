import { useEffect, useRef } from "react";
import {
    BookOpen,
    CalendarDays
} from "lucide-react";

import type {
    AulaTurmaProfessor,
    StatusAula
} from "../../types/professor/professor-types";
import { useAgora } from "../../hooks/useAgora";
import { mensagemDisponibilidadeChamada, podeAcessarChamada } from "../../utils/professor/chamadaDisponibilidade";

interface TurmaAulasModalProps {
    turma: {
        id: string;
        curso: string;
        turno: string;
    };

    aulas: AulaTurmaProfessor[];
    onClose: () => void;
    onVerDetalhes: (aula: AulaTurmaProfessor) => void;
    onRealizarChamada: (aula: AulaTurmaProfessor) => void;
}

const coresStatus: Record<StatusAula, string> = {
    AGENDADA: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    REALIZADA: "bg-blue-100 text-blue-700",
    CANCELADA: "bg-red-100 text-red-700"
};

function formatarData(valor?: string | null) {
    if (!valor) return "Data a definir";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function TurmaAulasModal({
    turma,
    aulas,
    onClose,
    onVerDetalhes,
    onRealizarChamada
}: TurmaAulasModalProps) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    const agora = useAgora();

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

    const aulasDaTurma = aulas
        .filter((item) => item.turma?._id === turma.id)
        .sort((a, b) => {
            const inicioA = a.dataInicio
                ? new Date(a.dataInicio).getTime()
                : Infinity;

            const inicioB = b.dataInicio
                ? new Date(b.dataInicio).getTime()
                : Infinity;

            return inicioA - inicioB;
        });

    return (
        <dialog
            ref={dialogRef}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            aria-labelledby="titulo-aulas-turma"
            className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 open:flex open:flex-col"
        >

            <header className="shrink-0 bg-gradient-to-r from-[#0F172A] to-blue-800 p-6 text-white">

                <div className="flex items-start justify-between gap-4">

                    <div>
                        <span className="text-sm font-semibold text-blue-200">
                            MINHAS TURMAS
                        </span>

                        <h2
                            id="titulo-aulas-turma"
                            className="mt-2 text-2xl font-bold"
                        >
                            Aulas da Turma
                        </h2>

                        <p className="mt-2 text-sm text-blue-100">
                            {turma.curso} — {turma.turno}
                        </p>
                    </div>

                </div>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-6">

                <h3 className="mb-4 font-semibold text-slate-800">
                    {aulasDaTurma.length} aulas vinculadas
                </h3>

                {aulasDaTurma.map((item) => (
                    <article
                        key={item._id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-blue-50"
                    >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">
                                    <BookOpen
                                        size={18}
                                        className="shrink-0 text-blue-600"
                                    />

                                    <h4 className="font-bold text-slate-800">
                                        {item.aula?.titulo ?? "Aula sem título"}
                                    </h4>
                                </div>

                                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                    <CalendarDays size={16} />

                                    {formatarData(item.dataInicio)}
                                </p>

                                <span
                                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${coresStatus[item.status]}`}
                                >
                                    {item.status}
                                </span>

                            </div>

                            <div className="flex shrink-0 flex-col gap-2">

                                <button
                                    type="button"
                                    onClick={() => onVerDetalhes(item)}
                                    className="cursor-pointer rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                                >
                                    Ver detalhes
                                </button>

                                {podeAcessarChamada(item, agora) ? (
                                    <button
                                        type="button"
                                        onClick={() => onRealizarChamada(item)}
                                        className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        {item.status === "REALIZADA"
                                            ? "Consultar chamada"
                                            : "Realizar chamada"}
                                    </button>
                                ) : item.status === "AGENDADA" ? (
                                    <p className="max-w-56 text-sm text-amber-700">
                                        {mensagemDisponibilidadeChamada(item)}
                                    </p>
                                ) : null}
                            </div>

                        </div>
                    </article>
                ))}

            </div>

            <footer className="shrink-0 border-t border-slate-200 bg-white p-4">

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                        Fechar
                    </button>
                </div>

            </footer>

        </dialog>
    );
}