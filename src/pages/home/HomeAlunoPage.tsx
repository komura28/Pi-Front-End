import { useEffect, useState } from "react";
import { getCurso, getTurma } from "../../services/authService";
import type { authCurso, authTurma } from "../../types/auth/auth-types";
import { Card } from "../../components/Card";




export function HomeAlunoPage() {

    const [cursos, setCursos] = useState<authCurso[]>([]);
    const [turmas, setTurmas] = useState<authTurma[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        async function carregarCursos() {
            try {
                setLoading(true);
                const data = await getCurso();
                setCursos(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados do curso: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados do curso");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarCursos();

        async function carregarTurmas() {
            try {
                setLoading(true);
                const data = await getTurma();
                console.log("getTurma response:", data);

                if (Array.isArray(data)) {
                    setTurmas(data);
                } else if (data && Array.isArray((data as any).turmas)) {
                    setTurmas((data as any).turmas);
                } else if (data && Array.isArray((data as any).data)) {
                    setTurmas((data as any).data);
                } else if (data) {
                    setTurmas([data as any]);
                } else {
                    setTurmas([]);
                }
            } catch (error) {
                console.error("Erro ao buscar turmas", error);
                if (error instanceof Error) {
                    setError(`Erro ao carregar os dados da turma: ${error.message}`);
                } else {
                    setError("Erro ao carregar os dados da turma");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarTurmas();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">
                Bem-vindo a Aticurando!
            </h1>

            <p className="mb-8 text-gray-600">
                Confira as oportunidades disponíveis e candidate-se.
            </p>

        {
            turmas.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {turmas.map((turma) => (
                        <Card
                            key={turma._id}
                            turma={turma}
                            
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">Nenhuma turma disponível no momento.</p>
            )
        }
        </main>
    );
}