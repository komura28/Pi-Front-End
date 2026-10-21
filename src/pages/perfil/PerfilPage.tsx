import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaPencilAlt } from "react-icons/fa";
import type { authUser } from "../../types/auth/auth-types";
import type { IUpdateUserDTO } from "../../types/user/user-types";
import { getMe } from "../../services/authService";
import { editarUser } from "../../services/userService";
import { formatDate } from "../../utils/formatters";
import { Modal } from "../../components/Modal";

const OPCOES_ESTADO_CIVIL = [
    { value: "Solteiro(a)", label: "Solteiro(a)" },
    { value: "Casado(a)", label: "Casado(a)" },
    { value: "Divorciado(a)", label: "Divorciado(a)" },
    { value: "Viuvo(a)", label: "Viúvo(a)" },
    { value: "Uniao Estavel", label: "União Estável" },
];

const OPCOES_PROFISSAO = ["Estudante", "Empregado", "Autônomo", "Desempregado", "Aposentado"];

interface PerfilForm {
    name: string;
    dt_nascimento: string;
    telefone_principal: string;
    telefone_secundario: string;
    estado_civil: string;
    profissao: string;
    profissao_custom: string;
    tem_problema_saude: string;
    problemas_saude_descricao: string;
    participacao_anterior: string;
}

const FORM_VAZIO: PerfilForm = {
    name: "",
    dt_nascimento: "",
    telefone_principal: "",
    telefone_secundario: "",
    estado_civil: "",
    profissao: "",
    profissao_custom: "",
    tem_problema_saude: "",
    problemas_saude_descricao: "",
    participacao_anterior: "",
};

function formatarTelefone(valor: string) {
    const digitos = valor.replace(/\D/g, "").substring(0, 11);

    if (digitos.length <= 10) {
        return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }

    return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

function formatarCPF(valor: string | number) {
    return String(valor)
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function mensagemDeErro(error: unknown) {
    const resposta = error as { response?: { data?: { message?: string } } };
    return resposta?.response?.data?.message ?? "Erro ao atualizar o perfil. Tente novamente.";
}

const NAO_INFORMADO = "Não informado";

const CLASSE_CAMPO_LEITURA =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none";

const CLASSE_CAMPO_EDICAO =
    "w-full rounded-md border border-slate-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

function CampoLeitura({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
    const fieldId = `leitura-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <label htmlFor={fieldId} className="mb-1 block text-slate-800 font-medium">{label}</label>
            <input id={fieldId} value={value} className={CLASSE_CAMPO_LEITURA} disabled readOnly />
        </div>
    );
}

export function PerfilPage() {

    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
    const [form, setForm] = useState<PerfilForm>(FORM_VAZIO);
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                const perfilAtual = await getMe();
                setUser(perfilAtual);
                localStorage.setItem("user", JSON.stringify(perfilAtual));
            } catch (error) {
                console.error("Erro ao carregar o perfil:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    if (loading) {
        return <div className="p-8"><p>Carregando...</p></div>;
    }

    if (!user) {
        return <div className="p-8"><p>Nenhum usuário encontrado</p></div>;
    }

    function setCampo<K extends keyof PerfilForm>(campo: K, valor: PerfilForm[K]) {
        setForm((anterior) => ({ ...anterior, [campo]: valor }));
    }

    function abrirModalEdicao(usuario: authUser) {
        const profissaoAtual = (usuario.profissao ?? "").trim();
        const profissaoEhPadrao = OPCOES_PROFISSAO.includes(profissaoAtual);

        const saudeAtual = (usuario.problemas_saude ?? "").trim();
        const semProblemaSaude = ["não", "nao"].includes(saudeAtual.toLowerCase());

        setForm({
            name: usuario.name ?? "",
            dt_nascimento: (usuario.dt_nascimento ?? "").split("T")[0] ?? "",
            telefone_principal: usuario.telefone_principal ?? "",
            telefone_secundario: usuario.telefone_secundario ?? "",
            estado_civil: usuario.estado_civil ?? "",
            profissao: profissaoAtual === "" ? "" : profissaoEhPadrao ? profissaoAtual : "Outro",
            profissao_custom: profissaoAtual !== "" && !profissaoEhPadrao ? profissaoAtual : "",
            tem_problema_saude: saudeAtual === "" ? "" : semProblemaSaude ? "Não" : "Sim",
            problemas_saude_descricao: saudeAtual !== "" && !semProblemaSaude ? saudeAtual : "",
            participacao_anterior:
                usuario.participacao_anterior === undefined ? "" : String(usuario.participacao_anterior),
        });
        setFormError("");
        setIsEditModalOpen(true);
    }

    function fecharModalEdicao() {
        setIsEditModalOpen(false);
        setForm(FORM_VAZIO);
        setFormError("");
    }

    async function handleSalvarEdicao() {
        if (!user) return;

        const nome = form.name.trim();

        if (nome.length < 3) {
            setFormError("O nome deve ter pelo menos 3 caracteres.");
            return;
        }

        if (form.telefone_principal && form.telefone_principal.replace(/\D/g, "").length < 10) {
            setFormError("Telefone principal inválido.");
            return;
        }

        if (form.telefone_secundario && form.telefone_secundario.replace(/\D/g, "").length < 10) {
            setFormError("Telefone secundário inválido.");
            return;
        }

        if (form.profissao === "Outro" && !form.profissao_custom.trim()) {
            setFormError("Especifique sua profissão.");
            return;
        }

        if (form.tem_problema_saude === "Sim" && !form.problemas_saude_descricao.trim()) {
            setFormError("Descreva o problema de saúde.");
            return;
        }

        const payload: Omit<IUpdateUserDTO, "email"> = {
            name: nome,
            telefone_secundario: form.telefone_secundario.trim(),
            profissao: form.profissao === "Outro" ? form.profissao_custom.trim() : form.profissao,
        };

        if (form.dt_nascimento) payload.dt_nascimento = form.dt_nascimento;
        if (form.telefone_principal) payload.telefone_principal = form.telefone_principal;
        if (form.estado_civil) payload.estado_civil = form.estado_civil;
        if (form.participacao_anterior !== "") {
            payload.participacao_anterior = form.participacao_anterior === "true";
        }
        if (form.tem_problema_saude === "Sim") {
            payload.problemas_saude = form.problemas_saude_descricao.trim();
        } else if (form.tem_problema_saude === "Não") {
            payload.problemas_saude = "Não";
        }

        try {
            setIsSaving(true);
            setFormError("");

            const atualizado = await editarUser(payload);

            const usuarioAtualizado = {
                ...user,
                ...atualizado,
                id: atualizado?.id ?? atualizado?._id ?? user.id,
            } as authUser;

            setUser(usuarioAtualizado);
            localStorage.setItem("user", JSON.stringify(usuarioAtualizado));

            fecharModalEdicao();
            setMostrarModalEdicao(true);
        } catch (error) {
            console.error(error);
            setFormError(mensagemDeErro(error));
        } finally {
            setIsSaving(false);
        }
    }

    const opcoesEstadoCivil =
        form.estado_civil && !OPCOES_ESTADO_CIVIL.some((opcao) => opcao.value === form.estado_civil)
            ? [...OPCOES_ESTADO_CIVIL, { value: form.estado_civil, label: form.estado_civil }]
            : OPCOES_ESTADO_CIVIL;

    const estadoCivilExibicao =
        OPCOES_ESTADO_CIVIL.find((opcao) => opcao.value === user.estado_civil)?.label ??
        user.estado_civil ??
        NAO_INFORMADO;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Meu Perfil
            </h1>

            <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <CampoLeitura label="Nome" value={user.name} full />
                    <CampoLeitura label="E-mail" value={user.email} full />
                    <CampoLeitura label="CPF" value={formatarCPF(user.cpf)} />
                    <CampoLeitura label="Papel do Usuário" value={user.papelUsuario} />
                    <CampoLeitura
                        label="Data de Nascimento"
                        value={user.dt_nascimento ? formatDate(user.dt_nascimento) : NAO_INFORMADO}
                    />
                    <CampoLeitura label="Estado Civil" value={estadoCivilExibicao || NAO_INFORMADO} />
                    <CampoLeitura label="Telefone Principal" value={user.telefone_principal || NAO_INFORMADO} />
                    <CampoLeitura label="Telefone Secundário" value={user.telefone_secundario || NAO_INFORMADO} />
                    <CampoLeitura label="Profissão" value={user.profissao || NAO_INFORMADO} />
                    <CampoLeitura
                        label="Já foi ou é palhaço voluntário?"
                        value={
                            user.participacao_anterior === undefined
                                ? NAO_INFORMADO
                                : user.participacao_anterior ? "Sim" : "Não"
                        }
                    />
                    <CampoLeitura
                        label="Problemas de saúde"
                        value={user.problemas_saude || NAO_INFORMADO}
                        full
                    />
                </div>

                <div className="mt-6 flex justify-center items-center gap-2">
                    <button
                        onClick={() => abrirModalEdicao(user)}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-medium shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                    >
                        <FaPencilAlt />
                        Editar Perfil
                    </button>
                </div>
            </section>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-xl font-semibold text-slate-900">Editar Perfil</h3>

                        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="modal-name" className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
                                <input
                                    id="modal-name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setCampo("name", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="modal-email" className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
                                <input
                                    id="modal-email"
                                    type="email"
                                    value={user.email}
                                    className={`${CLASSE_CAMPO_EDICAO} cursor-not-allowed bg-slate-100 text-slate-500`}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="modal-cpf" className="mb-1 block text-sm font-medium text-slate-700">CPF</label>
                                <input
                                    id="modal-cpf"
                                    type="text"
                                    value={formatarCPF(user.cpf)}
                                    className={`${CLASSE_CAMPO_EDICAO} cursor-not-allowed bg-slate-100 text-slate-500`}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div>
                                <label htmlFor="modal-dt-nascimento" className="mb-1 block text-sm font-medium text-slate-700">Data de Nascimento</label>
                                <input
                                    id="modal-dt-nascimento"
                                    type="date"
                                    value={form.dt_nascimento}
                                    onChange={(e) => setCampo("dt_nascimento", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                />
                            </div>

                            <div>
                                <label htmlFor="modal-estado-civil" className="mb-1 block text-sm font-medium text-slate-700">Estado Civil</label>
                                <select
                                    id="modal-estado-civil"
                                    value={form.estado_civil}
                                    onChange={(e) => setCampo("estado_civil", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                >
                                    <option value="">Selecione...</option>
                                    {opcoesEstadoCivil.map((opcao) => (
                                        <option key={opcao.value} value={opcao.value}>
                                            {opcao.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="modal-tel-principal" className="mb-1 block text-sm font-medium text-slate-700">Telefone Principal</label>
                                <input
                                    id="modal-tel-principal"
                                    type="text"
                                    inputMode="tel"
                                    placeholder="(00) 00000-0000"
                                    value={form.telefone_principal}
                                    onChange={(e) => setCampo("telefone_principal", formatarTelefone(e.target.value))}
                                    className={CLASSE_CAMPO_EDICAO}
                                />
                            </div>

                            <div>
                                <label htmlFor="modal-tel-secundario" className="mb-1 block text-sm font-medium text-slate-700">Telefone Secundário/Reserva</label>
                                <input
                                    id="modal-tel-secundario"
                                    type="text"
                                    inputMode="tel"
                                    placeholder="(00) 00000-0000"
                                    value={form.telefone_secundario}
                                    onChange={(e) => setCampo("telefone_secundario", formatarTelefone(e.target.value))}
                                    className={CLASSE_CAMPO_EDICAO}
                                />
                            </div>

                            <div>
                                <label htmlFor="modal-profissao" className="mb-1 block text-sm font-medium text-slate-700">Profissão</label>
                                <select
                                    id="modal-profissao"
                                    value={form.profissao}
                                    onChange={(e) => setCampo("profissao", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                >
                                    <option value="">Selecione...</option>
                                    {OPCOES_PROFISSAO.map((opcao) => (
                                        <option key={opcao} value={opcao}>
                                            {opcao}
                                        </option>
                                    ))}
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="modal-participacao" className="mb-1 block text-sm font-medium text-slate-700">
                                    Você já foi ou é palhaço voluntário?
                                </label>
                                <select
                                    id="modal-participacao"
                                    value={form.participacao_anterior}
                                    onChange={(e) => setCampo("participacao_anterior", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                </select>
                            </div>

                            {form.profissao === "Outro" && (
                                <div className="sm:col-span-2">
                                    <label htmlFor="modal-profissao-custom" className="mb-1 block text-sm font-medium text-slate-700">
                                        Qual é a sua profissão?
                                    </label>
                                    <input
                                        id="modal-profissao-custom"
                                        type="text"
                                        placeholder="Digite sua profissão"
                                        value={form.profissao_custom}
                                        onChange={(e) => setCampo("profissao_custom", e.target.value)}
                                        className={CLASSE_CAMPO_EDICAO}
                                    />
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <label htmlFor="modal-tem-problema-saude" className="mb-1 block text-sm font-medium text-slate-700">
                                    Possui problema de saúde?
                                </label>
                                <select
                                    id="modal-tem-problema-saude"
                                    value={form.tem_problema_saude}
                                    onChange={(e) => setCampo("tem_problema_saude", e.target.value)}
                                    className={CLASSE_CAMPO_EDICAO}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>

                            {form.tem_problema_saude === "Sim" && (
                                <div className="sm:col-span-2">
                                    <label htmlFor="modal-problemas-saude-desc" className="mb-1 block text-sm font-medium text-slate-700">
                                        Qual problema de saúde/doença você possui?
                                    </label>
                                    <input
                                        id="modal-problemas-saude-desc"
                                        type="text"
                                        placeholder="Digite a doença ou condição de saúde"
                                        value={form.problemas_saude_descricao}
                                        onChange={(e) => setCampo("problemas_saude_descricao", e.target.value)}
                                        className={CLASSE_CAMPO_EDICAO}
                                    />
                                </div>
                            )}
                        </div>

                        {formError && (
                            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                                {formError}
                            </p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModalEdicao}
                                disabled={isSaving}
                                className="rounded-md bg-slate-200 px-4 py-2 font-medium text-slate-800 transition-colors hover:bg-slate-300 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvarEdicao}
                                disabled={isSaving}
                                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalEdicao && (
                <Modal
                    titulo="Atualização"
                    message="Perfil atualizado com sucesso!"
                    decisao={null}
                    texto="Ok"
                    opSim={() => setMostrarModalEdicao(false)}
                />
            )}
        </div>
    )
}