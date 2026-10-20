import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaUserGraduate } from "react-icons/fa";
import { getTurma } from "../../services/authService";
import { getMatriculas } from "../../services/matriculaService";
import type { TurmaMatricula } from "../../types/auth/auth-types";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";

export function AlunoPage() {
  const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openTurmaIds, setOpenTurmaIds] = useState<string[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError("");

        const [turmasData, matriculasData] =
          await Promise.all([
            getTurma(),
            getMatriculas(),
          ]);

        setTurmas(turmasData);
        setMatriculas(matriculasData);

      } catch (err) {
        console.error(
          "Erro ao carregar alunos por turma:",
          err
        );

        setError(
          "Erro ao carregar turmas e alunos."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  function toggleTurma(turmaId: string) {
    setOpenTurmaIds((prev) =>
      prev.includes(turmaId)
        ? prev.filter((id) => id !== turmaId)
        : [...prev, turmaId]
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Lista de Alunos por Turma
      </h1>

      {loading && (
        <div className="p-8 text-slate-600 font-medium">
          Carregando turmas e alunos...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-6">
          {error}
        </div>
      )}

      {!loading && turmas.length === 0 && (
        <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
          Nenhuma turma encontrada.
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        {turmas.map((item, index) => {
          const turma = item.turma;

          const keyTurma = turma._id || `turma-${index}`;

          const isOpen = openTurmaIds.includes(keyTurma);

          const matriculasDaTurma =
            matriculas.filter((matricula) =>
              matricula.status === "APROVADA" &&
              matricula.turma._id === turma._id
            );


          const nomeTurma = `${turma.curso.name} - ${turma.turno}`;

          const quantidadeAlunos = matriculasDaTurma.length;

          return (
            <div
              key={keyTurma}
              className="w-full bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleTurma(keyTurma)}
                className="w-full px-6 py-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors cursor-pointer text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-800 text-base">
                    {nomeTurma}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium border border-slate-200">
                    {quantidadeAlunos} aluno(s)
                  </span>
                </div>

                <div className="text-slate-500">
                  {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                  {matriculasDaTurma.length > 0 ? (
                    <table className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden text-sm">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                          <th className="text-left font-medium p-3">
                            Nome do Aluno
                          </th>
                          <th className="text-left font-medium p-3">
                            Status da Matrícula
                          </th>
                          <th className="text-left font-medium p-3">
                            E-mail
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {matriculasDaTurma.map((item, idx) => {
                          const aluno = item.user;
                          const itemKey = item._id || `matricula-${idx}`;

                          return (
                            <tr
                              key={itemKey}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="p-3 text-slate-800 font-medium flex items-center gap-2">
                                <FaUserGraduate className="text-slate-400 shrink-0" />
                                {aluno?.name || (aluno as any)?.nome || "Sem nome"}
                              </td>
                              <td className="p-3 text-slate-600">
                                <span className="px-2.5 py-1 text-xs rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600">
                                {aluno?.email || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-3">
                      Nenhum aluno matriculado nesta turma.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}