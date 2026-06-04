
import { solicitarMatricula } from "../services/matriculaService";
import type { authTurma } from "../types/auth/auth-types";


type CardProps = {
    turma: authTurma;
}

export function Card({ turma }: CardProps) {

    const dataInicio = new Date(turma.dataInicio).toLocaleDateString("pt-BR");
    const dataFim = new Date(turma.dataFim).toLocaleDateString("pt-BR");
    const handleCandidatar = async () => {
        try {
            await solicitarMatricula({ turma: turma._id });
            alert("Candidatura enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao candidatar-se à turma:", error);
            alert("Erro ao enviar candidatura. Por favor, tente novamente.");
        }
    }

    return (
        <div className="max-w-md">
            <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                    Turma {new Date(turma.dataInicio).getMonth()}/{new Date(turma.dataInicio).getFullYear()}
                </h2>

                <div className="mb-4 space-y-2 text-gray-600">
                    <p>
                        <span className="font-medium">Curso:</span>{" "}
                        {turma.curso.name}
                    </p>

                    <p>
                        <span className="font-medium">Datas:</span>{" "}
                        {dataInicio} - {dataFim}
                    </p>

                    <p>
                        <span className="font-medium">Vagas:</span>{" "}
                        {turma.capacidade} vagas disponíveis
                    </p>
                </div>

                <button
                    onClick={handleCandidatar}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                    Candidatar-se
                </button>
            </div>
        </div>
    )
}