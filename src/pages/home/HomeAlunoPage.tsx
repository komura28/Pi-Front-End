import { useEffect, useState } from "react";
import { getTurma } from "../../services/authService";
import type { TurmaMatricula } from "../../types/auth/auth-types";
import { CardTurma } from "../../components/CardTurma";
import { Carousel } from "../../components/Carousel";
import { FaSearch } from "react-icons/fa";



const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();


export function HomeAlunoPage() {

    const [turmas, setTurmas] = useState<TurmaMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 6;

    const [busca, setBusca] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarTurmas() {
            try {
                setLoading(true);
                setError("");

                const data = await getTurma();

                if (ativo) {
                    setTurmas(data);
                }

            } catch (error) {
                if (!ativo) return;

                console.error("Erro ao buscar turmas:", error);

                setError(
                    error instanceof Error
                        ? `Erro ao carregar os dados da turma: ${error.message}`
                        : "Erro ao carregar os dados da turma"
                );

            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        carregarTurmas();

        return () => {
            ativo = false;
        };
    }, []);

    const termoBusca = normalizar(busca.trim());

    const turmasFiltradas = turmas.filter(({ turma }) =>
        [
            turma.curso?.name,
            turma.curso?.description,
            turma.turno
        ].some((campo) =>
            normalizar(campo ?? "").includes(termoBusca)
        )
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;

    const totalPaginas = Math.ceil(turmasFiltradas.length / itensPorPagina);
    const turmasPaginadas = turmasFiltradas.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );

    if (loading) {
        return (
            <div className="p-8">
                <p>Carregando turmas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-700 p-8 text-white shadow-lg">
                <h1 className="text-4xl font-bold">
                    Bem-vindo à Aticurando!
                </h1>

                <p className="mt-2 text-blue-100">
                    Descubra novas turmas e desenvolva seu talento artístico.
                </p>
            </div>

            <div className="mb-10 overflow-hidden rounded-2xl shadow-lg">
                <Carousel />
            </div>

            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Confira as oportunidades disponíveis e candidate-se:
            </h2>

            <div className="relative mb-6 max-w-xl">
                <FaSearch
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                />

                <input
                    type="search"
                    value={busca}
                    onChange={(e) => {
                        setBusca(e.target.value);
                        setPaginaAtual(1);
                    }}
                    placeholder="Pesquise por curso, descrição ou turno..."
                    aria-label="Pesquisar turmas"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            {turmasFiltradas.length > 0 ? (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {turmasPaginadas.map((turma) => (
                            <CardTurma
                                key={turma.turma._id}
                                turma={turma}
                            />
                        ))}
                    </div>

                    {totalPaginas > 1 && (
                        <nav
                            aria-label="Paginação das turmas"
                            className="flex justify-center items-center gap-2 mt-6"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setPaginaAtual((p) => Math.max(p - 1, 1))
                                }
                                disabled={paginaAtual === 1}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Anterior
                            </button>

                            <span className="text-slate-600" aria-live="polite">
                                Página {paginaAtual} de {totalPaginas}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setPaginaAtual((p) =>
                                        Math.min(p + 1, totalPaginas)
                                    )
                                }
                                disabled={paginaAtual === totalPaginas}
                                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Próxima
                            </button>
                        </nav>
                    )}
                </>
            ) : (
                <p className="text-gray-600">
                    {busca.trim()
                        ? "Nenhuma turma encontrada para essa pesquisa."
                        : "Nenhuma turma disponível no momento."}
                </p>
            )}
        </main>
    );
}