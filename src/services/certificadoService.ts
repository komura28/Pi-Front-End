import { api } from "./api";

import type {
    CertificadoEmitido,
    ElegibilidadeTurma,
    ResultadoEmissao,
    ResultadoValidacao
} from "../types/certificado/certificado-types";

import type { TurmaMatricula } from "../types/auth/auth-types";

export async function getTurmasParaCertificados():
    Promise<TurmaMatricula[]> {
    const response = await api.get<TurmaMatricula[]>("/turma", {
        params: { incluirInativas: true }
    });

    return response.data;
}

export async function getElegibilidadeTurma(
    turmaId: string
): Promise<ElegibilidadeTurma> {
    const response = await api.get<ElegibilidadeTurma>(
        `/certificado/turmas/${turmaId}/elegibilidade`
    );

    return response.data;
}

export async function getCertificadosEmitidos(
    turmaId: string
): Promise<CertificadoEmitido[]> {
    const response = await api.get<CertificadoEmitido[]>(
        `/certificado/turmas/${turmaId}/emitidos`
    );

    return response.data;
}

export async function emitirCertificado(
    matriculaId: string
): Promise<ResultadoEmissao> {
    const response = await api.post<ResultadoEmissao>(
        `/certificado/emitir/${matriculaId}`
    );

    return response.data;
}

export async function getMeusCertificados():
    Promise<CertificadoEmitido[]> {
    const response = await api.get<CertificadoEmitido[]>(
        "/certificado/meus"
    );

    return response.data;
}

export async function validarCertificado(
    codigo: string
): Promise<ResultadoValidacao> {
    const response = await api.get<ResultadoValidacao>(
        `/certificado/validar/${encodeURIComponent(codigo)}`
    );

    return response.data;
}

export async function baixarCertificado(
    certificadoId: string,
    codigoVerificacao: string
): Promise<void> {
    const response = await api.get<Blob>(
        `/certificado/${certificadoId}/pdf`,
        {
            responseType: "blob"
        }
    );

    const url = URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = `certificado-${codigoVerificacao}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}
