
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { PageHeader } from "../../components/ui/PageHeader";
import { SuccessDialog } from "../../components/ui/SuccessDialog";
import {
    BookOpen,
    ArrowLeft,
    Plus,
    Save,
    Layers3,
    Trash2,
    Pencil
} from "lucide-react";

import type {
    RegisterCursoRequest,
    RegisterAulaRequest
} from "../../types/auth/auth-types";

import {
    cadastrarCurso,
    cadastrarAula
} from "../../services/admService";

import {
    AulaModal,
    type AulaFormData
} from "../../components/AulaModal";

interface MateriaForm {
    name: string;
    description: string;
    aulas: AulaFormData[];
}

interface CadastroCursoFormData {
    name: string;
    description: string;
    materias: MateriaForm[];
}

interface ModalAulaState {
    materiaIndex: number;
    aulaIndex?: number;
}

const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:px-4 sm:text-sm";

export function CursoCadastroPage() {
    const navigate = useNavigate();

    const [materia, setMateria] = useState("");
    const [materiaDesc, setMateriaDesc] = useState("");

    const [modalAula, setModalAula] =
        useState<ModalAulaState | null>(null);

    const [modalSucesso, setModalSucesso] = useState(false);
    const [serverError, setServerError] = useState("");

    const [cursoSalvo, setCursoSalvo] = useState(false);
    const [enviandoAulas, setEnviandoAulas] = useState(false);

    const [aulasPendentes, setAulasPendentes] =
        useState<RegisterAulaRequest[]>([]);

    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CadastroCursoFormData>({
        defaultValues: {
            name: "",
            description: "",
            materias: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "materias"
    });

    const materiasAtuais = useWatch({ control, name: "materias" }) ?? [];

    function adicionarMateria() {
        const nome = materia.trim();

        if (!nome) {
            setServerError("Informe o nome da matéria.");
            return;
        }

        append({
            name: nome,
            description: materiaDesc.trim(),
            aulas: []
        });

        setMateria("");
        setMateriaDesc("");
        setServerError("");
    }

    function salvarAula(aula: AulaFormData) {
        if (!modalAula) return;

        const { materiaIndex, aulaIndex } = modalAula;

        const aulas = [
            ...(getValues(`materias.${materiaIndex}.aulas`) ?? [])
        ];

        if (aulaIndex !== undefined) {
            aulas[aulaIndex] = aula;
        } else {
            aulas.push(aula);
        }

        setValue(
            `materias.${materiaIndex}.aulas`,
            aulas,
            { shouldDirty: true, shouldValidate: true }
        );

        setModalAula(null);
    }

    function removerAula(
        materiaIndex: number,
        aulaIndex: number
    ) {
        const aulas = [
            ...(getValues(`materias.${materiaIndex}.aulas`) ?? [])
        ];

        aulas.splice(aulaIndex, 1);

        setValue(
            `materias.${materiaIndex}.aulas`,
            aulas,
            { shouldDirty: true }
        );
    }

    function mensagemErro(error: unknown): string {
        if (
            typeof error === "object" &&
            error !== null &&
            "response" in error
        ) {
            const axiosError = error as {
                response?: {
                    data?: {
                        message?: string;
                        error?: string;
                    };
                };
            };

            const mensagem =
                axiosError.response?.data?.message ??
                axiosError.response?.data?.error;

            if (mensagem) return mensagem;
        }

        return error instanceof Error
            ? error.message
            : "Erro inesperado no cadastro.";
    }

    async function enviarAulas(
        fila: RegisterAulaRequest[]
    ) {
        setEnviandoAulas(true);
        setServerError("");

        try {
            for (let i = 0; i < fila.length; i++) {
                try {
                    await cadastrarAula(fila[i]);
                } catch (error) {
                    setAulasPendentes(fila.slice(i));
                    setServerError(
                        "O curso foi criado, mas algumas aulas não foram cadastradas. " +
                        mensagemErro(error)
                    );
                    return;
                }

                setAulasPendentes(fila.slice(i + 1));
            }

            setAulasPendentes([]);
            setModalSucesso(true);
        } finally {
            setEnviandoAulas(false);
        }
    }

    async function handleCadastro(
        data: CadastroCursoFormData
    ) {
        if (cursoSalvo) return;

        try {
            setServerError("");

            const dadosCurso: RegisterCursoRequest = {
                name: data.name.trim(),
                description: data.description.trim(),
                materias: data.materias.map(item => ({
                    name: item.name,
                    description: item.description
                }))
            };

            const cursoCriado = await cadastrarCurso(dadosCurso);

            setCursoSalvo(true);

            if (
                cursoCriado.materias.length !==
                data.materias.length
            ) {
                setServerError(
                    "Curso criado, mas a quantidade de matérias retornada pela API não corresponde ao formulário."
                );
                return;
            }

            const fila: RegisterAulaRequest[] = [];

            data.materias.forEach((materia, index) => {
                const materiaId =
                    cursoCriado.materias[index]?.materia?._id;

                if (!materiaId) {
                    throw new Error(
                        "Não foi possível obter o ID da matéria criada."
                    );
                }

                materia.aulas.forEach((aula, aulaIndex) => {
                    fila.push({
                        titulo: aula.titulo,
                        descricao: aula.descricao,
                        duracao: aula.duracao,
                        materiaId,
                        ordem: aulaIndex + 1,
                        active: true
                    });
                });
            });

            setAulasPendentes(fila);
            await enviarAulas(fila);

        } catch (error) {
            setServerError(mensagemErro(error));
        }
    }

    const aulaEmEdicao =
        modalAula?.aulaIndex !== undefined
            ? materiasAtuais[modalAula.materiaIndex]
                ?.aulas?.[modalAula.aulaIndex]
            : undefined;


    return (
        <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 sm:gap-6">

            <PageHeader
                titulo="Cadastrar curso"
                descricao="Configure as informações do curso, suas matérias e aulas."
                categoria="PAINEL ADMINISTRATIVO"
                icone={BookOpen}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/curso")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 sm:w-auto sm:text-base"
                    >
                        <ArrowLeft size={18} />
                        Voltar aos cursos
                    </button>
                }
            />

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">

                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                        Informações do curso
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Preencha os dados e organize as matérias antes de cadastrar.
                    </p>
                </div>

                {!cursoSalvo ? (
                    <form
                        onSubmit={handleSubmit(handleCadastro)}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="curso-nome"
                                className="mb-1 block text-sm font-bold text-gray-700"
                            >
                                Nome do Curso
                            </label>

                            <input
                                id="curso-nome"
                                className={inputClass}
                                placeholder="Digite o nome do curso"
                                {...register("name", {
                                    required: "O nome é obrigatório"
                                })}
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="curso-descricao"
                                className="mb-1 block text-sm font-bold text-gray-700"
                            >
                                Descrição
                            </label>

                            <textarea
                                id="curso-descricao"
                                rows={3}
                                className={inputClass}
                                placeholder="Descrição do curso"
                                {...register("description", {
                                    required: "A descrição é obrigatória"
                                })}
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-5 lg:p-6">

                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                    <Layers3 size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Matérias do curso
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Adicione as matérias que compõem o curso.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="nova-materia-nome"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Nome da matéria
                                    </label>

                                    <input
                                        id="nova-materia-nome"
                                        type="text"
                                        value={materia}
                                        onChange={(e) => setMateria(e.target.value)}
                                        className={inputClass}
                                        placeholder="Ex.: Introdução à Informática"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="nova-materia-descricao"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Descrição
                                    </label>

                                    <input
                                        id="nova-materia-descricao"
                                        type="text"
                                        value={materiaDesc}
                                        onChange={(e) => setMateriaDesc(e.target.value)}
                                        className={inputClass}
                                        placeholder="Descreva o conteúdo da matéria"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={adicionarMateria}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Plus size={18} />
                                    Adicionar matéria
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => {
                                const aulas =
                                    materiasAtuais[index]?.aulas ?? [];

                                return (
                                    <div
                                        key={field.id}
                                        className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 sm:p-5"
                                    >
                                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-800">
                                                    {field.name}
                                                </h3>

                                                <p className="text-sm text-gray-600">
                                                    {field.description}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                Remover
                                            </button>
                                        </div>

                                        <input
                                            type="hidden"
                                            {...register(
                                                `materias.${index}.name`
                                            )}
                                        />

                                        <input
                                            type="hidden"
                                            {...register(
                                                `materias.${index}.description`
                                            )}
                                        />

                                        <div className="mt-4 border-t border-gray-200 pt-3">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {aulas.length} aula(s)
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setModalAula({
                                                            materiaIndex: index
                                                        })
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
                                                >
                                                    <Plus size={16} />
                                                    Adicionar aula
                                                </button>
                                            </div>

                                            {aulas.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {aulas.map((aula, aulaIndex) => (
                                                        <div
                                                            key={aulaIndex}
                                                            className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-2 sm:gap-3 sm:p-3"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="break-words text-sm font-semibold text-gray-800">
                                                                    {aulaIndex + 1}. {aula.titulo}
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    {aula.duracao} minutos
                                                                </p>
                                                            </div>


                                                            <div className="flex shrink-0 items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setModalAula({
                                                                            materiaIndex: index,
                                                                            aulaIndex
                                                                        })
                                                                    }
                                                                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                                    title="Editar aula"
                                                                    aria-label={`Editar aula ${aula.titulo}`}
                                                                >
                                                                    <Pencil size={17} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removerAula(index, aulaIndex)}
                                                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                                    title="Remover aula"
                                                                    aria-label={`Remover aula ${aula.titulo}`}
                                                                >
                                                                    <Trash2 size={17} />
                                                                </button>
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {serverError && (
                            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}


                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/app/curso")}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || enviandoAulas}
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isSubmitting || enviandoAulas
                                    ? "Cadastrando..."
                                    : "Cadastrar curso"}
                            </button>
                        </div>

                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="font-semibold text-gray-800">
                            O curso e as matérias foram salvos.
                        </p>

                        {serverError && (
                            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                                {serverError}
                            </div>
                        )}

                        {aulasPendentes.length > 0 && (
                            <button
                                type="button"
                                disabled={enviandoAulas}
                                onClick={() =>
                                    void enviarAulas(aulasPendentes)
                                }
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                            >
                                {enviandoAulas
                                    ? "Enviando aulas..."
                                    : "Tentar cadastrar aulas pendentes"}
                            </button>
                        )}
                    </div>
                )}

                {modalAula && (
                    <AulaModal
                        key={`${modalAula.materiaIndex}-${modalAula.aulaIndex ?? "nova"}`}
                        aula={aulaEmEdicao}
                        onClose={() => setModalAula(null)}
                        onSave={salvarAula}
                    />
                )}

                <SuccessDialog
                    aberto={modalSucesso}
                    aoFechar={() => {
                        setModalSucesso(false);
                        navigate("/app/curso");
                    }}
                    titulo="Curso cadastrado!"
                    mensagem="O curso, suas matérias e aulas foram cadastrados com sucesso."
                />
            </section>
        </main>
    );
}
