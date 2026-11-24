import { useEffect, useState } from "react";
import {
  getMinhasMatriculas,
  solicitarMatricula,
} from "../services/matriculaService";
import type { TurmaMatricula } from "../types/auth/auth-types";
import { formatDate } from "../utils/formatters";
import type { MatriculaDTO } from "../types/matricula/matricula-types";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Sunrise,
  Sun,
  Moon,
  Clock3
} from "lucide-react";

import { AppDialog } from "./ui/AppDialog";
import { SuccessDialog } from "./ui/SuccessDialog";

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
        ${jaCandidatado
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {jaCandidatado ? "Já Candidatado" : "Candidatar-se"}
        </button>

        <AppDialog
          aberto={isCandidaturaModalOpen}
          aoFechar={fecharModalCandidatura}
          titulo="Confirmar candidatura"
          descricao="Responda às perguntas antes de enviar sua candidatura."
          icone={ClipboardCheck}
          salvando={isSubmitting}
          rodape={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={fecharModalCandidatura}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarCandidatura}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? "Enviando..." : "Confirmar candidatura"}
              </button>
            </div>
          }
        >
          <div className="min-w-0 space-y-6">

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                O que mais te interessa no curso?
              </p>

              <p className="text-xs text-slate-500">
                Selecione uma ou mais opções.
              </p>

              <div className="space-y-2">
                {OPCOES_INTERESSE_SERVICOS.map((opcao) => (
                  <label
                    key={opcao}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={interesseServicos.includes(opcao)}
                      onChange={() => toggleInteresse(opcao)}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                    />

                    <span className="min-w-0 break-words text-sm text-slate-700">
                      {opcao}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="como-soube-curso"
                className="block text-sm font-semibold text-slate-700"
              >
                Como você soube do curso?
              </label>

              <select
                id="como-soube-curso"
                value={comoSoubeCurso}
                onChange={(e) => setComoSoubeCurso(e.target.value)}
                disabled={isSubmitting}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

          </div>
        </AppDialog>



        <SuccessDialog
          aberto={mostrarModalSucesso}
          aoFechar={() => {
            setMostrarModalSucesso(false);
            navigate("/api/cursos");
          }}
          titulo="Candidatura enviada!"
          mensagem={`Sua candidatura para o curso ${turma.turma.curso?.name ?? "selecionado"
            } foi recebida com sucesso! Aguarde a análise da equipe do Aticurando. Você pode acompanhar o status em Meus Cursos.`}
          textoBotao="Ver minha candidatura"
        />

      </div>
    </div>
  );
}
