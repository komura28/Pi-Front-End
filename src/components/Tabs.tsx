

type TabType = "geral" | "matriculas" | "inativos";

interface TabsProps {
    tab: TabType;
    setTab: React.Dispatch<React.SetStateAction<TabType>>;
}


export function Tabs({ tab, setTab }: TabsProps) {
    return (
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
            <button
                onClick={() => setTab("geral")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer
border border-transparent
hover:border-slate-400 hover:bg-white hover:shadow-md
hover:scale-[1.03] active:scale-95 ${tab === "geral"
                        ? "bg-white text-blue-600 shadow"
                        : "text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600 hover:scale-[1.03]"
                    }`}
            >
                Visão Geral
            </button>

            <button
                onClick={() => setTab("matriculas")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer
border border-transparent
hover:border-slate-400 hover:bg-white hover:shadow-md
hover:scale-[1.03] active:scale-95 ${tab === "matriculas"
                        ? "bg-white text-blue-600 shadow"
                        : "text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600 hover:scale-[1.03]"
                    }`}
            >
                Matrículas
            </button>

            <button
                onClick={() => setTab("inativos")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer
border border-transparent
hover:border-slate-400 hover:bg-white hover:shadow-md
hover:scale-[1.03] active:scale-95 ${tab === "inativos"
                        ? "bg-white text-blue-600 shadow"
                        : "text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600 hover:scale-[1.03]"
                    }`}
            >
                Inativos
            </button>
        </div>
    );
}