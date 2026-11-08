
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";

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

import { Modal } from "../../components/Modal";

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
    "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

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
        watch,
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

    const materiasAtuais = watch("materias") ?? [];

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
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
            <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Cadastro de Curso
                </h1>

                {!cursoSalvo ? (
                    <form
                        onSubmit={handleSubmit(handleCadastro)}
                        className="space-y-5"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Nome do Curso
                            </label>

                            <input
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
                            <label className="mb-1 block text-sm font-bold text-gray-700">
                                Descrição
                            </label>

                            <textarea
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

                        <div className="border-t border-gray-200 pt-5">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">
                                Matérias do Curso
                            </h2>

                            <div className="space-y-3">
                                <input
                                    value={materia}
                                    onChange={e => setMateria(e.target.value)}
                                    className={inputClass}
                                    placeholder="Nome da matéria"
                                />

                                <div className="flex items-center gap-2">
                                    <input
                                        value={materiaDesc}
                                        onChange={e => setMateriaDesc(e.target.value)}
                                        className={`${inputClass} flex-1 min-w-0`}
                                        placeholder="Descrição da matéria"
                                    />

                                    <button
                                        type="button"
                                        onClick={adicionarMateria}
                                        title="Adicionar matéria"
                                        aria-label="Adicionar matéria"
                                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-2xl font-bold leading-none text-white transition hover:bg-blue-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => {
                                const aulas =
                                    materiasAtuais[index]?.aulas ?? [];

                                return (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    {field.name}
                                                </h3>

                                                <p className="text-sm text-gray-600">
                                                    {field.description}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800"
                                            >
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
                                            <div className="flex items-center justify-between gap-3">
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
                                                    title="Adicionar aula"
                                                    aria-label="Adicionar aula"
                                                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-2xl font-bold leading-none text-white transition hover:bg-blue-700"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {aulas.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {aulas.map((aula, aulaIndex) => (
                                                        <div
                                                            key={aulaIndex}
                                                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-gray-800">
                                                                    {aulaIndex + 1}. {aula.titulo}
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    {aula.duracao} minutos
                                                                </p>
                                                            </div>

                                                            <div className="flex shrink-0 gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setModalAula({
                                                                            materiaIndex: index,
                                                                            aulaIndex
                                                                        })
                                                                    }
                                                                    className="cursor-pointer text-sm font-semibold text-blue-600"
                                                                >
                                                                    Editar
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removerAula(
                                                                            index,
                                                                            aulaIndex
                                                                        )
                                                                    }
                                                                    className="cursor-pointer text-sm font-semibold text-red-600"
                                                                >
                                                                    Remover
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

                        <button
                            type="submit"
                            disabled={isSubmitting || enviandoAulas}
                            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSubmitting || enviandoAulas
                                ? "Cadastrando..."
                                : "Cadastrar Curso"}
                        </button>
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

                {modalSucesso && (
                    <Modal
                        titulo="Cadastro"
                        message="Curso, matérias e aulas cadastrados com sucesso!"
                        decisao={null}
                        texto="Ok"
                        opSim={() => {
                            setModalSucesso(false);
                            navigate("/app/curso");
                        }}
                    />
                )}
            </section>
        </main>
    );
}
