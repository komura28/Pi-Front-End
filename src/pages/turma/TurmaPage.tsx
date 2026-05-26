import { Button } from "../../components/Button";


const isSubmitting = false;

export function TurmaPage() {
    return (
         <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Cadastro de Turma
                    </h1>

                    <p className="text-slate-600 mb-8">
                        Preencha as informações da turma abaixo.
                    </p>

                    <form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="curso"
                                className="text-slate-800 font-medium"
                            >
                                Curso
                            </label>

                            <select
                                id="curso"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900 bg-white"
                            >
                                <option value="" disabled selected>
                                    Selecione um curso
                                </option>
                                <option value="ads">
                                    Palhaçologia
                                </option>
                                <option value="eng">
                                    Riso
                                </option>
                                <option value="adm">
                                    Felicidade
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="periodo"
                                className="text-slate-800 font-medium"
                            >
                                Período
                            </label>

                            <select
                                id="periodo"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900 bg-white"
                            >
                                <option value="" disabled selected>
                                    Selecione o período
                                </option>
                                <option value="manha">
                                    Manhã
                                </option>
                                <option value="tarde">
                                    Tarde
                                </option>
                                <option value="noite">
                                    Noite
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="contador"
                                className="text-slate-800 font-medium"
                            >
                                Capacidade de Alunos
                            </label>

                            <input
                                id="contador"
                                type="number"
                                min="0"
                                placeholder="Digite a quantidade"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            />
                        </div>

                        <div className="pt-2">
                           <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition houver:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Entrando..." : "Cadastrar"}
                    </button>
                        </div>
                    </form>
                </section>
            </div>
    )
}