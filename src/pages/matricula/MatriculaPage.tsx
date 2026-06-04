//import { useState } from "react";
import { useEffect, useState } from "react";
import { getMatricula } from "../../services/matriculaService";
import type { authMatricula } from "../../types/matricula/matricula-types";

 const isSubmitting =(false);

export function MatriculaPage() {
    const [matriculas, setMatriculas] = useState<authMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
        useEffect(() => { //useEffect é um hook
            async function buscarMatriculasPendentes() {
                try {
                    setError("");
                    const data = await getMatricula();
                    setMatriculas(data);
                } catch (error) {
                    setError("Erro ao carregar os dados do Servidor");
                } finally {
                    setLoading(false);
            }
            }

            buscarMatriculasPendentes();
        }, []);
    
        if (loading) {
            return <div className="p-8"><p>Carregando...</p></div>;
        }
    
        if (error) {
            return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
        }
    
        if (matriculas.length === 0) {
            return <div className="p-8"><p>NenhumA Matrícula Encontrado</p></div>;
        }

    return (
          <div>
            <section>
                <h1>
                    Lista de Matrículas
                </h1>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Curso</th>
                            <th>Turma</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matriculas.map((matricula) => (
                        <tr key={matricula._id}>
                            <td>{matricula.user.name}</td>
                            <td>{matricula.user.cpf}</td>
                            <td>{matricula.turma.curso.name}</td>
                            <td>{matricula.turma.turno}</td>
                            <td>{matricula.status}</td>
                        </tr>
            ))}
                    </tbody>
                </table>


            </section>
          </div>
    )
}