import { FaInstagram, FaEnvelope, FaPhone, FaYoutube, FaWhatsapp } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="mt-auto w-full min-w-0 border-t border-slate-800 bg-[#0F172A] text-slate-300">

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-2">

                {/* SOBRE */}
                <div className="min-w-0 md:justify-self-start">
                    <h2 className="text-white font-semibold text-lg mb-3">
                        Aticurando
                    </h2>

                    <p className="break-words text-sm leading-relaxed text-slate-400">
                        Cultura, educação e transformação social em Atibaia.
                        Conectando pessoas através de projetos educacionais,
                        capacitação profissional e iniciativas de impacto social.
                    </p>
                </div>

                {/* CONTATO */}
                <div className="min-w-0 md:justify-self-end">
                    <h2 className="text-white font-semibold text-lg mb-3">
                        Contato
                    </h2>

                    <div className="min-w-0 space-y-3 text-sm">
                        <p className="flex min-w-0 items-start gap-2 break-words">
                            <FaPhone />
                            +55 11 96286-5972
                        </p>

                        <p className="flex min-w-0 items-start gap-2 break-words">
                            <FaEnvelope />
                            contato@aticurando.org
                        </p>

                        <a
                            href="https://instagram.com/aticurando"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-w-0 items-center gap-2 break-words transition hover:text-white"
                        >
                            <FaInstagram />
                            @aticurando
                        </a>
                        <a
                            href="https://www.youtube.com/@Aticurando"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-w-0 items-center gap-2 break-words transition hover:text-white"
                        >
                            <FaYoutube />
                            @aticurando
                        </a>
                    </div>
                </div>

            </div>

            {/* BOTÃO WHATSAPP */}
            <div className="mx-auto w-full max-w-md px-4 pb-8 sm:px-6">
                <a
                    href="https://wa.me/5511962865972?text=Olá!%20Preciso%20de%20suporte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full min-w-0 items-center justify-center gap-2.5 rounded-xl bg-green-500 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-600 hover:shadow-lg sm:px-4"
                >
                    <FaWhatsapp className="text-lg shrink-0" />
                    Falar com suporte no WhatsApp
                </a>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-800 px-4 py-4 text-center text-xs leading-relaxed text-slate-500">
                © {new Date().getFullYear()} Aticurando. Todos os direitos reservados.
            </div>

        </footer>
    );
}