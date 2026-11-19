
import { useState } from "react";
import {
    CalendarDays,
    Search,
    UserRound,
    Users,
    UserCheck,
    Clock3
} from "lucide-react";

import type { TurmaMatricula } from "../../types/auth/auth-types";
import type { MatriculaDTO } from "../../types/matricula/matricula-types";

import { DataTable, type TableColumn } from "../ui/DataTable";
import { Pagination } from "../ui/Pagination";
import { formatDate } from "../../utils/formatters";

interface AlunosTurmaPanelProps {
    turma: TurmaMatricula | null;
    matriculas: MatriculaDTO[];
}

const ITENS_POR_PAGINA = 5;

const colunas: TableColumn<MatriculaDTO>[] = [
    {
        id: "aluno",
        titulo: "Aluno",
        renderizar: (matricula) => (
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <UserRound size={18} />
                </div>

                <span className="font-semibold text-slate-800">
                    {matricula.user?.name ?? "Usuário não disponível"}
                </span>
            </div>
        )
    },
    {
        id: "email",
        titulo: "E-mail",
        renderizar: (matricula) =>
            matricula.user?.email ?? "Não informado"
    },
    {
        id: "matricula",
        titulo: "Data da matrícula",
        renderizar: (matricula) =>
            matricula.dataHora
                ? formatDate(matricula.dataHora)
                : "Não informada"
    },
    {
        id: "status",
        titulo: "Situação",
        renderizar: () => (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Aprovada
            </span>
        )
    }
];

export function AlunosTurmaPanel({
    turma,
    matriculas
}: Readonly<AlunosTurmaPanelProps>) {
    const [buscaAluno, setBuscaAluno] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);

    if (!turma) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="rounded-2xl bg-blue-50 p-5 text-blue-600">
                    <Users size={36} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-800">
                    Selecione uma turma
                </h2>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Escolha uma turma à esquerda para consultar
                    os alunos e acompanhar suas vagas.
                </p>
            </div>
        );
    }

    const turmaId = turma.turma._id;
    const capacidade = turma.turma.capacidade;

    const aprovadas = matriculas.filter(
        (item) =>
            item.turma?._id === turmaId &&
            item.status === "APROVADA"
    );

    const pendentes = matriculas.filter(
        (item) =>
            item.turma?._id === turmaId &&
            item.status === "PENDENTE"
    ).length;

    const vagasDisponiveis = Math.max(
        0,
        turma.vagasDisponiveis
    );

    const ocupacao = capacidade > 0
        ? Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    ((capacidade - vagasDisponiveis) / capacidade) * 100
                )
            )
        )
        : 0;

    const termo = buscaAluno.trim().toLowerCase();

    const alunosFiltrados = aprovadas
        .filter((item) =>
            (item.user?.name ?? "").toLowerCase().includes(termo) ||
            (item.user?.email ?? "").toLowerCase().includes(termo)
        )
        .sort((a, b) =>
            (a.user?.name ?? "").localeCompare(
                b.user?.name ?? "",
                "pt-BR"
            )
        );

    const totalPaginas = Math.max(
        1,
        Math.ceil(alunosFiltrados.length / ITENS_POR_PAGINA)
    );

    const pagina = Math.min(paginaAtual, totalPaginas);

    const alunosPaginados = alunosFiltrados.slice(
        (pagina - 1) * ITENS_POR_PAGINA,
        pagina * ITENS_POR_PAGINA
    );

    return (
        <div className="space-y-6">
            {/* IDENTIFICAÇÃO DA TURMA */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Turma selecionada
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {turma.turma.curso?.name ?? "Curso não informado"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Turno: {turma.turma.turno}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={16} />
                    {formatDate(turma.turma.dataInicio)}
                    {" até "}
                    {formatDate(turma.turma.dataFim)}
                </div>
            </div>

            {/* INDICADORES */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-4">
                    <Users size={20} className="text-slate-500" />
                    <p className="mt-3 text-xs text-slate-500">
                        Capacidade
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-800">
                        {capacidade}
                    </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                    <UserCheck size={20} className="text-green-600" />
                    <p className="mt-3 text-xs text-green-700">
                        Alunos aprovados
                    </p>
                    <p className="mt-1 text-3xl font-bold text-green-700">
                        {aprovadas.length}
                    </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                    <Users size={20} className="text-blue-600" />
                    <p className="mt-3 text-xs text-blue-700">
                        Vagas disponíveis
                    </p>
                    <p className="mt-1 text-3xl font-bold text-blue-700">
                        {vagasDisponiveis}
                    </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                    <Clock3 size={20} className="text-amber-600" />
                    <p className="mt-3 text-xs text-amber-700">
                        Solicitações pendentes
                    </p>
                    <p className="mt-1 text-3xl font-bold text-amber-700">
                        {pendentes}
                    </p>
                </div>
            </div>

            {/* OCUPAÇÃO */}
            <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">
                        Ocupação da turma
                    </h3>

                    <span className="font-bold text-blue-700">
                        {ocupacao}%
                    </span>
                </div>

                <div
                    role="progressbar"
                    aria-label="Ocupação da turma"
                    aria-valuenow={ocupacao}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                >
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${ocupacao}%` }}
                    />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                    {vagasDisponiveis} vagas disponíveis de {capacidade}
                </p>
            </div>

            {/* LISTAGEM DE ALUNOS */}
            <div className="border-t border-slate-200 pt-5">
                <h3 className="text-lg font-bold text-slate-800">
                    Alunos matriculados
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Lista de alunos com matrícula aprovada nesta turma.
                </p>

                <div className="relative my-5">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={buscaAluno}
                        onChange={(evento) => {
                            setBuscaAluno(evento.target.value);
                            setPaginaAtual(1);
                        }}
                        placeholder="Pesquisar aluno por nome ou e-mail..."
                        aria-label="Pesquisar alunos da turma"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <DataTable
                    dados={alunosPaginados}
                    colunas={colunas}
                    chave={(item) => item._id}
                    mensagemVazia="Nenhum aluno encontrado nesta turma."
                />

                {alunosFiltrados.length > ITENS_POR_PAGINA && (
                    <div className="mt-5">
                        <Pagination
                            paginaAtual={pagina}
                            totalItens={alunosFiltrados.length}
                            itensPorPagina={ITENS_POR_PAGINA}
                            onPageChange={setPaginaAtual}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}