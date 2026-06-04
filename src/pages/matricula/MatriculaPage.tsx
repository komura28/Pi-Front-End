//import { useState } from "react";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import type { authUser } from "../../types/auth/auth-types";
//import { getMatricula } from "../../services/authService";

 const isSubmitting =(false);

export function MatriculaPage() {
    const [users, setUsers] = useState<authUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
        useEffect(() => {
            async function carregarMatriculas() {
                try {
                    setLoading(true);
                    //const data = await getMatricula();
                    //setUsers(data);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(`Erro ao carregar os dados da matrícula: ${error.message}`);
                    } else {
                        setError("Erro ao carregar os dados da matrícula");
                    }
                } finally {
                    setLoading(false);
                }
            }
    
            carregarMatriculas();
        }, []);
    
    
    
        if (loading) {
            return <div className="p-8"><p>Carregando...</p></div>;
        }
    
        if (error) {
            return <div className="p-8 text-red-600"><p>Erro: {error}</p></div>;
        }
    
        if (users.length === 0) {
            return <div className="p-8"><p>Nenhum curso encontrado</p></div>;
        }

    return (
          <div className="min-h-screen bg-white flex items-center justify-center px-1">
            <section className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-slate-300">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lista de Matrículas
                </h1>

                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                Nome
                            </th>

                            <th className="text-left text-slate-800 font-medium p-2 border-b">
                                CPF
                            </th>

                            <th className=" text-slate-800 font-medium p-2 border-b justify-center">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="border-b">
                        {users.map((user) => (
                            <tr key={user._id}>
                            <td className="text-slate-600 p-2 border-b">
                                {user.name}
                            </td>

                            <td className="text-slate-600 p-2 border-b">
                                {user.cpf}
                            </td>

                            <td className="p-2 flex gap-2 justify-center">
                                <Button isSubmitting={isSubmitting} 
                                label="Aprovar"
                                loadingLabel="aprovando" className="bg-green-500 hover:bg-green-600 rounded-md text-white py-1 px-1"/>
                                <Button isSubmitting={isSubmitting}
                                label="Recusar"
                                loadingLabel="recusando" className="bg-red-500 hover:bg-red-600 rounded-md text-white py-1 px-1"/>
                            </td>
                        </tr>
                        ))}
                        
                    </tbody>
                </table>
            </section>
        </div>
    )
}