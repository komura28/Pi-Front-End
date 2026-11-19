
import { useForm } from "react-hook-form";
import { BookOpen, Plus, Save } from "lucide-react";
import { AppDialog } from "./ui/AppDialog";

export interface AulaFormData {
    titulo: string;
    descricao: string;
    duracao: number;
}

interface AulaModalProps {
    aula?: AulaFormData;
    onClose: () => void;
    onSave: (aula: AulaFormData) => void;
}

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

export function AulaModal({
    aula,
    onClose,
    onSave
}: Readonly<AulaModalProps>) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AulaFormData>({
        defaultValues: aula ?? {
            titulo: "",
            descricao: "",
            duracao: 60
        }
    });

    const editando = Boolean(aula);

    function salvar(data: AulaFormData) {
        onSave({
            titulo: data.titulo.trim(),
            descricao: data.descricao.trim(),
            duracao: data.duracao
        });
    }

    return (
        <AppDialog
            aberto={true}
            aoFechar={onClose}
            titulo={editando ? "Editar aula" : "Adicionar aula"}
            descricao={
                editando
                    ? "Atualize as informações da aula."
                    : "Defina o conteúdo e a duração da nova aula."
            }
            icone={BookOpen}
            salvando={isSubmitting}
            rodape={
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="form-aula"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {editando
                            ? <Save size={17} />
                            : <Plus size={17} />
                        }

                        {editando
                            ? "Salvar alterações"
                            : "Adicionar aula"}
                    </button>
                </div>
            }
        >
            <form
                id="form-aula"
                onSubmit={handleSubmit(salvar)}
                className="space-y-5"
            >
                <div>
                    <label
                        htmlFor="aula-titulo"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Título da aula *
                    </label>

                    <input
                        id="aula-titulo"
                        type="text"
                        className={inputClass}
                        placeholder="Ex.: Introdução à Informática"
                        {...register("titulo", {
                            required: "O título é obrigatório",
                            validate: (value) =>
                                value.trim().length > 0 ||
                                "Informe um título válido"
                        })}
                    />

                    {errors.titulo && (
                        <p
                            role="alert"
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.titulo.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="aula-descricao"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Descrição *
                    </label>

                    <textarea
                        id="aula-descricao"
                        rows={4}
                        className={`${inputClass} resize-y`}
                        placeholder="Descreva o conteúdo da aula"
                        {...register("descricao", {
                            required: "A descrição é obrigatória",
                            validate: (value) =>
                                value.trim().length > 0 ||
                                "Informe uma descrição válida"
                        })}
                    />

                    {errors.descricao && (
                        <p
                            role="alert"
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.descricao.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="aula-duracao"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Duração (minutos) *
                    </label>

                    <input
                        id="aula-duracao"
                        type="number"
                        min={1}
                        step={1}
                        className={inputClass}
                        {...register("duracao", {
                            valueAsNumber: true,
                            required: "A duração é obrigatória",
                            validate: (value) =>
                                (Number.isInteger(value) && value > 0) ||
                                "Informe um número inteiro maior que zero"
                        })}
                    />

                    {errors.duracao && (
                        <p
                            role="alert"
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.duracao.message}
                        </p>
                    )}
                </div>
            </form>
        </AppDialog>
    );
}
