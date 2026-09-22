import { useEffect, useState } from "react";
import { meusCursos, solicitarMatricula } from "../services/matriculaService";
import type { TurmaMatricula } from "../types/auth/auth-types";
import { formatDate } from "../utils/formatters";
import type { authMatricula } from "../types/matricula/matricula-types";
import { Modal } from "./Modal";

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
                : [...prev, opcao]
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

            setCandidaturas(prev => [...prev, novaCandidatura]);
            fecharModalCandidatura();
            setMostrarModalSucesso(true);
        } catch (error) {
            console.error("Erro ao candidatar-se à turma:", error);
            setFormError("Erro ao enviar candidatura. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
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
                        <span className="font-medium">Turno:</span>{" "}
                        {turma.turma.turno}
                    </p>

                    <p>
                        <span className="font-medium">Vagas:</span>{" "}
                        {turma.vagasDisponiveis} vagas disponíveis
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

                {/* MODAL DE CANDIDATURA */}
                {isCandidaturaModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Antes de confirmar...
                            </h3>

                            <div className="mb-5">
                                <p className="text-sm font-medium text-slate-700 mb-2">
                                    O que mais te interessa no curso? (selecione uma ou mais opções)
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
                                    <option value="" disabled>Selecione uma opção</option>
                                    {OPCOES_COMO_SOUBE.map((opcao) => (
                                        <option key={opcao} value={opcao}>
                                            {opcao}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formError && (
                                <p className="mb-4 text-sm text-red-600">
                                    {formError}
                                </p>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={fecharModalCandidatura}
                                    className="px-4 py-2 bg-slate-200 text-slate-800 font-medium rounded-md hover:bg-slate-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmarCandidatura}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Enviando..." : "Confirmar Candidatura"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mostrarModalSucesso && (
                    <Modal
                        titulo="Candidatura"
                        message={"Candidatura enviada com sucesso!\nVerifique a candidatura em Meus Cursos"}
                        decisao={null}
                        texto="Ok"
                        opSim={() => setMostrarModalSucesso(false)}
                    />
                )}
            </div>
        </div>
    )
}