import { FaInstagram, FaEnvelope, FaPhone, FaYoutube } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 mt-auto">

            <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* SOBRE */}
                <div md:justify-self-start>
                    <h2 className="text-white font-semibold text-lg mb-3">
                        Aticurando
                    </h2>

                    <p className="text-sm text-slate-400 leading-relaxed">
                        Cultura, educação e transformação social em Atibaia.
                        Conectando pessoas através de projetos educacionais,
                        capacitação profissional e iniciativas de impacto social.
                    </p>
                </div>

                {/* CONTATO */}
                <div className="md:justify-self-end">
                    <h2 className="text-white font-semibold text-lg mb-3">
                        Contato
                    </h2>

                    <div className="space-y-3 text-sm">
                        <p className="flex items-center gap-2">
                            <FaPhone />
                            +55 11 96286-5972
                        </p>

                        <p className="flex items-center gap-2">
                            <FaEnvelope />
                            contato@aticurando.org
                        </p>

                        <a
                            href="https://instagram.com/aticurando"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition"
                        >
                            <FaInstagram />
                            @aticurando
                        </a>
                        <a
                            href="https://www.youtube.com/@Aticurando"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition"
                        >
                            <FaYoutube />
                            @aticurando
                        </a>
                    </div>
                </div>

            </div>

            {/* BOTÃO WHATSAPP */}
            <div className="max-w-md mx-auto px-6 pb-8">
                <a
                    href="https://wa.me/5511962865972?text=Olá!%20Preciso%20de%20suporte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        flex items-center justify-center
                        rounded-xl bg-green-500 px-4 py-3
                        text-sm font-semibold text-white
                        transition
                        hover:bg-green-600 hover:shadow-lg
                    "
                >
                    Falar com suporte no WhatsApp
                </a>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Aticurando. Todos os direitos reservados.
            </div>

        </footer>
    );
}