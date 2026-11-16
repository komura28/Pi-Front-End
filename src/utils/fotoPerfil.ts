import { api } from "../services/api";

export function obterUrlFoto(photo?: string | null): string | null {
    if (!photo?.trim()) return null;

    if (/^https?:\/\//i.test(photo)) return photo;

    const base = api.defaults.baseURL ?? window.location.origin;
    const origemApi = new URL(base, window.location.origin).origin;
    const caminho = photo.startsWith("/") ? photo : `/${photo}`;

    return new URL(caminho, origemApi).toString();
}
