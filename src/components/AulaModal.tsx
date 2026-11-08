
import { useForm } from "react-hook-form";

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

export function AulaModal({
    aula,
    onClose,
    onSave
}: AulaModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AulaFormData>({
        defaultValues: aula ?? {
            titulo: "",
            descricao: "",
            duracao: 60
        }
    });

    function salvar(data: AulaFormData) {
        onSave({
            titulo: data.titulo.trim(),
            descricao: data.descricao.trim(),
            duracao: data.duracao
        });
    }

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        {aula ? "Editar Aula" : "Adicionar Aula"}
                    </h2>

                <form
                    onSubmit={handleSubmit(salvar)}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Título
                        </label>

                        <input
                            className={inputClass}
                            placeholder="Ex: Introdução à Informática"
                            {...register("titulo", {
                                required: "O título é obrigatório",
                                validate: value =>
                                    value.trim().length > 0 ||
                                    "Informe um título válido"
                            })}
                        />

                        {errors.titulo && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.titulo.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Descrição
                        </label>

                        <textarea
                            rows={4}
                            className={inputClass}
                            placeholder="Descreva o conteúdo da aula"
                            {...register("descricao", {
                                required: "A descrição é obrigatória",
                                validate: value =>
                                    value.trim().length > 0 ||
                                    "Informe uma descrição válida"
                            })}
                        />

                        {errors.descricao && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.descricao.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700">
                            Duração (minutos)
                        </label>

                        <input
                            type="number"
                            min={1}
                            step={1}
                            className={inputClass}
                            {...register("duracao", {
                                valueAsNumber: true,
                                required: "A duração é obrigatória",
                                validate: value =>
                                    (Number.isInteger(value) && value > 0) ||
                                    "Informe um número inteiro maior que zero"
                            })}
                        />

                        {errors.duracao && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.duracao.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            {aula ? "Salvar Alterações" : "Adicionar Aula"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
