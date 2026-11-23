import { useState } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface CampoSenhaProps<T extends FieldValues> {
  id: Path<T>;
  label: React.ReactElement;
  placeholder: string;
  error?: string;
  register: UseFormRegister<T>;
  validate?: (value: string) => string | undefined;
}

export function CampoSenha<T extends FieldValues>({
  id,
  label,
  placeholder,
  error,
  register,
  validate,
}: CampoSenhaProps<T>) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus-within:border-blue-500 focus-within:ring-1">
        <input
          id={id}
          type={mostrarSenha ? "text" : "password"}
          className="min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none placeholder:text-sm sm:text-sm"
          placeholder={placeholder}
          {...register(id, {
            required: "Este campo é obrigatório",
            validate,
          })}
        />
        <button
          type="button"
          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={mostrarSenha}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setMostrarSenha(!mostrarSenha)}
        >
          {mostrarSenha ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
