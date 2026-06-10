
import { solicitarMatricula } from "../services/matriculaService";
import type { authTurma, TurmaMatricula } from "../types/auth/auth-types";
import { formatDate } from "../utils/formatters";


type CardProps = {
    turma: TurmaMatricula;
}

export function CardTurma({ turma }: CardProps) {

    const dataInicio = formatDate(turma.turma.dataInicio);
    const dataFim = formatDate(turma.turma.dataFim);
    const handleCandidatar = async () => {
        try {
            await solicitarMatricula({ turma: turma.turma._id });
            alert("Candidatura enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao candidatar-se à turma:", error);
            alert("Erro ao enviar candidatura. Por favor, tente novamente.");
        }
    }

    return (
        <div className="max-w-md">
            <div className="rounded-xl bg-white p-6 shadow-md transition">
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                    Turma {formatDate(turma.turma.dataInicio)}
                </h2>

                <div className="mb-4 space-y-2 text-gray-600">
                    <p>
                        <span className="font-medium">Curso:</span>{" "}
                        {turma.turma.curso?.name}
                    </p>

                    <p>
                        <span className="font-medium">Datas:</span>{" "}
                        {dataInicio} - {dataFim}
                    </p>

                    <p>
                        <span className="font-medium">Vagas:</span>{" "}
                        {turma.vagasDisponiveis} vagas disponíveis
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