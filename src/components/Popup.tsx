interface IPopUp {
  decisao: "APROVADA" | "RECUSADA";
  opSim: () => void;
  opNao: () => void;
}

export function PopUp({ decisao, opSim, opNao }: IPopUp) {
  return (
    <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-4 shadow-xl sm:p-6">
      <h2 className="mb-3 break-words text-lg font-bold text-slate-800 sm:text-xl">
        Confirmar decisão
      </h2>
      <p className="mb-6 break-words text-sm leading-relaxed text-slate-600 sm:text-base">
        Você tem certeza que deseja{" "}
        <strong className="font-semibold text-slate-800">
          {decisao === "APROVADA" ? "aprovar" : "recusar"}
        </strong>{" "}
        esta matrícula?
      </p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={opNao}
          className="w-full rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 sm:w-auto"
        >
          Não
        </button>

        <button
          type="button"
          onClick={opSim}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition sm:w-auto ${
            decisao === "APROVADA"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Sim, {decisao === "APROVADA" ? "aprovar" : "recusar"}
        </button>
      </div>
    </div>
  );
}
