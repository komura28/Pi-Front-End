
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CampoSenhaProps {
  id: string;
  label: string;
  placeholder: string;
  registro: UseFormRegisterReturn;
  erro?: string;
}

export function CampoSenha({
  id,
  label,
  placeholder,
  registro,
  erro,
}: CampoSenhaProps) {
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
          className="w-full bg-transparent outline-none"
          placeholder={placeholder}
          {...registro}
        />

        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setMostrarSenha(!mostrarSenha)}
        >
          {mostrarSenha ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {erro && (
        <p className="mt-1 text-sm text-red-600">{erro}</p>
      )}
    </div>
  );
}
