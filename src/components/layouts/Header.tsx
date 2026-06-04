import { useNavigate } from "react-router-dom";
import perfilImage from "../../assets/perfil.png"
import { useAuth } from "../../hooks/useAuth";


export function Header() {
    const navigate = useNavigate();
    const { user } = useAuth() as { user?: { papelUsuario?: string } };

    async function handlePerfil() {
        if (user?.papelUsuario === "ALUNO") {
            navigate("/api/perfil");
        } else if (user?.papelUsuario === "ADM") {
            navigate("/app/perfil");
        }
    }
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-blue-800 px-6">
            <div>
                <p className="text-sm text-muted-foreground">Bem-vindo a </p>
                <h1 className="text-lg font-semibold">Aticurando</h1>
            </div>

            <div className="flex items-center gap-3">
                <div
                    onClick={handlePerfil}
                    className="cursor-pointer max-w-sm rounded h-10 w-10 overflow-hidden">
                    <img src={perfilImage} alt="Foto de Perfil" />
                </div>
            </div>
        </header>
    );
}