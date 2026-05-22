import { useNavigate } from "react-router-dom";
import perfilImage from "../../assets/perfil.png"

export function Header() {
    const navigate = useNavigate();

    return (
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
                <div>
                    <p className="text-sm text-muted-foreground">Bem-vindo a </p>
                    <h1 className="text-lg font-semibold">Aticurando</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        onClick={() => navigate("/app/perfil")}
                        className="cursor-pointer max-w-sm rounded h-10 w-10 overflow-hidden">
                        <img src={perfilImage} alt="Foto de Perfil" />
                    </div>
                </div>
            </header>
    );
}