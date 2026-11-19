import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  UserRound,
  ChevronDown,
  Search
} from "lucide-react";

import { getTurma } from "../../services/authService";
import { getMatriculas } from "../../services/matriculaService";

import type { TurmaMatricula } from "../../types/auth/auth-types";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";

import { PageHeader } from "../../components/ui/PageHeader";
import { DataTable, type TableColumn } from "../../components/ui/DataTable";
import { Pagination } from "../../components/ui/Pagination";
import { formatDate } from "../../utils/formatters";

export function AlunoPage() {
  const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busca, setBusca] = useState("");

  const [openTurmaIds, setOpenTurmaIds] = useState<string[]>([]);

  const [pageByTurma, setPageByTurma] = useState<Record<string, number>>({});
  const itensPorPaginaAlunos = 5;

  const [paginaTurmas, setPaginaTurmas] = useState(1);
  const turmasPorPagina = 5;

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError("");

        const [turmasData, matriculasData] = await Promise.all([
          getTurma(),
          getMatriculas(),
        ]);

        setTurmas(turmasData);
        setMatriculas(matriculasData);
      } catch (err) {
        console.error("Erro ao carregar alunos por turma:", err);
        setError("Erro ao carregar turmas e alunos.");
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

  function mudarPaginaAluno(turmaId: string, novaPagina: number) {
    setPageByTurma((prev) => ({
      ...prev,
      [turmaId]: novaPagina,
    }));
  }

  const termoBusca = busca.trim().toLowerCase();

  const matriculasAprovadas = matriculas.filter(
    (matricula) => matricula.status === "APROVADA"
  );

  const turmasFiltradas = turmas.filter(({ turma }) => {
    const identificacaoTurma =
      `${turma.curso?.name ?? ""} ${turma.turno}`.toLowerCase();

    const encontrouTurma = identificacaoTurma.includes(termoBusca);

    const encontrouAluno = matriculasAprovadas.some(
      (matricula) =>
        matricula.turma._id === turma._id &&
        (
          matricula.user?.name
            ?.toLowerCase()
            .includes(termoBusca) ||
          matricula.user?.email
            ?.toLowerCase()
            .includes(termoBusca)
        )
    );

    return encontrouTurma || encontrouAluno;
  });

  const inicioTurmas = (paginaTurmas - 1) * turmasPorPagina;

  const turmasPaginadas = turmasFiltradas.slice(
    inicioTurmas,
    inicioTurmas + turmasPorPagina
  );


  const colunasAlunos: TableColumn<MatriculaDTO>[] = [
    {
      id: "aluno",
      titulo: "Aluno",
      renderizar: (matricula) => (
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <UserRound size={19} />
          </div>

          <span className="font-semibold text-slate-800">
            {matricula.user?.name || "Nome não informado"}
          </span>
        </div>
      )
    },
    {
      id: "email",
      titulo: "E-mail",
      renderizar: (matricula) => (
        <span className="text-slate-600">
          {matricula.user?.email || "Não informado"}
        </span>
      )
    },
    {
      id: "status",
      titulo: "Matrícula",
      renderizar: () => (
        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          Aprovada
        </span>
      )
    },
    {
      id: "data",
      titulo: "Data da matrícula",
      renderizar: (matricula) =>
        matricula.dataHora
          ? formatDate(matricula.dataHora)
          : "Não informada"
    }
  ];


  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">

      <PageHeader
        titulo="Alunos por turma"
        descricao="Consulte os alunos matriculados e organize a visualização por turma."
        categoria="PAINEL ADMINISTRATIVO"
        icone={GraduationCap}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Turmas e alunos
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Expanda uma turma para visualizar seus alunos com matrícula aprovada.
          </p>
        </div>

        <div className="relative mb-6">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaTurmas(1);
              setPageByTurma({});
            }}
            placeholder="Buscar curso, turno ou aluno..."
            aria-label="Buscar turmas e alunos"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {loading ? (
          <p className="py-10 text-center text-slate-500">
            Carregando turmas e alunos...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        ) : turmasFiltradas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            Nenhuma turma ou aluno encontrado.
          </p>
        ) : (
          <div className="space-y-4">

            {turmasPaginadas.map((item) => {
              const turma = item.turma;
              const turmaId = turma._id;
              const aberta = openTurmaIds.includes(turmaId);

              const alunosDaTurma = matriculasAprovadas.filter(
                (matricula) =>
                  matricula.turma._id === turmaId
              );

              const nomeTurma = `${turma.curso?.name ?? "Curso não definido"} ${turma.turno}`.toLowerCase();

              const correspondeTurma =
                nomeTurma.includes(termoBusca);

              const alunosVisiveis =
                termoBusca && !correspondeTurma
                  ? alunosDaTurma.filter(
                    (matricula) =>
                      matricula.user?.name
                        ?.toLowerCase()
                        .includes(termoBusca) ||
                      matricula.user?.email
                        ?.toLowerCase()
                        .includes(termoBusca)
                  )
                  : alunosDaTurma;

              const totalPaginasAlunos = Math.max(
                1,
                Math.ceil(
                  alunosVisiveis.length / itensPorPaginaAlunos
                )
              );

              const paginaAluno = Math.min(
                pageByTurma[turmaId] ?? 1,
                totalPaginasAlunos
              );

              const alunosPaginados = alunosVisiveis.slice(
                (paginaAluno - 1) * itensPorPaginaAlunos,
                paginaAluno * itensPorPaginaAlunos
              );

              return (
                <article
                  key={turmaId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blue-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleTurma(turmaId)}
                    aria-expanded={aberta}
                    aria-controls={`alunos-${turmaId}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Users size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800">
                          {turma.curso?.name ?? "Curso não definido"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {turma.turno} · {turma.capacidade} vagas
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(turma.dataInicio)}
                          {" até "}
                          {formatDate(turma.dataFim)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {alunosDaTurma.length} alunos
                      </span>

                      <ChevronDown
                        size={20}
                        className={`text-slate-500 transition-transform ${aberta ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {aberta && (
                    <div
                      id={`alunos-${turmaId}`}
                      className="border-t border-slate-200 bg-slate-50/50 p-4"
                    >
                      <DataTable
                        dados={alunosPaginados}
                        colunas={colunasAlunos}
                        chave={(matricula) => matricula._id}
                        mensagemVazia="Nenhum aluno com matrícula aprovada nesta turma."
                      />

                      {alunosVisiveis.length > itensPorPaginaAlunos && (
                        <div className="mt-5">
                          <Pagination
                            paginaAtual={paginaAluno}
                            totalItens={alunosVisiveis.length}
                            itensPorPagina={itensPorPaginaAlunos}
                            onPageChange={(pagina) =>
                              mudarPaginaAluno(turmaId, pagina)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}

            <div className="pt-3">
              <Pagination
                paginaAtual={paginaTurmas}
                totalItens={turmasFiltradas.length}
                itensPorPagina={turmasPorPagina}
                onPageChange={setPaginaTurmas}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}