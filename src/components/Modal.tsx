
interface IModal {
    titulo: string;
    message: string;
    decisao: "APROVADA" | "RECUSADA" | null;
    opSim?: () => void;
    opNao?: () => void;
    texto?: string;
}


export function Modal({titulo, message, texto, decisao, opSim, opNao}: IModal) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col items-center">
            <h1 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                {titulo}
            </h1>
            <p className="mb-6">
                {message}
            </p>
            <div className="flex gap-3 justify-center w-full">
            <button onClick={opSim}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                    >
                    {texto}</button>
            {opNao &&
            <button onClick={opNao}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors cursor-pointer"
                    >
                    Não</button>
}
            </div>
            </div>

        </div>
    )
}