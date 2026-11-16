import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
    BadgeCheck,
    CalendarDays,
    Camera,
    CheckCircle2,
    ContactRound,
    HeartPulse,
    LockKeyhole,
    Mail,
    Pencil,
    Phone,
    ShieldCheck,
    UserRound,
    Users,
    X,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { AtualizarFotoPerfilAPI, getMe } from "../../services/authService";
import { editarUser } from "../../services/userService";
import type { authUser } from "../../types/auth/auth-types";
import type { IUpdateUserDTO } from "../../types/user/user-types";
import { formatDate } from "../../utils/formatters";
import { AvatarPerfil } from "../../components/AvatarPerfil";

const ESTADOS_CIVIS = [
    "Solteiro(a)",
    "Casado(a)",
    "Divorciado(a)",
    "Viuvo(a)",
    "Uniao Estavel",
];

const PROFISSOES = [
    "Estudante",
    "Empregado",
    "Autônomo",
    "Desempregado",
    "Aposentado",
];

const PAPEIS: Record<authUser["papelUsuario"], string> = {
    ADM: "Administrador",
    ALUNO: "Aluno",
    PROFESSOR: "Professor",
};

type PerfilForm = {
    name: string;
    dt_nascimento: string;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    profissao_custom: string;
    participacao_anterior: string;
    tem_problema_saude: string;
    problemas_saude_descricao: string;
};

const FORM_VAZIO: PerfilForm = {
    name: "",
    dt_nascimento: "",
    estado_civil: "",
    telefone_principal: "",
    telefone_secundario: "",
    profissao: "",
    profissao_custom: "",
    participacao_anterior: "",
    tem_problema_saude: "",
    problemas_saude_descricao: "",
};

const classeInput =
    "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

function formatarCPF(valor: string | number) {
    const digitos = String(valor).replace(/\D/g, "");
    return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarTelefone(valor: string) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    if (digitos.length <= 10) {
        return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

function mensagemErro(error: unknown, fallback: string): string {
    if (typeof error === "object" && error !== null && "response" in error) {
        const resposta = error as { response?: { data?: { message?: string; error?: string } } };
        return resposta.response?.data?.message ?? resposta.response?.data?.error ?? fallback;
    }
    return fallback;
}

function LinhaInformacao({
    icone: Icon,
    rotulo,
    valor,
}: {
    icone: LucideIcon;
    rotulo: string;
    valor?: string | null;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-4">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                <Icon size={19} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">{rotulo}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {valor?.trim() || "Não informado"}
                </p>
            </div>
        </div>
    );
}

function preencherFormulario(usuario: authUser): PerfilForm {
    const profissao = (usuario.profissao ?? "").trim();
    const problemaSaude = (usuario.problemas_saude ?? "").trim();
    const semProblema = ["não", "nao"].includes(problemaSaude.toLowerCase());
    const ehProfissaoPadrao = PROFISSOES.includes(profissao);

    return {
        name: usuario.name ?? "",
        dt_nascimento: (usuario.dt_nascimento ?? "").split("T")[0] ?? "",
        estado_civil: usuario.estado_civil ?? "",
        telefone_principal: usuario.telefone_principal ?? "",
        telefone_secundario: usuario.telefone_secundario ?? "",
        profissao: profissao === "" ? "" : ehProfissaoPadrao ? profissao : "Outro",
        profissao_custom: profissao !== "" && !ehProfissaoPadrao ? profissao : "",
        participacao_anterior:
            usuario.participacao_anterior === undefined
                ? ""
                : String(usuario.participacao_anterior),
        tem_problema_saude:
            problemaSaude === "" ? "" : semProblema ? "Não" : "Sim",
        problemas_saude_descricao:
            problemaSaude !== "" && !semProblema ? problemaSaude : "",
    };
}

export function PerfilPage() {
    const { user, setUser } = useAuth();

    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [erroFoto, setErroFoto] = useState("");
    const [enviandoFoto, setEnviandoFoto] = useState(false);
    const [sucesso, setSucesso] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [form, setForm] = useState<PerfilForm>(FORM_VAZIO);
    const [erroForm, setErroForm] = useState("");
    const [salvando, setSalvando] = useState(false);

    const inputFotoRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        let ativo = true;
        async function carregarPerfil() {
            try {
                const dados = await getMe();
                if (!ativo) return;
                setUser(dados);
                localStorage.setItem("user", JSON.stringify(dados));
            } catch {
                if (ativo) {
                    setErroCarregamento("Não foi possível atualizar os dados do perfil.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }
        void carregarPerfil();
        return () => { ativo = false; };
    }, [setUser]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (modalAberto && !dialog.open) dialog.showModal();
        if (!modalAberto && dialog.open) dialog.close();
        return () => { if (dialog.open) dialog.close(); };
    }, [modalAberto]);

    function atualizarUsuario(dados: authUser) {
        setUser(dados);
        localStorage.setItem("user", JSON.stringify(dados));
    }

    function abrirEdicao() {
        if (!user) return;
        setForm(preencherFormulario(user));
        setErroForm("");
        setSucesso("");
        setModalAberto(true);
    }

    function setCampo<K extends keyof PerfilForm>(chave: K, valor: PerfilForm[K]) {
        setForm((anterior) => ({ ...anterior, [chave]: valor }));
    }

    async function trocarFoto(event: ChangeEvent<HTMLInputElement>) {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo || !user) return;

        setErroFoto("");
        setSucesso("");
        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            setErroFoto("Selecione uma imagem JPEG, PNG ou WebP.");
            return;
        }
        if (arquivo.size > 5 * 1024 * 1024) {
            setErroFoto("A imagem deve ter no máximo 5 MB.");
            return;
        }

        try {
            setEnviandoFoto(true);
            const resposta = await AtualizarFotoPerfilAPI(arquivo);
            const fotoAtualizada: unknown = resposta.data?.user?.photo;
            if (typeof fotoAtualizada !== "string") {
                throw new Error("A API não retornou o caminho da foto.");
            }
            atualizarUsuario({ ...user, photo: fotoAtualizada });
            setSucesso("Foto de perfil atualizada com sucesso.");
        } catch (error) {
            setErroFoto(mensagemErro(error, "Não foi possível atualizar a foto."));
        } finally {
            setEnviandoFoto(false);
        }
    }

    async function salvarEdicao(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || salvando) return;

        const nome = form.name.trim();
        if (nome.length < 3) {
            setErroForm("O nome deve ter pelo menos 3 caracteres.");
            return;
        }
        if (form.telefone_principal && form.telefone_principal.replace(/\D/g, "").length < 10) {
            setErroForm("Telefone principal inválido.");
            return;
        }
        if (form.telefone_secundario && form.telefone_secundario.replace(/\D/g, "").length < 10) {
            setErroForm("Telefone secundário inválido.");
            return;
        }
        if (form.profissao === "Outro" && !form.profissao_custom.trim()) {
            setErroForm("Especifique sua profissão.");
            return;
        }
        if (user.papelUsuario === "ALUNO" && form.tem_problema_saude === "Sim" && !form.problemas_saude_descricao.trim()) {
            setErroForm("Descreva o problema de saúde.");
            return;
        }

        const payload: IUpdateUserDTO = {
            name: nome,
            dt_nascimento: form.dt_nascimento || undefined,
            estado_civil: form.estado_civil || undefined,
            telefone_principal: form.telefone_principal || undefined,
            telefone_secundario: form.telefone_secundario.trim(),
            profissao: form.profissao === "Outro"
                ? form.profissao_custom.trim()
                : form.profissao,
        };
        if (user.papelUsuario === "ALUNO") {
            if (form.participacao_anterior !== "") {
                payload.participacao_anterior = form.participacao_anterior === "true";
            }
            if (form.tem_problema_saude === "Sim") {
                payload.problemas_saude = form.problemas_saude_descricao.trim();
            } else if (form.tem_problema_saude === "Não") {
                payload.problemas_saude = "Não";
            }
        }

        try {
            setSalvando(true);
            setErroForm("");
            const atualizado = await editarUser(payload);
            atualizarUsuario({
                ...user,
                ...atualizado,
                id: atualizado?.id ?? atualizado?._id ?? user.id,
            } as authUser);
            setModalAberto(false);
            setSucesso("Dados pessoais atualizados com sucesso.");
        } catch (error) {
            setErroForm(mensagemErro(error, "Não foi possível salvar o perfil."));
        } finally {
            setSalvando(false);
        }
    }

    if (carregando && !user) {
        return <p className="p-8 text-slate-500">Carregando seu perfil...</p>;
    }
    if (!user) {
        return <p role="alert" className="p-8 text-red-600">Nenhum usuário encontrado.</p>;
    }

    const ehAluno = user.papelUsuario === "ALUNO";
    const opcoesEstadoCivil = form.estado_civil && !ESTADOS_CIVIS.includes(form.estado_civil)
        ? [...ESTADOS_CIVIS, form.estado_civil]
        : ESTADOS_CIVIS;

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] to-blue-800 p-6 text-white shadow-lg sm:p-8">
                <UserRound aria-hidden="true" size={220} className="pointer-events-none absolute -bottom-20 -right-10 hidden rotate-[-14deg] text-white/10 md:block" />

                <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <div className="relative">
                        <AvatarPerfil foto={user.photo} nome={user.name} tamanho="lg" />
                        <button
                            type="button"
                            onClick={() => inputFotoRef.current?.click()}
                            disabled={enviandoFoto}
                            aria-label="Alterar foto de perfil"
                            title="Alterar foto de perfil"
                            className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-600 p-2 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                        >
                            <Camera size={18} aria-hidden="true" />
                        </button>
                        <input
                            ref={inputFotoRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(event) => { void trocarFoto(event); }}
                            aria-label="Selecionar foto de perfil"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold tracking-wide text-blue-200">MEU PERFIL</p>
                        <h1 className="mt-2 break-words text-3xl font-bold">{user.name}</h1>
                        <p className="mt-2 break-all text-sm text-slate-200">{user.email}</p>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                            <BadgeCheck size={15} aria-hidden="true" />
                            {PAPEIS[user.papelUsuario]}
                        </div>
                        <p className="mt-3 text-xs text-blue-100">
                            {enviandoFoto ? "Enviando foto..." : "Foto: JPEG, PNG ou WebP, até 5 MB"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={abrirEdicao}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                    >
                        <Pencil size={17} aria-hidden="true" />
                        Editar dados
                    </button>
                </div>
            </section>

            {erroCarregamento && (
                <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{erroCarregamento}</p>
            )}
            {erroFoto && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erroFoto}</p>
            )}
            {sucesso && (
                <p role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {sucesso}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
                            <ContactRound size={22} className="text-blue-600" aria-hidden="true" />
                            Informações pessoais
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <LinhaInformacao icone={UserRound} rotulo="Nome completo" valor={user.name} />
                            <LinhaInformacao icone={CalendarDays} rotulo="Data de nascimento" valor={user.dt_nascimento ? formatDate(user.dt_nascimento) : undefined} />
                            <LinhaInformacao icone={Users} rotulo="Estado civil" valor={user.estado_civil} />
                            <LinhaInformacao icone={ContactRound} rotulo="Profissão" valor={user.profissao} />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
                            <Phone size={22} className="text-blue-600" aria-hidden="true" />
                            Contato
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <LinhaInformacao icone={Phone} rotulo="Telefone principal" valor={user.telefone_principal} />
                            <LinhaInformacao icone={Phone} rotulo="Telefone secundário" valor={user.telefone_secundario} />
                        </div>
                    </section>

                    {ehAluno && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
                                <HeartPulse size={22} className="text-blue-600" aria-hidden="true" />
                                Informações complementares
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <LinhaInformacao
                                    icone={Users}
                                    rotulo="Já foi ou é palhaço voluntário?"
                                    valor={user.participacao_anterior === undefined ? undefined : user.participacao_anterior ? "Sim" : "Não"}
                                />
                                <LinhaInformacao icone={HeartPulse} rotulo="Informações de saúde" valor={user.problemas_saude} />
                            </div>
                        </section>
                    )}
                </div>

                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
                        <ShieldCheck size={22} className="text-blue-600" aria-hidden="true" />
                        Dados da conta
                    </h2>
                    <div className="space-y-4">
                        <LinhaInformacao icone={Mail} rotulo="E-mail" valor={user.email} />
                        <LinhaInformacao icone={LockKeyhole} rotulo="CPF" valor={formatarCPF(user.cpf)} />
                        <LinhaInformacao icone={BadgeCheck} rotulo="Tipo de usuário" valor={PAPEIS[user.papelUsuario]} />
                    </div>
                    <div className="mt-5 rounded-xl bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
                        Por segurança, CPF e e-mail não podem ser alterados nesta tela.
                    </div>
                </section>
            </div>

            <dialog
                ref={dialogRef}
                onCancel={(event) => {
                    if (salvando) {
                        event.preventDefault();
                    } else {
                        setModalAberto(false);
                    }
                }}
                aria-labelledby="titulo-modal-perfil"
                className="m-auto w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] max-w-2xl overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 open:flex open:flex-col"
            >
                <div className="flex shrink-0 items-center justify-between gap-3 bg-[#0F172A] p-6 text-white">
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-blue-300">ATUALIZAÇÃO DE DADOS</p>
                        <h2 id="titulo-modal-perfil" className="mt-1 text-2xl font-bold">Editar perfil</h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Fechar edição de perfil"
                        onClick={() => setModalAberto(false)}
                        disabled={salvando}
                        className="cursor-pointer rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50"
                    >
                        <X size={22} aria-hidden="true" />
                    </button>
                </div>

                <form onSubmit={(event) => { void salvarEdicao(event); }} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block sm:col-span-2">
                                <span className="text-sm font-semibold text-slate-700">Nome completo</span>
                                <input className={classeInput} value={form.name} onChange={(event) => setCampo("name", event.target.value)} required minLength={3} />
                            </label>
                            <label className="block sm:col-span-2">
                                <span className="text-sm font-semibold text-slate-700">E-mail (não editável)</span>
                                <input className={classeInput} value={user.email} readOnly disabled />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Data de nascimento</span>
                                <input type="date" className={classeInput} value={form.dt_nascimento} onChange={(event) => setCampo("dt_nascimento", event.target.value)} />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Estado civil</span>
                                <select className={classeInput} value={form.estado_civil} onChange={(event) => setCampo("estado_civil", event.target.value)}>
                                    <option value="">Selecione...</option>
                                    {opcoesEstadoCivil.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Telefone principal</span>
                                <input className={classeInput} inputMode="tel" placeholder="(00) 00000-0000" value={form.telefone_principal} onChange={(event) => setCampo("telefone_principal", formatarTelefone(event.target.value))} />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Telefone secundário</span>
                                <input className={classeInput} inputMode="tel" placeholder="(00) 00000-0000" value={form.telefone_secundario} onChange={(event) => setCampo("telefone_secundario", formatarTelefone(event.target.value))} />
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Profissão</span>
                                <select className={classeInput} value={form.profissao} onChange={(event) => setCampo("profissao", event.target.value)}>
                                    <option value="">Selecione...</option>
                                    {PROFISSOES.map((profissao) => <option key={profissao} value={profissao}>{profissao}</option>)}
                                    <option value="Outro">Outro</option>
                                </select>
                            </label>
                            {form.profissao === "Outro" && (
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-700">Qual profissão?</span>
                                    <input className={classeInput} value={form.profissao_custom} onChange={(event) => setCampo("profissao_custom", event.target.value)} />
                                </label>
                            )}
                            {ehAluno && (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-700">Já foi ou é palhaço voluntário?</span>
                                        <select className={classeInput} value={form.participacao_anterior} onChange={(event) => setCampo("participacao_anterior", event.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option value="true">Sim</option>
                                            <option value="false">Não</option>
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-semibold text-slate-700">Possui problema de saúde?</span>
                                        <select className={classeInput} value={form.tem_problema_saude} onChange={(event) => setCampo("tem_problema_saude", event.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Não">Não</option>
                                        </select>
                                    </label>
                                    {form.tem_problema_saude === "Sim" && (
                                        <label className="block sm:col-span-2">
                                            <span className="text-sm font-semibold text-slate-700">Descreva a informação de saúde</span>
                                            <input className={classeInput} value={form.problemas_saude_descricao} onChange={(event) => setCampo("problemas_saude_descricao", event.target.value)} />
                                        </label>
                                    )}
                                </>
                            )}
                        </div>
                        {erroForm && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{erroForm}</p>}
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 bg-white p-5">
                        <button type="button" onClick={() => setModalAberto(false)} disabled={salvando} className="cursor-pointer rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={salvando} className="cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50">
                            {salvando ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </dialog>
        </main>
    );
}
