import { useEffect, useState } from "react";
import { ProfessorStatCard } from "../../components/professor/ProfessorStatCard";
import { ProximaAulaCard, type ProximaAula } from "../../components/professor/ProximaAulaCard";
import { useAuth } from "../../contexts/AuthContext";
import { BookOpen, CalendarDays, GraduationCap, Users } from "lucide-react";
import { getMinhasAulas } from "../../services/professorService";
import { AgendaResumo } from "../../components/professor/AgendaResumo";
import type { AulaTurmaProfessor } from "../../types/professor/professor-types";
import { useAgora } from "../../hooks/useAgora";
import { LembreteFinalizacao } from "../../components/professor/LembreteFinalizacao";

const inicioMock = new Date();

inicioMock.setDate(inicioMock.getDate() + 1);
inicioMock.setHours(19, 0, 0, 0);

export function ProfessorHomePage() {
    const { user } = useAuth();

    const primeiroNome =
        user?.name?.trim().split(/\s+/)[0] || "Professor";

    const dataAtual = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const [aulasProfessor, setAulasProfessor] =
        useState<AulaTurmaProfessor[]>([]);

    const [proximaAula, setProximaAula] =
        useState<ProximaAula | null>(null);

    const [carregandoAulas, setCarregandoAulas] =
        useState(true);

    const [erroAulas, setErroAulas] =
        useState("");

    const [agenda, setAgenda] = useState<ProximaAula[]>([]);

    const totalTurmas = new Set(
        aulasProfessor.flatMap((item) =>
            item.turma ? [item.turma._id] : []
        )
    ).size;

    const totalAgendadas = aulasProfessor.filter(
        (item) => item.status === "AGENDADA"
    ).length;

    const hoje = new Date();

    const agora = useAgora();

    const [aulasParaLembrete, setAulasParaLembrete] =
        useState<AulaTurmaProfessor[]>([]);

    const aulasHoje = aulasProfessor.filter((item) => {
        if (
            !item.dataInicio ||
            !["AGENDADA", "REALIZADA"].includes(item.status)
        ) {
            return false;
        }

        const dataAula = new Date(item.dataInicio);

        if (Number.isNaN(dataAula.getTime())) {
            return false;
        }

        return (
            dataAula.getDate() === hoje.getDate() &&
            dataAula.getMonth() === hoje.getMonth() &&
            dataAula.getFullYear() === hoje.getFullYear()
        );
    }).length;

    const valorIndicador = (valor: number) =>
        carregandoAulas ? "..." : erroAulas ? "—" : valor;

    const indicadores = [
        {
            titulo: "Minhas Turmas",
            valor: valorIndicador(totalTurmas),
            icone: Users
        },
        {
            titulo: "Aulas Hoje",
            valor: valorIndicador(aulasHoje),
            icone: CalendarDays
        },
        {
            titulo: "Aulas Agendadas",
            valor: valorIndicador(totalAgendadas),
            icone: BookOpen
        }
    ];

    useEffect(() => {
        let ativo = true;

        async function carregarProximaAula() {
            try {
                const aulas = await getMinhasAulas();

                if (ativo) {
                    setAulasParaLembrete(aulas);
                }

                const agora = Date.now();

                const futuras = aulas
                    .filter((item) =>
                        item.status === "AGENDADA" &&
                        item.dataInicio &&
                        Number.isFinite(
                            new Date(item.dataInicio).getTime()
                        ) &&
                        new Date(item.dataInicio).getTime() >= agora
                    )
                    .sort((a, b) =>
                        new Date(a.dataInicio!).getTime() -
                        new Date(b.dataInicio!).getTime()
                    );

                const aulasFormatadas: ProximaAula[] = futuras.flatMap(
                    (item): ProximaAula[] => {
                        if (
                            !item.aula ||
                            !item.turma ||
                            !item.dataInicio ||
                            !item.dataFim
                        ) {
                            return [];
                        }

                        return [{
                            id: item._id,
                            titulo: item.aula.titulo,
                            turma: `Turma - ${item.turma.turno}`,
                            curso: item.turma.curso?.name ??
                                "Curso não informado",
                            dataInicio: item.dataInicio,
                            dataFim: item.dataFim
                        }];
                    }
                );

                if (!ativo) return;

                setAulasProfessor(aulas);
                setAgenda(aulasFormatadas);
                setProximaAula(aulasFormatadas[0] ?? null);

            } catch {
                if (ativo) {
                    setErroAulas(
                        "Não foi possível carregar suas aulas."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregandoAulas(false);
                }
            }
        }

        void carregarProximaAula();

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-8 text-white shadow-lg">

                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2 text-blue-200">
                        <GraduationCap size={20} />
                        <span className="text-sm font-semibold tracking-wide">
                            PAINEL DO PROFESSOR
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold md:text-4xl">
                        Olá, {primeiroNome}!
                    </h1>

                    <p className="mt-3 max-w-xl text-blue-100">
                        Bem-vindo ao seu espaço de ensino.
                        Acompanhe suas turmas, aulas e atividades
                        em um só lugar.
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm text-blue-200">
                        <CalendarDays size={18} />
                        <span className="capitalize">
                            {dataAtual}
                        </span>
                    </div>
                </div>

                <GraduationCap
                    size={220}
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -bottom-16 hidden rotate-[-15deg] text-white/10 md:block"
                />

            </section>

            {
                !carregandoAulas && !erroAulas && (
                    <LembreteFinalizacao
                        aulas={aulasParaLembrete}
                        agora={agora}
                    />
                )
            }

            <section
                aria-label="Indicadores do professor"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
                {indicadores.map((indicador) => (
                    <ProfessorStatCard
                        key={indicador.titulo}
                        titulo={indicador.titulo}
                        valor={indicador.valor}
                        icone={indicador.icone}
                    />
                ))}
            </section>

            {carregandoAulas ? (
                <p className="text-slate-500">
                    Carregando suas aulas...
                </p>
            ) : erroAulas ? (
                <p role="alert" className="text-red-600">
                    {erroAulas}
                </p>
            ) : (
                <>
                    <ProximaAulaCard aula={proximaAula} />

                    <AgendaResumo aulas={agenda} />
                </>
            )}
        </div>
    );
}