import type { UseFormRegister } from "react-hook-form";

interface CampoSenhaProps {
    id: string;
    label: string;
    placeholder: string;
    error?: string;
    register: UseFormRegister<any>;
    validate?: (value: string) => string | undefined;
}


export function CampoSenha({
    id,
    label,
    placeholder,
    error,
    register,
    validate,
}: CampoSenhaProps) {
    return (
        <div>
            <label 
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
                      <input
                        id={id}
                        type="password"
                        className="w-full bg-transparent outline-none"
                        placeholder={placeholder}
                        {...register(id, {
                          required: "Este campo é obrigatório",
                          validate,
                        })}
                      />
                      </div>
        
                    {error && (
                      <p className="mt-1 text-sm text-red-600">
                        {error}
                      </p>
                    )}
        </div>
    );
}