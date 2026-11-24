import { useEffect, useState } from "react";
import type {
  FrequenciaAlunoDashboard,
  MatriculaDTO,
} from "../../types/matricula/matricula-types";
import {
  cancelarMatricula,
  getMinhasMatriculas,
  getMinhaFrequencia,
} from "../../services/matriculaService";
import { Modal } from "../../components/Modal";

export function CursoAlunoPage() {
  const [candidaturas, setCandidaturas] = useState<MatriculaDTO[]>([]);
  const [error, setError] = useState("");
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matriculaSelecionada, setMatriculaSelecionada] =
    useState<MatriculaDTO | null>(null);
  const [cancelamentoMatricula, setCancelamentoMatricula] =
    useState<MatriculaDTO | null>(null);
  const [motivo, setMotivo] = useState("");
  const [frequencia, setFrequencia] = useState<FrequenciaAlunoDashboard[]>([]);
  const Freq_Min = 75;

  const buscarFrequencia = (matriculaId: string) => {
    return frequencia.find((item) => item.matriculaId === matriculaId);
  };

  const handleConfirmarCancelamento = () => {
    if (!motivo.trim()) {
      setFormError("Por favor, informe o motivo do cancelamento.");
      return;
    }
    setFormError("");
    setConfirmarCancelamento(true);
  };

  const handleCancelarMatricula = async () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      if (!cancelamentoMatricula) {
        setFormError(
          "Não foi possível encontrar a matrícula para cancelamento.",
        );
        return;
      }

      await cancelarMatricula(cancelamentoMatricula._id, motivo.trim());
      setCandidaturas((prev) =>
        prev.map((c) =>
          c._id === cancelamentoMatricula._id
            ? { ...c, status: "CANCELADA" }
            : c,
        ),
      );
      setMatriculaSelecionada((prev) =>
        prev?._id === cancelamentoMatricula._id
          ? { ...prev, status: "CANCELADA" }
          : prev,
      );
      setMotivo("");
      setConfirmarCancelamento(false);
      setCancelamentoMatricula(null);
      setMostrarModalSucesso(true);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Erro ao Cancelar matrícula. Tente novamente.",
      );
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
      case "APROVADA":
        return "Aprovada";
      case "RECUSADA":
        return "Recusada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return "Pendente";
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
      } catch {
        setError("Erro ao carregar os dados do Servidor");
      }
    }

    buscarCandidaturas();
  }, []);

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
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
            <p>Você ainda não possui nenhuma candidatura em cursos.</p>
          </div>
        ) : (
          candidaturas.map((candidatura) => (
            <button
              key={candidatura._id}
              type="button"
              onClick={() => abrirVerDetalhes(candidatura)}
              className="group w-full min-w-0 cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:p-6"
            >
              <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-700 sm:text-xl">
                  Curso: {candidatura.turma?.curso?.name}
                </h2>

                <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-gray-600 transition-colors group-hover:text-blue-700">
                  Clique para ver detalhes <span aria-hidden="true">→</span>
                </span>
              </div>

              <p className="mb-2 text-gray-600">
                <span className="font-medium">Data da candidatura:</span>{" "}
                {new Date(candidatura.createdAt).toLocaleDateString("pt-BR")}
              </p>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                  candidatura.status,
                )}`}
              >
                {getStatusLabel(candidatura.status)}
              </span>
            </button>
          ))
        )}

        {matriculaSelecionada && (
          <div className="fixed inset-0 z-5000 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
            <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-5 sm:px-7 sm:py-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-lg bg-blue-100 p-2 text-blue-700">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </span>

                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Área do aluno
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Detalhes do Curso
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {matriculaSelecionada.turma?.curso?.name}
                </p>
              </div>

              <div className="min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-7">
                {(() => {
                  const dados = buscarFrequencia(matriculaSelecionada._id);
                  const percentual = dados?.frequenciaPercentual ?? 0;

                  return (
                    <div className="space-y-5">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Minha frequência
                          </h3>

                          <span
                            className={`text-xl font-bold ${
                              percentual >= Freq_Min
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {percentual}%
                          </span>
                        </div>

                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percentual >= Freq_Min
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(0, percentual))}%`,
                            }}
                          />
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Frequência mínima exigida: {Freq_Min}%
                        </p>
                      </div>

                      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                          <p className="text-sm font-medium text-emerald-700">
                            Presenças
                          </p>
                          <p className="mt-1 text-2xl font-bold text-emerald-800">
                            {dados?.presentes ?? 0}
                          </p>
                        </div>

                        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                          <p className="text-sm font-medium text-red-700">
                            Faltas
                          </p>
                          <p className="mt-1 text-2xl font-bold text-red-800">
                            {dados?.faltas ?? 0}
                          </p>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="text-sm font-medium text-blue-700">
                            Aulas
                          </p>
                          <p className="mt-1 text-2xl font-bold text-blue-800">
                            {dados?.aulasContabilizadas ?? 0}
                          </p>
                        </div>
                      </div>

                      {matriculaSelecionada.status === "CANCELADA" ? (
                        <button
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-slate-300 px-4 py-3 font-semibold text-slate-600 opacity-80 sm:w-auto"
                        >
                          Cancelada
                        </button>
                      ) : (
                        matriculaSelecionada.status === "APROVADA" &&
                        percentual < Freq_Min && (
                          <button
                            onClick={() =>
                              abrirModalCancelamento(matriculaSelecionada)
                            }
                            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                          >
                            Cancelar Matrícula
                          </button>
                        )
                      )}

                      {matriculaSelecionada.status === "APROVADA" &&
                        percentual >= Freq_Min && (
                          <button className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto">
                            Emitir Certificado
                          </button>
                        )}
                    </div>
                  );
                })()}

                <div className="flex justify-end border-t border-slate-200 pt-4">
                  <button
                    onClick={() => setMatriculaSelecionada(null)}
                    className="w-full cursor-pointer rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-200 sm:w-auto"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cancelamentoMatricula && !confirmarCancelamento && (
          <div className="fixed inset-0 z-5001 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4">
            <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-md overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6">
              {" "}
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
                    className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {formError && (
                <p className="mb-4 text-sm text-red-600">{formError}</p>
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={fecharModalCancelamento}
                  disabled={isSubmitting}
                  className="cursor-pointer px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                >
                  Voltar
                </button>

                <button
                  onClick={handleConfirmarCancelamento}
                  disabled={isSubmitting}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Confirmar Cancelamento
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
    </main>
  );
}
