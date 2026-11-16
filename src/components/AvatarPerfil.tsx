import { useState } from "react";
import { UserRound } from "lucide-react";
import { obterUrlFoto } from "../utils/fotoPerfil";

type TamanhoAvatar = "sm" | "lg";

interface AvatarPerfilProps {
    foto?: string | null;
    nome?: string;
    tamanho?: TamanhoAvatar;
}

const tamanhos = {
    sm: "h-11 w-11",
    lg: "h-28 w-28 sm:h-32 sm:w-32",
} as const;

export function AvatarPerfil({
    foto,
    nome = "Usuário",
    tamanho = "sm",
}: AvatarPerfilProps) {
    const url = obterUrlFoto(foto);
    const [erroFoto, setErroFoto] = useState<{
        url: string;
        falhou: boolean;
    } | null>(null);
    const falhou = erroFoto?.url === url && erroFoto.falhou;

    return (
        <div
            className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/25 bg-slate-700 text-blue-100 ${tamanhos[tamanho]}`}
        >
            {url && !falhou ? (
                <img
                    src={url}
                    alt={`Foto de perfil de ${nome}`}
                    className="h-full w-full object-cover"
                    onError={() => setErroFoto({ url, falhou: true })}
                />
            ) : (
                <UserRound
                    aria-hidden="true"
                    size={tamanho === "lg" ? 48 : 22}
                />
            )}
        </div>
    );
}
