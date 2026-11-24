import { useState, useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";

interface UploadFotoProps {
  foto?: File;
  onChange: (foto?: File) => void;
  onError: (error: string) => void;
}

export function UploadFoto({ foto, onChange, onError }: UploadFotoProps) {
  const fotoRef = useRef<HTMLInputElement>(null); //Referência a o input da foto
  const [arrastarFoto, setArrastarFoto] = useState(false); //Atualiza o estado quando o user arrasta a foto até o local de upload
  const [visualizarFoto, setVisualizarFoto] = useState(false);

  const previewURL = useMemo(() => {
    if (!foto) return null;

    return URL.createObjectURL(foto);
  }, [foto]);

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const selectPhoto = (arquivo: File) => {
    if (!arquivo.type.startsWith("image/")) {
      onError("Escolha uma imagem válida.");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      onError("A imagem deve ter no máximo 5 MB.");
      return;
    }
    onError("");
    onChange(arquivo);
  };

  const removerFoto = () => {
    onChange(undefined);
    onError("");
    setVisualizarFoto(false);

    if (fotoRef.current) {
      fotoRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastarFoto(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setArrastarFoto(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastarFoto(false);

    const arquivo = e.dataTransfer.files[0];

    if (arquivo) {
      selectPhoto(arquivo);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full min-w-0 transition-all duration-200 ${
        previewURL
          ? "flex flex-col items-center gap-2"
          : `cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-6 md:p-8 ${
              arrastarFoto
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
            }`
      }`}
    >
      <input
        ref={fotoRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={(e) => {
          const arquivo = e.target.files?.[0];

          if (arquivo) {
            selectPhoto(arquivo);
          }
        }}
      />

      {!previewURL && (
        <button
          type="button"
          aria-label="Selecionar foto de perfil"
          onClick={() => fotoRef.current?.click()}
          className="flex w-full min-w-0 cursor-pointer flex-col items-center text-center"
        >
          <h3 className="break-words text-base font-semibold text-gray-800 sm:text-lg">
            Adicione sua Foto de Perfil
          </h3>

          <p className="mb-2 mt-1 max-w-sm break-words text-sm leading-relaxed text-gray-600">
            Arraste e Solte uma imagem aqui ou Selecione uma imagem do seu
            dispositivo
          </p>
        </button>
      )}
      {previewURL && (
        <div className="relative flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setVisualizarFoto(true)}
            aria-label="Ampliar foto de perfil"
            className="max-w-full cursor-pointer rounded-full"
          >
            <img
              src={previewURL}
              alt="Foto de perfil"
              className="h-28 w-28 rounded-full border-2 border-gray-300 object-cover sm:h-32 sm:w-32"
            />
          </button>

          <button
            type="button"
            onClick={removerFoto}
            aria-label="Remover foto de perfil"
            className="absolute right-0 top-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {visualizarFoto && previewURL && (
  <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
    <button
      type="button"
      onClick={() => setVisualizarFoto(false)}
      aria-label="Fechar visualização"
      className="absolute inset-0 cursor-pointer border-0 bg-transparent"
    />

    <button
      type="button"
      onClick={() => setVisualizarFoto(false)}
      aria-label="Fechar foto ampliada"
      className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-200"
    >
      <X size={24} />
    </button>

    <img
      src={previewURL}
      alt="Foto de perfil ampliada"
      className="relative z-10 max-h-[calc(100dvh-2rem)] max-w-[90vw] rounded-lg object-contain"
    />
  </div>
)}
    </div>
  );
}
