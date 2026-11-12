import { useState, useEffect, useRef, useMemo } from "react";

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
    onError("");
    onChange(arquivo);
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
      className={`transition-all duration-200 ${
        previewURL 
          ? "flex flex-col items-center gap-2"
          : `cursor-pointer rounded-2xl border-2 border-dashed p-8 ${
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
          onClick={() => fotoRef.current?.click()}
          className="flex w-full flex-col items-center text-center cursor-pointer">
          <h3 className="text-base font-semibold text-gray-800">
            Adicione sua Foto de Perfil
          </h3>

          <p className="mb-2 text-sm text-gray-600">
            Arraste e Solte uma imagem aqui ou Selecione uma imagem do seu
            dispositivo
          </p>
          </button>
      )}
      {previewURL && (
        <div className="flex flex-col items-center gap-3">
          <button
          type="button"
          onClick={() => setVisualizarFoto(true)}
          aria-label="Ampliar Foto de Perfil">
          
          <img
            src={previewURL}
            alt="Preview"
            className="relative z-10 h-32 w-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
          />
          </button>
        </div>
      )}

      {visualizarFoto && previewURL && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer">
          <button
            type="button"
            onClick={() => setVisualizarFoto(false)}
            aria-label="Fechar Visualização"
            className="absolute inset-0 cursor-pointer border-0 bg-transparent"
            />
          <img
            src={previewURL}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}
