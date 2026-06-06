import { useEffect, useState } from "react";
import { meusCursos } from "../../services/matriculaService";
import type { authMatricula } from "../../types/matricula/matricula-types";



export function CursoAlunoPage() {

    const [candidaturas, setCandidaturas] = useState<authMatricula[]>([]);
    const [error, setError] = useState("");

    const getStatusStyle = (status: authMatricula["status"]) => {
        switch (status) {
            case "APROVADA":
                return "bg-green-100 text-green-700";
            case "RECUSADA":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

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
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">
                Meus Cursos
            </h1>

            <div className="space-y-4">
                {candidaturas.map((candidatura) => (
                    <div
                        key={candidatura._id}
                        className="rounded-xl bg-white p-6 shadow-md"
                    >
                        <h2 className="mb-3 text-xl font-semibold text-gray-800">
                             Curso: {candidatura.turma?.curso?.name}
                        </h2>

                        <p className="mb-2 text-gray-600">
                            <span className="font-medium">
                                Data da candidatura:
                            </span>{" "}
                            {new Date(
                                candidatura.createdAt
                            ).toLocaleDateString("pt-BR")}
                        </p>

                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                candidatura.status
                            )}`}
                        >
                            {candidatura.status}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}