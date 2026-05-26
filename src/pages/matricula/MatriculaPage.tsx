//import { useState } from "react";
import { Button } from "../../components/Button";

 const isSubmitting =(false);

export function MatriculaPage() {
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
                                Aluno
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
                        <tr>
                            <td className="text-slate-600 p-2 border-b">
                                Matos
                            </td>

                            <td className="text-slate-600 p-2 border-b">
                                123.456.789-00
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
                    </tbody>
                </table>
            </section>
        </div>
    )
}