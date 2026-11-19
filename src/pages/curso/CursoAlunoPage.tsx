import { useEffect, useState } from "react";
import type { FrequenciaAlunoDashboard, MatriculaDTO } from "../../types/matricula/matricula-types";
import { cancelarMatricula, getMinhasMatriculas, getMinhaFrequencia } from "../../services/matriculaService";
import { Modal } from "../../components/Modal";


export function CursoAlunoPage() {

    const [candidaturas, setCandidaturas] = useState<MatriculaDTO[]>([]);
    const [error, setError] = useState("");
    const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
    const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [matriculaSelecionada, setMatriculaSelecionada] = useState<MatriculaDTO | null>(null);
    const [cancelamentoMatricula, setCancelamentoMatricula] = useState<MatriculaDTO | null>(null);
    const [motivo, setMotivo] = useState("");
    const [frequencia, setFrequencia] = useState<FrequenciaAlunoDashboard[]>([]);
    const Freq_Min = 75;


    const buscarFrequencia = (matriculaId: string) => {
        return frequencia.find(
            (item) => item.matriculaId === matriculaId
        );
    };

    const handleConfirmarCancelamento = () => {
        if (!motivo) {
            setFormError("Por favor, informe o motivo do cancelamento.");
            return;
        }
        setFormError("");
        setConfirmarCancelamento(true);
    }

    // Função de Cancelar Matrícula
    const handleCancelarMatricula = async () => {

        setIsSubmitting(true);
        setFormError("");


        try {

            if (!cancelamentoMatricula) {
                setFormError("Não foi possível encontrar a matrícula para cancelamento.");
                return;
            }

            await cancelarMatricula(cancelamentoMatricula._id, motivo);
            setCandidaturas(prev => prev.map(c => c._id === cancelamentoMatricula._id
                ? { ...c, status: "CANCELADA" }
                : c
            ));
            setMotivo("");
            setConfirmarCancelamento(false);
            setCancelamentoMatricula(null);
            setMostrarModalSucesso(true);


        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Erro ao Cancelar matrícula. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    function abrirModalCancelamento(candidatura: MatriculaDTO) {
        setFormError("");
        setCancelamentoMatricula(candidatura);
    }

    function fecharModalCancelamento() {
        setConfirmarCancelamento(false);
        setCancelamentoMatricula(null);
        setMotivo("");
        setFormError("");
    }

    function abrirVerDetalhes(candidatura: MatriculaDTO) {
        setMatriculaSelecionada(candidatura);
    }


    const getStatusStyle = (status: MatriculaDTO["status"]) => {
        switch (status) {
            case "APROVADA":
                return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
            case "RECUSADA":
                return "bg-red-50 text-red-700 ring-1 ring-red-200";
            case "CANCELADA":
                return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
            default:
                return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        }
    };

    const getStatusLabel = (status: MatriculaDTO["status"]) => {
        switch (status) {
            case "APROVADA": return "Aprovada";
            case "RECUSADA": return "Recusada";
            case "CANCELADA": return "Cancelada";
            default: return "Pendente";
        }
    };

    useEffect(() => {
        async function buscarCandidaturas() {
            try {
                setError("");
                const data = await getMinhasMatriculas();
                const dadosFrequencia = await getMinhaFrequencia();
                setFrequencia(dadosFrequencia);
                setCandidaturas(data);
            } catch (error) {
                setError("Erro ao carregar os dados do Servidor");
            }
        }

        buscarCandidaturas();
    }, []);

    return (
        <main className="min-h-screen bg-white p-8">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">
                Meus Cursos
            </h1>

            <div className="space-y-4">
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

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
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Curso: {candidatura.turma?.curso?.name}
                                </h2>

                                <button
                                    onClick={() => abrirVerDetalhes(candidatura)}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                                >
                                    Ver Detalhes
                                </button>
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
                    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

                            <h2 className="text-2xl font-bold mb-4">
                                Detalhes do Curso
                            </h2>

                            <p className="text-gray-600">
                                Curso: {matriculaSelecionada.turma?.curso?.name}
                            </p>

                            {(() => {
                                const dados = buscarFrequencia(matriculaSelecionada._id);
                                const percentual = dados?.frequenciaPercentual ?? 0;

                                return (
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-lg font-semibold">
                                            Minha frequência
                                        </h3>

                                        <p>Frequência: {percentual}%</p>
                                        <p>Presenças: {dados?.presentes ?? 0}</p>
                                        <p>Faltas: {dados?.faltas ?? 0}</p>
                                        <p>Aulas contabilizadas: {dados?.aulasContabilizadas ?? 0}</p>

                                        {matriculaSelecionada.status === "APROVADA" &&
                                            percentual < Freq_Min && (
                                                <button
                                                    onClick={() => abrirModalCancelamento(matriculaSelecionada)}
                                                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Cancelar Matrícula
                                                </button>
                                            )}

                                        {matriculaSelecionada.status === "APROVADA" &&
                                            percentual >= Freq_Min && (
                                                <button
                                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Emitir Certificado
                                                </button>
                                            )}
                                    </div>
                                );
                            })()}

                            <button
                                onClick={() => setMatriculaSelecionada(null)}
                                className="mt-6 px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                Fechar
                            </button>

                        </div>
                    </div>
                )}

                {cancelamentoMatricula && (
                    <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                        opNao={() => setConfirmarCancelamento(false)}
                    />
                )}

                {mostrarModalSucesso && (
                    <Modal
                        titulo="Cancelamento"
                        message="Matrícula cancelada com sucesso!"
                        decisao={null}
                        texto="Ok"
                        opSim={() => setMostrarModalSucesso(false)}
                    />
                )}

            </div>
        </main >
    );
}
