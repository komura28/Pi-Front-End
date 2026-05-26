import { Button } from "../../components/Button";



const isSubmitting = false;

export function CursoPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Cadastro de Curso
                </h1>

                <p className="text-slate-600 mb-8">
                    Preencha as informações do curso abaixo.
                </p>

                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="nome"
                            className="text-slate-800 font-medium"
                        >
                            Nome do Curso
                        </label>

                        <input
                            id="nome"
                            type="text"
                            placeholder="Digite o nome do curso"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="descricao"
                            className="text-slate-800 font-medium"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            placeholder="Digite a descrição do curso"
                            rows={4}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-900"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="materias"
                            className="text-slate-800 font-medium"
                        >
                            Matérias
                        </label>

                        <textarea
                            id="materias"
                            placeholder="Ex: palhaço, malabares, acrobacia..."
                            rows={4}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-900"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition houver:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Entrando..." : "Cadastrar"}
                    </button>


                </form>
            </section>
        </div>
    );
}