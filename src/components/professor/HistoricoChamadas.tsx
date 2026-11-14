import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ClipboardCheck,
    CalendarDays,
    CheckCircle2,
    XCircle
} from "lucide-react";

import { getHistoricoChamadasDaTurma } from
    "../../services/chamadaService";

import type { HistoricoChamada } from
    "../../types/professor/chamada-types";

import type { StatusAula } from
    "../../types/professor/professor-types";

interface HistoricoChamadasProps {
    turmaId: string;
}

type FiltroHistorico = StatusAula | "TODAS";

const filtros: {
    label: string;
    valor: FiltroHistorico;
}[] = [
    { label: "Todas", valor: "TODAS" },
    { label: "Finalizadas", valor: "REALIZADA" },
    { label: "Não finalizadas", valor: "AGENDADA" },
    { label: "Canceladas", valor: "CANCELADA" }
];

function formatarData(valor: string | null) {
    if (!valor) return "Data não informada";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return "Data inválida";
    }

    return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function HistoricoChamadas({
    turmaId
}: HistoricoChamadasProps) {

    const [historico, setHistorico] =
        useState<HistoricoChamada[]>([]);

    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const [filtro, setFiltro] =
        useState<FiltroHistorico>("TODAS");

    useEffect(() => {
        let ativo = true;

        async function carregarHistorico() {
            setLoading(true);
            setErro("");

            try {
                const dados =
                    await getHistoricoChamadasDaTurma(turmaId);

                if (ativo) {
                    setHistorico(dados);
                }
            } catch {
                if (ativo) {
                    setErro(
                        "Não foi possível carregar o histórico."
                    );
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        void carregarHistorico();

        return () => {
            ativo = false;
        };
    }, [turmaId]);

    const chamadasFiltradas = historico.filter(
        (item) =>
            filtro === "TODAS" || item.status === filtro
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

                <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <ClipboardCheck
                            size={22}
                            className="text-blue-600"
                        />
                        Histórico de Chamadas
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Consulte as chamadas registradas
                        nas suas aulas desta turma.
                    </p>
                </div>

                {!loading && !erro && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {historico.length} chamadas
                    </span>
                )}
            </div>

            {loading ? (
                <p className="text-slate-500">
                    Carregando histórico...
                </p>
            ) : erro ? (
                <p role="alert" className="text-red-600">
                    {erro}
                </p>
            ) : historico.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                    Nenhuma chamada registrada nesta turma.
                </p>
            ) : (
                <>
                    <div className="mb-6 flex flex-wrap gap-2">
                        {filtros.map((opcao) => (
                            <button
                                key={opcao.valor}
                                type="button"
                                aria-pressed={
                                    filtro === opcao.valor
                                }
                                onClick={() =>
                                    setFiltro(opcao.valor)
                                }
                                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                    filtro === opcao.valor
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                                }`}
                            >
                                {opcao.label}
                            </button>
                        ))}
                    </div>

                    {chamadasFiltradas.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                            Nenhuma chamada encontrada para este filtro.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {chamadasFiltradas.map((item) => (
                                <article
                                    key={item.aulaTurmaId}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                {item.titulo}
                                            </h3>

                                            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                                <CalendarDays size={16} />
                                                {formatarData(item.dataInicio)}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status === "REALIZADA"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "AGENDADA"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-200 pt-4">

                                        <p className="flex items-center gap-2 text-sm font-medium text-green-700">
                                            <CheckCircle2 size={18} />
                                            {item.presentes} presentes
                                        </p>

                                        <p className="flex items-center gap-2 text-sm font-medium text-red-700">
                                            <XCircle size={18} />
                                            {item.faltas} faltas
                                        </p>
                                    </div>

                                    {item.observacao && (
                                        <div className="mt-4 rounded-lg bg-white p-4">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Observação
                                            </p>

                                            <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                                                {item.observacao}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">

                                        <p className="text-xs text-slate-500">
                                            Última atualização:{" "}
                                            {formatarData(item.atualizadaEm)}
                                        </p>

                                        <Link
                                            to={`/professor/aulas/${item.aulaTurmaId}/chamada`}
                                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                        >
                                            <ClipboardCheck size={17} />
                                            Consultar chamada
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}