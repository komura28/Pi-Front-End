

export function PerfilPage() {
    return (
        <div>
            <h1>Meu Perfil</h1>
            <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                <div className="flex flex-col gap-2">
                        <label
                            htmlFor="nome"
                            className="text-slate-800 font-medium"
                        >
                            Nome 
                        </label>

                        <input
                            id="nome"
                            type="text"
                            placeholder="Erick Komura"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                        <label
                            htmlFor="email"
                            className="text-slate-800 font-medium"
                        >
                            E-mail 
                        </label>

                        <input
                            id="email"
                            type="text"
                            placeholder="erickkomura@gmail.com"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                        <label
                            htmlFor="cpf"
                            className="text-slate-800 font-medium"
                        >
                            CPF 
                        </label>

                        <input
                            id="cpf"
                            type="text"
                            placeholder="123.456.789-00"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                        <label
                            htmlFor="dtNascimento"
                            className="text-slate-800 font-medium"
                        >
                            Data de Nascimento 
                        </label>

                        <input
                            id="dtNascimento"
                            type="text"
                            placeholder="01/01/1990"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-900"
                            disabled
                        />
                    </div>
            </section>
        </div>
    )
}