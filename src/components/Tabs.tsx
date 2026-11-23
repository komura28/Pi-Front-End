

type TabType = "geral" | "matriculas" | "inativos";

interface TabsProps {
    tab: TabType;
    setTab: React.Dispatch<React.SetStateAction<TabType>>;
}


export function Tabs({ tab, setTab }: TabsProps) {
    return (
        <div className="mb-6 flex w-full min-w-0 flex-wrap gap-1 rounded-xl bg-slate-100 p-1 sm:w-fit sm:gap-2">
            <button
                onClick={() => setTab("geral")}
                aria-pressed={tab === "geral"}
                className={`min-w-0 flex-1 whitespace-nowrap rounded-lg border border-transparent px-2 py-2 text-xs font-medium transition-all duration-200 cursor-pointer hover:border-slate-400 hover:bg-white hover:shadow-md hover:text-blue-600 active:scale-95 sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
    tab === "geral"
        ? "bg-white text-blue-600 shadow"
        : "text-slate-600"
}`}
            >
                Visão Geral
            </button>

            <button
                onClick={() => setTab("matriculas")}
                aria-pressed={tab === "matriculas"}
                className={`min-w-0 flex-1 whitespace-nowrap rounded-lg border border-transparent px-2 py-2 text-xs font-medium transition-all duration-200 cursor-pointer hover:border-slate-400 hover:bg-white hover:shadow-md hover:text-blue-600 active:scale-95 sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
    tab === "matriculas"
        ? "bg-white text-blue-600 shadow"
        : "text-slate-600"
}`}
            >
                Matrículas
            </button>

            <button
                onClick={() => setTab("inativos")}
                aria-pressed={tab === "inativos"}
                className={`min-w-0 flex-1 whitespace-nowrap rounded-lg border border-transparent px-2 py-2 text-xs font-medium transition-all duration-200 cursor-pointer hover:border-slate-400 hover:bg-white hover:shadow-md hover:text-blue-600 active:scale-95 sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
    tab === "inativos"
        ? "bg-white text-blue-600 shadow"
        : "text-slate-600"
}`}
            >
                Inativos
            </button>
        </div>
    );
}