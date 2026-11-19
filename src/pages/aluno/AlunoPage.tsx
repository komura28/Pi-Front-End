
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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <PageHeader
        titulo="Alunos por Turma"
        descricao="Consulte os alunos matriculados e acompanhe a ocupação das turmas."
        categoria="PAINEL ADMINISTRATIVO"
        icone={GraduationCap}
      />

      {loading ? (
        <p
          role="status"
          className="rounded-xl bg-white p-8 text-center text-slate-500"
        >
          Carregando turmas e alunos...
        </p>
      ) : erro ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
        >
          {erro}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">

          {/* SELEÇÃO DE TURMAS */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

          {/* PAINEL DE ALUNOS */}
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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