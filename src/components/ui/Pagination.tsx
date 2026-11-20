
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    paginaAtual: number;
    totalItens: number;
    itensPorPagina: number;
    onPageChange: (pagina: number) => void;
}

export function Pagination({
    paginaAtual,
    totalItens,
    itensPorPagina,
    onPageChange
}: Readonly<PaginationProps>) {

    const totalPaginas = Math.max(
        1,
        Math.ceil(totalItens / itensPorPagina)
    );

    const pagina = Math.min(
        Math.max(paginaAtual, 1),
        totalPaginas
    );

    const inicio = totalItens === 0
        ? 0
        : (pagina - 1) * itensPorPagina + 1;

    const fim = Math.min(
        pagina * itensPorPagina,
        totalItens
    );

    const temAnterior = pagina > 1;
    const temProxima = pagina < totalPaginas;

    return (
        <nav
            aria-label="Paginação"
            className="flex w-full min-w-0 flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap"
        >
            <p className="text-center text-sm text-slate-500 sm:text-left">
                Exibindo {inicio}–{fim} de {totalItens} registros
            </p>

            <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:gap-3">
                <button
                    type="button"
                    disabled={!temAnterior}
                    onClick={() => onPageChange(pagina - 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                    Anterior
                </button>

                <span className="text-sm font-medium text-slate-700">
                    {pagina} de {totalPaginas}
                </span>

                <button
                    type="button"
                    disabled={!temProxima}
                    onClick={() => onPageChange(pagina + 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Próxima
                    <ChevronRight size={16} />
                </button>
            </div>
        </nav>
    );
}
