import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    BadgeCheck,
    CircleAlert,
    Home,
    ShieldCheck
} from "lucide-react";

import {
    validarCertificado
} from "../../services/certificadoService";

import type {
    ResultadoValidacao
} from "../../types/certificado/certificado-types";

import logo from "../../assets/logo.png";

function formatarData(data: string) {
    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return "Data indisponível";
    }

    return valor.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
}

export function ValidarCertificadoPage() {
    const { codigo } = useParams<{ codigo: string }>();

    const codigoNormalizado =
        (codigo ?? "").trim().toUpperCase();

    const [resultado, setResultado] =
        useState<ResultadoValidacao | null>(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function consultar() {
            try {
                const dados = await validarCertificado(
                    codigoNormalizado
                );

                if (ativo) {
                    setResultado(dados);
                    setErro("");
                }
            } catch (error) {
                console.error(error);

                if (ativo) {
                    setErro(
                        "Não foi possível consultar a autenticidade. Tente novamente."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        if (!codigoNormalizado) {
            return;
        }

        void consultar();

        return () => {
            ativo = false;
        };
    }, [codigoNormalizado]);

    return (
        <main className="flex min-h-dvh flex-col bg-slate-50">
            <header className="bg-[#0F172A] px-4 py-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                    <Link
                        to="/"
                        aria-label="Página inicial do Aticurando"
                    >
                        <img
                            src={logo}
                            alt="Aticurando"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    <span className="text-xs font-semibold text-blue-200 sm:text-sm">
                        Verificação de autenticidade
                    </span>
                </div>
            </header>

            <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

                    <div className="bg-gradient-to-r from-[#0F172A] to-blue-800 p-6 text-white sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-white/10 p-3">
                                <ShieldCheck size={27} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                                    Aticurando
                                </p>

                                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                                    Validar certificado
                                </h1>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-blue-100">
                            Consulte a autenticidade de um certificado
                            emitido pelo Aticurando.
                        </p>
                    </div>

                    <div className="space-y-6 p-5 sm:p-8">

                        {carregando ? (
                            <div
                                role="status"
                                className="py-10 text-center text-slate-500"
                            >
                                Consultando certificado...
                            </div>
                        ) : erro ? (
                            <div
                                role="alert"
                                className="rounded-xl border border-amber-200 bg-amber-50 p-5"
                            >
                                <CircleAlert
                                    size={32}
                                    className="text-amber-600"
                                />

                                <p className="mt-3 font-semibold text-amber-900">
                                    Não foi possível concluir a consulta
                                </p>

                                <p className="mt-2 text-sm text-amber-800">
                                    {erro}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="mt-4 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : resultado?.valido ? (
                            <div className="space-y-6">

                                <div className="text-center">
                                    <BadgeCheck
                                        size={52}
                                        className="mx-auto text-green-600"
                                    />

                                    <h2 className="mt-4 text-2xl font-bold text-green-700">
                                        Certificado válido
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Este certificado consta nos registros
                                        do Aticurando.
                                    </p>
                                </div>

                                <dl className="space-y-4 rounded-xl bg-slate-50 p-5">
                                    <div>
                                        <dt className="text-xs font-semibold text-slate-500">
                                            Aluno
                                        </dt>

                                        <dd className="mt-1 break-words font-semibold text-slate-800">
                                            {resultado.nomeAluno}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold text-slate-500">
                                            Curso
                                        </dt>

                                        <dd className="mt-1 break-words font-semibold text-slate-800">
                                            {resultado.nomeCurso}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold text-slate-500">
                                            Carga horária
                                        </dt>

                                        <dd className="mt-1 text-slate-800">
                                            {resultado.cargaHorariaHoras.toLocaleString("pt-BR")} horas
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold text-slate-500">
                                            Data de emissão
                                        </dt>

                                        <dd className="mt-1 text-slate-800">
                                            {formatarData(resultado.emitidoEm)}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold text-slate-500">
                                            Código de autenticidade
                                        </dt>

                                        <dd className="mt-1 break-all font-mono text-xs text-slate-800">
                                            {resultado.codigoVerificacao}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <CircleAlert
                                    size={48}
                                    className="mx-auto text-red-600"
                                />

                                <h2 className="mt-4 text-xl font-bold text-red-700">
                                    Certificado não encontrado
                                </h2>

                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    O código informado não corresponde
                                    a nenhum certificado registrado.
                                    Confira o código no documento.
                                </p>
                            </div>
                        )}

                        <div className="border-t border-slate-200 pt-5">
                            <p className="mb-3 break-all text-xs text-slate-500">
                                Código consultado: {codigoNormalizado}
                            </p>

                            <Link
                                to="/"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Home size={18} />
                                Voltar à página inicial
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    A validação confirma o registro eletrônico
                    do certificado no sistema Aticurando.
                </p>
            </section>
        </main>
    );
}
