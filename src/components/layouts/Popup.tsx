


interface IPopUp {
    decisao: "APROVADA" | "RECUSADA";
    opSim: () => void;
    opNao: () => void;
}

export function PopUp({decisao, opSim, opNao}: IPopUp) {
    return (
        <div>
            <h2>PopUp</h2>
            <p>Você tem certeza que deseja {decisao === "APROVADA" ? "aprovar" : "recusar"} esta matrícula?</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={opSim}>
                Sim
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={opNao}>
                Não
            </button>
        </div>
    )
}