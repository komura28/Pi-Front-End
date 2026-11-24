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
import {
  GraduationCap,
  BookOpen,
  CalendarDays,
  ArrowRight
} from "lucide-react";

import { PageHeader } from "../../components/ui/PageHeader";
import { AppDialog } from "../../components/ui/AppDialog";

export function CursoAlunoPage() {
  const [candidaturas, setCandidaturas] = useState<MatriculaDTO[]>([]);
  const [error, setError] = useState("");
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matriculaSelecionada, setMatriculaSelecionada] =
    useState<MatriculaDTO | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
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
    setDetalhesAberto(false);
    setMatriculaSelecionada(candidatura);
    setDetalhesAberto(true);
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

  const dadosSelecionados = matriculaSelecionada
    ? buscarFrequencia(matriculaSelecionada._id)
    : undefined;

  const percentualSelecionado =
    dadosSelecionados?.frequenciaPercentual ?? 0;

  return (
    <main className="@container mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">
      <PageHeader
        titulo="Meus Cursos"
        descricao="Acompanhe suas candidaturas, matrículas e frequência nos cursos do Aticurando."
        categoria="ÁREA DO ALUNO"
        icone={GraduationCap}
      />

      <div className="space-y-4">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 @xl:grid-cols-[minmax(220px,29%)_minmax(0,1fr)] @4xl:gap-6">

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">

            <h2 className="text-lg font-bold text-slate-800">
              Minhas candidaturas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecione um curso para consultar suas informações.
            </p>

            <div className="mt-5 max-h-[65vh] space-y-3 overflow-y-auto pr-1">

              {candidaturas.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
                  Você ainda não possui candidaturas em cursos.
                </div>
              ) : (
                candidaturas.map((candidatura) => (
                  <button
                    key={candidatura._id}
                    type="button"
                    onClick={() => abrirVerDetalhes(candidatura)}
                    className={`w-full min-w-0 rounded-xl border p-3 text-left transition sm:p-4 ${matriculaSelecionada?._id === candidatura._id
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                      : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                  >
                    <div className="flex min-w-0 items-start gap-3">

                      <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700">
                        <BookOpen size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-bold text-slate-800">
                          {candidatura.turma?.curso?.name ?? "Curso não informado"}
                        </h3>

                        <p className="mt-2 break-words text-xs text-slate-500">
                          {new Date(candidatura.createdAt).toLocaleDateString("pt-BR")}
                        </p>

                        <span
                          className={`mt-3 inline-flex max-w-full rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(candidatura.status)}`}
                        >
                          {getStatusLabel(candidatura.status)}
                        </span>
                      </div>

                    </div>
                  </button>
                ))
              )}

            </div>
          </section>

          <section className="@container min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            {!matriculaSelecionada ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">

                <div className="rounded-2xl bg-blue-50 p-5 text-blue-600">
                  <GraduationCap size={36} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-800">
                  Selecione um curso
                </h2>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Escolha uma candidatura à esquerda para visualizar
                  sua situação e acompanhar sua frequência.
                </p>

              </div>
            ) : (
              <div className="min-w-0 space-y-6">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Curso selecionado
                  </p>

                  <h2 className="mt-2 break-words text-xl font-bold text-slate-800 sm:text-2xl">
                    {matriculaSelecionada.turma?.curso?.name ?? "Curso não informado"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Turno: {matriculaSelecionada.turma?.turno ?? "Não informado"}
                  </p>

                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                    <CalendarDays size={17} className="mt-0.5 shrink-0" />

                    <span>
                      Candidatura realizada em{" "}
                      {new Date(matriculaSelecionada.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Situação da matrícula
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(matriculaSelecionada.status)}`}
                  >
                    {getStatusLabel(matriculaSelecionada.status)}
                  </span>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <h3 className="text-lg font-bold text-slate-800">
                    Minha frequência
                  </h3>

                  <p className="mt-3 text-2xl font-bold text-blue-700">
                    {dadosSelecionados?.frequenciaPercentual == null
                      ? "Não registrada"
                      : `${percentualSelecionado}%`}
                  </p>

                  <div
                    className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label="Frequência do aluno"
                    aria-valuenow={percentualSelecionado}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, percentualSelecionado))}%`
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Frequência mínima exigida: {Freq_Min}%
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setDetalhesAberto(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Ver detalhes completos
                  <ArrowRight size={18} />
                </button>

              </div>
            )}

          </section>
        </div>


        <AppDialog
          aberto={Boolean(matriculaSelecionada) && detalhesAberto}
          aoFechar={() => setDetalhesAberto(false)}
          titulo="Detalhes do Curso"
          descricao={
            matriculaSelecionada?.turma?.curso?.name ??
            "Informações da matrícula"
          }
          icone={GraduationCap}
          tamanho="lg"
          rodape={
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetalhesAberto(false)}
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Fechar
              </button>
            </div>
          }
        >
          {matriculaSelecionada && (
            <div className="min-w-0 space-y-6">

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase text-blue-600">
                  Informações da matrícula
                </p>

                <h3 className="mt-2 break-words text-lg font-bold text-slate-800">
                  {matriculaSelecionada.turma?.curso?.name ??
                    "Curso não informado"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Turno: {matriculaSelecionada.turma?.turno ?? "Não informado"}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Data da candidatura:{" "}
                  {new Date(
                    matriculaSelecionada.createdAt
                  ).toLocaleDateString("pt-BR")}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    matriculaSelecionada.status
                  )}`}
                >
                  {getStatusLabel(matriculaSelecionada.status)}
                </span>
              </div>

              <section className="rounded-xl border border-slate-200 p-4">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <h3 className="text-lg font-bold text-slate-800">
                    Minha frequência
                  </h3>

                  <span className="text-xl font-bold text-blue-700">
                    {dadosSelecionados?.frequenciaPercentual == null
                      ? "Não registrada"
                      : `${percentualSelecionado}%`}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label="Minha frequência"
                  aria-valuenow={percentualSelecionado}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className={`h-full rounded-full transition-all ${percentualSelecionado >= Freq_Min
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                      }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, percentualSelecionado)
                      )}%`
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Frequência mínima exigida: {Freq_Min}%
                </p>
              </section>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-700">
                    Presenças
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-800">
                    {dadosSelecionados?.presentes ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">
                    Faltas
                  </p>

                  <p className="mt-2 text-2xl font-bold text-red-800">
                    {dadosSelecionados?.faltas ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-700">
                    Aulas contabilizadas
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-800">
                    {dadosSelecionados?.aulasContabilizadas ?? 0}
                  </p>
                </div>

              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">

                {matriculaSelecionada.status === "CANCELADA" ? (
                  <button
                    type="button"
                    disabled
                    className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
                  >
                    Matrícula cancelada
                  </button>
                ) : (
                  matriculaSelecionada.status === "APROVADA" &&
                  percentualSelecionado < Freq_Min && (
                    <button
                      type="button"
                      onClick={() =>
                        abrirModalCancelamento(matriculaSelecionada)
                      }
                      className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Cancelar matrícula
                    </button>
                  )
                )}

              </div>

            </div>
          )}
        </AppDialog>


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
