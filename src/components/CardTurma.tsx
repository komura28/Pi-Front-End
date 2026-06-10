
import { useEffect, useState } from "react";
import { meusCursos, solicitarMatricula } from "../services/matriculaService";
import type { TurmaMatricula } from "../types/auth/auth-types";
import { formatDate } from "../utils/formatters";
import type { authMatricula } from "../types/matricula/matricula-types";


type CardProps = {
    turma: TurmaMatricula;
}

export function CardTurma({ turma }: CardProps) {

    const dataInicio = formatDate(turma.turma.dataInicio);
    const dataFim = formatDate(turma.turma.dataFim);
    const [candidaturas, setCandidaturas] = useState<authMatricula[]>([]);
    const [error, setError] = useState("");
    const [candidatura, setCandidatura] = useState(false);
    const jaCandidatado = candidaturas.some(
        solicitacao => solicitacao.turma._id === turma.turma._id
    );

    const handleCandidatar = async () => {
        try {
            const novaCandidatura = await solicitarMatricula({
                turma: turma.turma._id
            });

            setCandidaturas(prev => [...prev, novaCandidatura]);
            alert("Candidatura enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao candidatar-se à turma:", error);
            alert("Erro ao enviar candidatura. Por favor, tente novamente.");
        }
    }

    useEffect(() => {
        async function buscarCandidaturas() {
            try {
                setError("");
                const data = await meusCursos();
                setCandidaturas(data);
            } catch (error) {
                setError("Erro ao carregar os dados do Servidor");
            }
        }

        buscarCandidaturas();
        candidaturas.forEach(solicitacao => {
            if (solicitacao.turma._id == turma.turma._id) {
                setCandidatura(true);
            }
        });
    }, []);

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
                    disabled={jaCandidatado}
                    className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition
        ${jaCandidatado
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {jaCandidatado ? "Já Candidatado" : "Candidatar-se"}
                </button>
            </div>
        </div>
    )
}