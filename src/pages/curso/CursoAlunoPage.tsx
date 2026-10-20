import { useEffect, useState } from "react";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";
import { cancelarMatricula, getMinhasMatriculas } from "../../services/matriculaService";
import type { TurmaMatricula } from "../../types/auth/auth-types";
import { Modal } from "../../components/Modal";

type CardProps = {
    turma: TurmaMatricula;
}

export function CursoAlunoPage({ turma }: CardProps) {

    const [candidaturas, setCandidaturas] = useState<MatriculaDTO[]>([]);
    const [error, setError] = useState("");
    const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
    const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [matriculaSelecionada, setMatriculaSelecionada] = useState<MatriculaDTO | null>(null);
    const [motivo, setMotivo] = useState("");

    const handleConfirmarCancelamento = () => {
        if (!motivo) {
            setFormError("Por favor, informe o motivo do cancelamento.");
            return;
        }
        setFormError("");
        setConfirmarCancelamento(true);
    }

    {// Função de Cancelar Matrícula}
        const handleCancelarMatricula = async () => {

            setIsSubmitting(true);
            setFormError("");


            try {

                if (!matriculaSelecionada) {
                    setFormError("Não foi possível encontrar a matrícula para cancelamento.");
                    return;
                }

                await cancelarMatricula(matriculaSelecionada._id, motivo);
                setCandidaturas(prev => prev.map(c => c._id === matriculaSelecionada._id
                    ? { ...c, status: "CANCELADA" }
                    : c
                ));
                setMotivo("");
                setConfirmarCancelamento(false);
                setMatriculaSelecionada(null);
                setMostrarModalSucesso(true);
                

            } catch (error) {
                setFormError(error instanceof Error ? error.message : "Erro ao Cancelar matrícula. Tente novamente.");
            } finally {
                setIsSubmitting(false);
            }
        };

        function abrirModalCancelamento(candidatura: MatriculaDTO) {
            setFormError("");
            setMatriculaSelecionada(candidatura);
        }

        function fecharModalCancelamento() {
            setConfirmarCancelamento(false);
            setMatriculaSelecionada(null);
            setMotivo("");
            setFormError("");
        }


        const getStatusStyle = (status: MatriculaDTO["status"]) => {
            switch (status) {
                case "APROVADA":
                    return "bg-green-100 text-green-700";
                case "RECUSADA":
                    return "bg-red-100 text-red-700";
                case "CANCELADA":
                    return "bg-red-100 text-gray-700";
                default:
                    return "bg-yellow-100 text-yellow-700";
            }
        };

        useEffect(() => {
            async function buscarCandidaturas() {
                try {
                    setError("");
                    const data = await getMinhasMatriculas();
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

                    {candidaturas.length === 0 ? (
                        <div className="p-8">
                            <p>
                                Você ainda não possui nenhuma candidatura em cursos.
                            </p>
                        </div>
                    ) : (
                        candidaturas.map((candidatura) => (
                            <div
                                key={candidatura._id}
                                className="rounded-xl bg-white p-6 shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Curso: {candidatura.turma?.curso?.name}
                                    </h2>

                                    {candidatura.status === "APROVADA" && (
                                        //Botão de Cancelamento de Matrícula
                                        <button
                                            onClick={() => abrirModalCancelamento(candidatura)}
                                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition bg-red-600 hover:bg-red-700 shrink-0"
                                        >
                                            Cancelar Matrícula
                                        </button>)}
                                </div>

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
                                    {candidatura?.status}
                                </span>

                            </div>
                        ))
                    )}
                    {matriculaSelecionada && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                    Antes de cancelar...
                                </h3>

                                <div className="mb-5">
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                        Digite o motivo do cancelamento da matrícula:
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            value={motivo}
                                            onChange={(e) => setMotivo(e.target.value)}
                                            placeholder="Digite o motivo do cancelamento"
                                            className="border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {formError && (
                                    <p className="mb-4 text-sm text-red-600">
                                        {formError}
                                    </p>
                                )}

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={fecharModalCancelamento}
                                        className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirmarCancelamento}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}

                                    </button>

                                </div>

                            </div>

                        </div>


                    )}
                    {confirmarCancelamento && (
                        <Modal
                            titulo="Confirmar Cancelamento"
                            message="Tem certeza que deseja cancelar a matrícula?"
                            decisao={null}
                            texto="Sim"
                            opSim={handleCancelarMatricula}
                            opNao= {() => setConfirmarCancelamento(false)}
                        />
                    )}

                    {mostrarModalSucesso && (
                        <Modal
                            titulo="Cancelamento"
                            message="Matéria cancelada com sucesso!"
                            decisao={null}
                            texto="Ok"
                            opSim={() => setMostrarModalSucesso(false)}
                        />
                    )}

                </div>
            </main>
        );
    }
}