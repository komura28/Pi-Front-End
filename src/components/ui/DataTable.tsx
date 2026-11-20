import type { ReactNode } from "react";
import {
    TableActionMenu,
    type TableAction
} from "./TableActionMenu";

export interface TableColumn<T> {
    id: string;
    titulo: string;
    renderizar: (item: T) => ReactNode;
    alinhamento?: "esquerda" | "centro" | "direita";
}

interface DataTableProps<T> {
    dados: T[];
    colunas: TableColumn<T>[];
    chave: (item: T) => string;
    acoes?: (item: T) => TableAction[];
    rotuloAcoes?: (item: T) => string;
    mensagemVazia?: string;
}

function classeAlinhamento(
    alinhamento?: TableColumn<unknown>["alinhamento"]
) {
    if (alinhamento === "direita") return "text-right";
    if (alinhamento === "centro") return "text-center";
    return "text-left";
}

export function DataTable<T>({
    dados,
    colunas,
    chave,
    acoes,
    rotuloAcoes,
    mensagemVazia = "Nenhum registro encontrado."
}: Readonly<DataTableProps<T>>) {
    return (
        <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200">
            <table className="w-full min-w-[740px] text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        {colunas.map((coluna) => (
                            <th
                                key={coluna.id}
                                scope="col"
                                className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5 sm:py-4 ${classeAlinhamento(coluna.alinhamento)}`}
                            >
                                {coluna.titulo}
                            </th>
                        ))}

                        {acoes && (
                            <th
                                scope="col"
                                className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5 sm:py-4"
                            >
                                Ações
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                    {dados.length === 0 ? (
                        <tr>
                            <td
                                colSpan={colunas.length + (acoes ? 1 : 0)}
                                className="px-5 py-12 text-center text-slate-500"
                            >
                                {mensagemVazia}
                            </td>
                        </tr>
                    ) : (
                        dados.map((item) => (
                            <tr
                                key={chave(item)}
                                className="transition-colors hover:bg-blue-50/50"
                            >
                                {colunas.map((coluna) => (
                                    <td
                                        key={coluna.id}
                                        className={`px-4 py-3 text-slate-600 sm:px-5 sm:py-4 ${classeAlinhamento(coluna.alinhamento)}`}
                                    >
                                        {coluna.renderizar(item)}
                                    </td>
                                ))}

                                {acoes && (
                                    <td className="px-4 py-3 text-right sm:px-5">
                                        <TableActionMenu
                                            acoes={acoes(item)}
                                            rotulo={rotuloAcoes?.(item)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}