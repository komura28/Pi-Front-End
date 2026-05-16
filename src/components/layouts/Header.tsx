

export function Header() {
    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
                <div>
                    <p className="text-sm text-muted-foreground">Bem-vindo a </p>
                    <h1 className="text-lg font-semibold">Aticurando</h1>
                </div>

                 <div className="flex items-center gap-3">
                    {/* Botão de Login com o Ícone */}
                    <button 
                        className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        aria-label="Fazer login"
                    >
                        <svg 
                            xmlns="http://w3.org" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2} 
                            stroke="currentColor" 
                            className="size-5"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" 
                            />
                        </svg>
                    </button>
                </div>
            </header>
        </>
    );
}