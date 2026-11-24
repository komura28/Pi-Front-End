import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Award,
    BadgeCheck,
    CalendarDays,
    Download,
    ExternalLink,
    GraduationCap,
    Clock3
} from "lucide-react";

import {
    getMeusCertificados,
    baixarCertificado
} from "../../services/certificadoService";

import type {
    CertificadoEmitido
} from "../../types/certificado/certificado-types";

import { PageHeader } from "../../components/ui/PageHeader";

function formatarData(data: string) {
    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return "Data não informada";
    }

    return valor.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
}

function formatarHoras(minutos: number) {
    return (minutos / 60).toLocaleString("pt-BR", {
        maximumFractionDigits: 2
    });
}

export function MeusCertificadosPage() {
    const [certificados, setCertificados] =
        useState<CertificadoEmitido[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [baixandoId, setBaixandoId] =
        useState<string | null>(null);

    useEffect(() => {
        let ativo = true;

        async function carregarCertificados() {
            try {
                const dados = await getMeusCertificados();

                if (ativo) {
                    setCertificados(dados);
                }
            } catch (error) {
                console.error(error);

                if (ativo) {
                    setErro(
                        "Não foi possível carregar seus certificados."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        void carregarCertificados();

        return () => {
            ativo = false;
        };
    }, []);

    async function baixar(certificado: CertificadoEmitido) {
        if (baixandoId) return;

        setBaixandoId(certificado._id);
        setErro("");

        try {
            await baixarCertificado(
                certificado._id,
                certificado.codigoVerificacao
            );
        } catch (error) {
            console.error(error);
            setErro(
                "Não foi possível baixar o certificado. Tente novamente."
            );
        } finally {
            setBaixandoId(null);
        }
    }

    const totalCursos = new Set(
        certificados.map((item) => item.nomeCurso)
    ).size;

    return (
        <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
            <PageHeader
                titulo="Meus Certificados"
                descricao="Consulte e baixe os certificados dos cursos que você concluiu."
                categoria="ÁREA DO ALUNO"
                icone={Award}
            />

            {erro && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {erro}
                </div>
            )}

            {carregando ? (
                <p role="status" className="py-12 text-center text-slate-500">
                    Carregando seus certificados...
                </p>
            ) : (
                <div className="space-y-6">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <Award
                                size={23}
                                className="text-blue-600"
                            />

                            <p className="mt-3 text-sm text-slate-500">
                                Certificados emitidos
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {certificados.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <GraduationCap
                                size={23}
                                className="text-blue-600"
                            />

                            <p className="mt-3 text-sm text-slate-500">
                                Cursos certificados
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {totalCursos}
                            </p>
                        </div>
                    </div>

                    {certificados.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                            <Award
                                size={44}
                                className="mx-auto text-slate-400"
                            />

                            <h2 className="mt-4 text-lg font-bold text-slate-800">
                                Nenhum certificado emitido
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Os certificados aparecerão aqui
                                após a conclusão do curso e a
                                emissão pelo administrador.
                            </p>

                            <Link
                                to="/api/cursos"
                                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Ver meus cursos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {certificados.map((certificado) => (
                                <article
                                    key={certificado._id}
                                    className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-700">
                                                <Award size={24} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                                    Certificado de conclusão
                                                </p>

                                                <h2 className="mt-1 break-words text-lg font-bold text-slate-800">
                                                    {certificado.nomeCurso}
                                                </h2>
                                            </div>
                                        </div>

                                        <BadgeCheck
                                            size={24}
                                            className="shrink-0 text-green-600"
                                            aria-label="Certificado emitido"
                                        />
                                    </div>

                                    <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Clock3 size={17} />
                                            <span>
                                                {formatarHoras(certificado.cargaHorariaMinutos)}
                                                {" horas"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <GraduationCap size={17} />
                                            <span>
                                                Frequência: {certificado.frequenciaPercentual}%
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 sm:col-span-2">
                                            <CalendarDays size={17} />
                                            <span>
                                                Emitido em{" "}
                                                {formatarData(certificado.emitidoEm)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <p className="text-xs font-semibold text-slate-500">
                                            Código de verificação
                                        </p>

                                        <p className="mt-1 break-all font-mono text-xs text-slate-700">
                                            {certificado.codigoVerificacao}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                                        <button
                                            type="button"
                                            disabled={baixandoId !== null}
                                            onClick={() => {
                                                void baixar(certificado);
                                            }}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                                        >
                                            <Download size={18} />

                                            {baixandoId === certificado._id
                                                ? "Baixando..."
                                                : "Baixar PDF"}
                                        </button>

                                        <Link
                                            to={`/validar-certificado/${certificado.codigoVerificacao}`}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <ExternalLink size={17} />
                                            Verificar
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}