
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

import { getTurma } from "../../services/authService";
import { getMatriculas } from "../../services/matriculaService";

import type { TurmaMatricula } from "../../types/auth/auth-types";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";

import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { TurmaSelector } from "../../components/turmas/TurmaSelector";
import { AlunosTurmaPanel } from "../../components/aluno/AlunosTurmaPanel";

const TURMAS_POR_PAGINA = 5;

export function AlunoPage() {
  const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [buscaTurma, setBuscaTurma] = useState("");
  const [paginaTurmas, setPaginaTurmas] = useState(1);

  const [turmaSelecionadaId, setTurmaSelecionadaId] =
    useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setLoading(true);
        setErro("");

        const [turmasData, matriculasData] =
          await Promise.all([
            getTurma(),
            getMatriculas()
          ]);

        if (!ativo) return;

        setTurmas(turmasData);
        setMatriculas(matriculasData);

      } catch (error) {
        console.error("Erro ao carregar alunos:", error);

        if (ativo) {
          setErro(
            "Não foi possível carregar as turmas e matrículas."
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const termo = buscaTurma.trim().toLowerCase();

  const turmasFiltradas = turmas.filter((item) => {
    const curso = item.turma.curso?.name ?? "";
    const turno = item.turma.turno;

    return `${curso} ${turno}`
      .toLowerCase()
      .includes(termo);
  });

  const inicioPagina =
    (paginaTurmas - 1) * TURMAS_POR_PAGINA;

  const turmasPaginadas = turmasFiltradas.slice(
    inicioPagina,
    inicioPagina + TURMAS_POR_PAGINA
  );

  const turmaSelecionada = turmas.find(
    (item) => item.turma._id === turmaSelecionadaId
  ) ?? null;

  return (
    <main className="@container mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">
      <PageHeader
        titulo="Alunos por Turma"
        descricao="Consulte os alunos matriculados e acompanhe a ocupação das turmas."
        categoria="PAINEL ADMINISTRATIVO"
        icone={GraduationCap}
      />

      {loading ? (
        <p
          role="status"
          className="p-4 sm:p-8"
        >
          Carregando turmas e alunos...
        </p>
      ) : erro ? (
        <p
          role="alert"
          className="p-4 sm:p-8"
        >
          {erro}
        </p>
      ) : (
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 @2xl:grid-cols-[minmax(220px,28%)_minmax(0,1fr)] @4xl:gap-6">

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <TurmaSelector
              turmas={turmasPaginadas}
              selecionadaId={turmaSelecionadaId}
              busca={buscaTurma}
              onBuscaChange={(valor) => {
                setBuscaTurma(valor);
                setPaginaTurmas(1);
              }}
              onSelecionar={(item) => {
                setTurmaSelecionadaId(item.turma._id);
              }}
            />

            {turmasFiltradas.length > TURMAS_POR_PAGINA && (
              <div className="mt-5">
                <Pagination
                  paginaAtual={paginaTurmas}
                  totalItens={turmasFiltradas.length}
                  itensPorPagina={TURMAS_POR_PAGINA}
                  onPageChange={setPaginaTurmas}
                />
              </div>
            )}
          </section>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
            <AlunosTurmaPanel
              key={turmaSelecionadaId ?? "sem-turma"}
              turma={turmaSelecionada}
              matriculas={matriculas}
            />
          </section>

        </div>
      )}
    </main>
  );
}