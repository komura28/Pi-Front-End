
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaHandshake,
    FaUsers
} from "react-icons/fa";

import { Carousel } from "../../components/Carousel";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/logo.png";

export function HomePublicaPage() {
    const { user, isAuthenticated } = useAuth();

    const rotaPainel =
        user?.papelUsuario === "ADM"
            ? "/app/home"
            : user?.papelUsuario === "ALUNO"
                ? "/api/home"
                : null;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0F172A]">
                <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">

                    <Link
                        to="/"
                        aria-label="Página inicial do Aticurando"
                        className="flex items-center"
                    >
                        <img
                            src={logo}
                            alt="Aticurando"
                            className="h-14 w-auto object-contain"
                        />
                    </Link>

                    <nav
                        aria-label="Navegação principal"
                        className="flex flex-wrap items-center gap-2 sm:gap-4"
                    >
                        <a
                            href="#sobre"
                            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-block"
                        >
                            Sobre Nós
                        </a>

                        {isAuthenticated && rotaPainel ? (
                            <Link
                                to={rotaPainel}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Acessar meu painel
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-lg border border-slate-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                                >
                                    Entrar
                                </Link>

                                <Link
                                    to="/cadastro"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Cadastre-se
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">

                <section className="flex flex-col items-center justify-center px-4 py-14 text-center md:py-20">

                    <span className="mb-5 rounded-full bg-blue-50 px-5 py-2 text-xs font-bold tracking-wider text-blue-700">
                        CULTURA • EDUCAÇÃO • COMUNIDADE
                    </span>

                    <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        Bem-vindo à{" "}
                        <span className="text-blue-600">
                            Aticurando!
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                        Um espaço de aprendizado, oportunidades e transformação
                        social. Descubra como podemos construir um futuro melhor
                        por meio da educação e da cultura.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="#sobre"
                            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Conheça nosso projeto
                        </a>

                        <Link
                            to="/cadastro"
                            className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                        >
                            Faça parte
                        </Link>
                    </div>

                </section>


                <section
                    aria-label="Apresentação do Aticurando"
                    className="mx-auto max-w-7xl px-4 pt-8 sm:px-6"
                >
                    <Carousel />
                </section>

                <section
                    id="sobre"
                    className="scroll-mt-24 px-4 py-20 sm:px-6"
                >
                    <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">

                        <div>
                            <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                Conheça o Aticurando
                            </span>

                            <h1 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                                Sobre Nós
                            </h1>

                            <div className="space-y-4 text-base leading-8 text-slate-600">
                                <p>
                                    O Aticurando é uma iniciativa voltada
                                    à cultura, à educação e à transformação
                                    social em Atibaia.
                                </p>

                                <p>
                                    Nosso trabalho busca aproximar pessoas,
                                    incentivar a participação na comunidade
                                    e ampliar oportunidades de aprendizado
                                    e desenvolvimento.
                                </p>

                                <p>
                                    Por meio de projetos educacionais,
                                    atividades culturais e iniciativas
                                    colaborativas, procuramos contribuir
                                    para uma comunidade mais participativa.
                                </p>
                            </div>

                            <Link
                                to={isAuthenticated && rotaPainel
                                    ? rotaPainel
                                    : "/cadastro"
                                }
                                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                {isAuthenticated && rotaPainel
                                    ? "Acessar meu painel"
                                    : "Faça parte do projeto"}

                                <FaArrowRight />
                            </Link>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-blue-700 p-8 text-white shadow-xl sm:p-12">
                            <FaHandshake
                                aria-hidden="true"
                                className="mb-6 text-5xl text-blue-200"
                            />

                            <h2 className="mb-4 text-2xl font-bold">
                                Nossa Missão
                            </h2>

                            <p className="text-lg leading-8 text-blue-100">
                                Promover oportunidades de aprendizado,
                                fortalecer vínculos comunitários e
                                incentivar a cultura como instrumento
                                de transformação social.
                            </p>

                            <div className="mt-8 border-t border-white/20 pt-6">
                                <p className="text-sm font-medium text-blue-100">
                                    Cultura, educação e comunidade.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ATIVIDADES */}
                <section className="bg-white px-4 py-20 sm:px-6">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-3 text-3xl font-bold text-slate-900">
                                O que você encontra aqui?
                            </h2>

                            <p className="mx-auto max-w-2xl text-slate-600">
                                Conheça algumas das oportunidades que
                                o projeto procura oferecer à comunidade.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">

                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                                    <FaBookOpen />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-slate-800">
                                    Cursos e Aprendizado
                                </h3>

                                <p className="leading-7 text-slate-600">
                                    Acesse oportunidades de capacitação
                                    e desenvolva novos conhecimentos
                                    por meio das atividades disponíveis.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                                    <FaUsers />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-slate-800">
                                    Comunidade
                                </h3>

                                <p className="leading-7 text-slate-600">
                                    Participe de iniciativas que promovem
                                    a integração entre pessoas e o
                                    fortalecimento da comunidade.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                                    <FaHandshake />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-slate-800">
                                    Impacto Social
                                </h3>

                                <p className="leading-7 text-slate-600">
                                    Conheça projetos que valorizam
                                    a cultura, a colaboração e o
                                    desenvolvimento social.
                                </p>
                            </article>

                        </div>
                    </div>
                </section>

                <section className="mx-auto mb-12 w-[95%] max-w-7xl rounded-2xl bg-gradient-to-br from-[#0F172A] to-blue-700 px-4 py-16 text-center text-white">
                    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Faça parte do Aticurando!
                        </h2>

                        <p className="mb-8 text-lg text-blue-100">
                            Crie sua conta para conhecer as turmas
                            disponíveis e participar das oportunidades
                            oferecidas pelo projeto.
                        </p>

                        <Link
                            to={isAuthenticated && rotaPainel
                                ? rotaPainel
                                : "/cadastro"
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
                        >
                            {isAuthenticated && rotaPainel
                                ? "Ir para meu painel"
                                : "Cadastre-se gratuitamente"}

                            <FaArrowRight />
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
