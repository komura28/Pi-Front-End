import { useEffect, useState } from "react";
import {
  getMinhasMatriculas,
  solicitarMatricula,
} from "../services/matriculaService";
import type { TurmaMatricula } from "../types/auth/auth-types";
import { formatDate } from "../utils/formatters";
import type { MatriculaDTO } from "../types/matricula/matricula-types";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sunrise, Sun, Moon, Clock3 } from "lucide-react";

const OPCOES_INTERESSE_SERVICOS = [
  "Aulas de teatro/palhaçaria",
  "Trabalho voluntário em hospitais",
  "Desenvolvimento pessoal",
  "Comunicação e expressão",
  "Trabalho em equipe",
  "Outro",
];
const OPCOES_COMO_SOUBE = [
  "Redes sociais",
  "Indicação de amigo ou familiar",
  "Site da Aticurando",
  "Evento presencial",
  "Outro",
];

type CardProps = {
  turma: TurmaMatricula;
  mostrarIconeTurno?: boolean;
};

export function CardTurma({ turma, mostrarIconeTurno = false }: CardProps) {
  const dataInicio = formatDate(turma.turma.dataInicio);
  const dataFim = formatDate(turma.turma.dataFim);
  const turnoNormalizado = (turma.turma.turno ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const IconeTurno =
    turnoNormalizado === "manha"
      ? Sunrise
      : turnoNormalizado === "tarde"
        ? Sun
        : turnoNormalizado === "noite"
          ? Moon
          : Clock3;

  const corTurno =
    turnoNormalizado === "manha"
      ? "bg-blue-50 text-blue-700"
      : turnoNormalizado === "tarde"
        ? "bg-amber-50 text-amber-700"
        : turnoNormalizado === "noite"
          ? "bg-violet-50 text-violet-700"
          : "bg-slate-100 text-slate-700";

  const nomeTurno =
    turnoNormalizado === "manha"
      ? "Manhã"
      : turnoNormalizado === "tarde"
        ? "Tarde"
        : turnoNormalizado === "noite"
          ? "Noite"
          : turma.turma.turno || "Não informado";
  const [candidaturas, setCandidaturas] = useState<MatriculaDTO[]>([]);
  const [, setError] = useState("");
  const jaCandidatado = candidaturas.some(
    (solicitacao) => solicitacao.turma._id === turma.turma._id,
  );
  const navigate = useNavigate();
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  const [isCandidaturaModalOpen, setIsCandidaturaModalOpen] = useState(false);
  const [interesseServicos, setInteresseServicos] = useState<string[]>([]);
  const [comoSoubeCurso, setComoSoubeCurso] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function abrirModalCandidatura() {
    setFormError("");
    setIsCandidaturaModalOpen(true);
  }

  function fecharModalCandidatura() {
    setIsCandidaturaModalOpen(false);
    setInteresseServicos([]);
    setComoSoubeCurso("");
    setFormError("");
  }

  function toggleInteresse(opcao: string) {
    setInteresseServicos((prev) =>
      prev.includes(opcao)
        ? prev.filter((item) => item !== opcao)
        : [...prev, opcao],
    );
  }

  const handleConfirmarCandidatura = async () => {
    if (interesseServicos.length === 0) {
      setFormError("Selecione ao menos um interesse.");
      return;
    }

    if (!comoSoubeCurso) {
      setFormError("Selecione como você soube do curso.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const novaCandidatura = await solicitarMatricula({
        turma: turma.turma._id,
        interesseServicos,
        comoSoubeCurso,
      });

      setCandidaturas((prev) => [...prev, novaCandidatura]);
      fecharModalCandidatura();
      setMostrarModalSucesso(true);
      console.log(novaCandidatura);
    } catch (error) {
      console.error("Erro ao candidatar-se à turma:", error);
      setFormError("Erro ao enviar candidatura. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function buscarCandidaturas() {
      try {
        setError("");
        const data = await getMinhasMatriculas();
        setCandidaturas(data);
      } catch {
        setError("Erro ao carregar os dados do Servidor");
      }
    }

    buscarCandidaturas();
  }, []);

  return (
    <div className="w-full min-w-0">
      <div className="h-full min-w-0 rounded-xl bg-white p-4 shadow-md transition sm:p-6">
        {mostrarIconeTurno && (
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${corTurno}`}
          >
            <IconeTurno size={18} aria-hidden="true" />
            {nomeTurno}
          </div>
        )}

        <h2 className="mb-2 break-words text-xl font-semibold text-gray-800 sm:text-2xl">
          Turma {formatDate(turma.turma.dataInicio)}
        </h2>

        <div className="mb-4 min-w-0 space-y-2 text-sm text-gray-600 sm:text-base">
          <p className="break-words">
            <span className="font-medium">Curso:</span>{" "}
            {turma.turma.curso?.name}
          </p>

          <p className="break-words">
            <span className="font-medium">Datas:</span> {dataInicio} - {dataFim}
          </p>

          {!mostrarIconeTurno && (
            <p className="break-words">
              <span className="font-medium">Turno:</span> {turma.turma.turno}
            </p>
          )}

          <p className="break-words">
            <span className="font-medium">Vagas:</span> {turma.vagasDisponiveis}{" "}
            vagas disponíveis
          </p>
        </div>

        <button
          onClick={abrirModalCandidatura}
          disabled={jaCandidatado}
          className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition
        ${
          jaCandidatado
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        >
          {jaCandidatado ? "Já Candidatado" : "Candidatar-se"}
        </button>

        {/* MODAL DE CANDIDATURA */}
        {isCandidaturaModalOpen && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
            <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md min-w-0 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
              <h3 className="break-words text-xl font-semibold text-slate-900 mb-4">
                Antes de confirmar...
              </h3>

              <div className="mb-5">
                <p className="break-words text-sm font-medium text-slate-700 mb-2">
                  O que mais te interessa no curso? (selecione uma ou mais
                  opções)
                </p>

                <div className="flex flex-col gap-2">
                  {OPCOES_INTERESSE_SERVICOS.map((opcao) => (
                    <label
                      key={opcao}
                      className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={interesseServicos.includes(opcao)}
                        onChange={() => toggleInteresse(opcao)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {opcao}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Como você soube do curso?
                </label>
                <select
                  value={comoSoubeCurso}
                  onChange={(e) => setComoSoubeCurso(e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {OPCOES_COMO_SOUBE.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </div>

              {formError && (
                <p className="mb-4 text-sm text-red-600">{formError}</p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={fecharModalCandidatura}
                  className="w-full rounded-md bg-slate-200 px-4 py-2 font-medium text-slate-800 transition-colors hover:bg-slate-300 sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarCandidatura}
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar Candidatura"}
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarModalSucesso && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-sucesso"
              className="my-auto w-full max-w-md min-w-0 rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-8"
            >
              <div className="mb-5 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={36} className="text-green-600" />
                </div>
              </div>

              <h2
                id="titulo-sucesso"
                className="break-words mb-4 text-2xl font-bold text-slate-800"
              >
                Candidatura enviada!
              </h2>

              <div className="mb-7 space-y-4">
                <p className="break-words text-sm leading-relaxed text-slate-700">
                  Sua candidatura para o curso{" "}
                  <strong>{turma.turma.curso?.name ?? "selecionado"}</strong>{" "}
                  foi recebida com sucesso!
                </p>

                <p className="break-words text-sm leading-relaxed text-slate-500">
                  Agora é só aguardar a análise da equipe do Aticurando.
                </p>

                <p className="break-words text-sm leading-relaxed text-slate-500">
                  Você pode acompanhar o status da sua candidatura em{" "}
                  <strong className="text-slate-700">Meus Cursos</strong>.
                </p>
              </div>

              <button
                type="button"
                autoFocus
                onClick={() => {
                  setMostrarModalSucesso(false);
                  navigate("/api/cursos");
                }}
                className="w-full cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Ver minha candidatura
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
