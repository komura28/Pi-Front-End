import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function UnauthorizedPage() {
    return (
        <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-8">

            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <ShieldAlert size={32} />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    Acesso negado
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Você não possui permissão para acessar esta página.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Voltar ao início
                </Link>

            </section>

        </main>
    );
}