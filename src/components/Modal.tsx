
interface IModal {
    titulo: string;
    message: string;
    decisao: "APROVADA" | "RECUSADA" | null;
    opSim?: () => void;
    opNao?: () => void;
    texto?: string;
}


export function Modal({
    titulo,
    message,
    texto,
    opSim,
    opNao
}: IModal) {
    return (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
            <div className="my-auto flex w-full min-w-0 max-w-md flex-col items-center rounded-lg bg-white p-4 shadow-xl sm:p-6">
                <h1 className="mb-4 break-words text-center text-lg font-semibold text-slate-900 sm:text-xl">
                    {titulo}
                </h1>
                <p className="mb-6 w-full min-w-0 break-words whitespace-pre-line text-center text-sm leading-relaxed text-slate-600 sm:text-base">
                    {message}
                </p>
                <div className="flex w-full flex-col-reverse justify-center gap-3 sm:flex-row">
                    <button onClick={opSim}
                        className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 sm:w-auto"
                    >
                        {texto}</button>
                    {opNao &&
                        <button onClick={opNao}
                            className="w-full rounded-md bg-slate-200 px-4 py-2 font-medium text-slate-800 transition-colors hover:bg-slate-300 sm:w-auto"
                        >
                            Não</button>
                    }
                </div>
            </div>

        </div>
    )
}