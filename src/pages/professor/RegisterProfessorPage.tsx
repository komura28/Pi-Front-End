
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { FormCadastro } from "../../components/FormCadastro";
import { PageHeader } from "../../components/ui/PageHeader";

export function RegisterProfessorPage() {
    const navigate = useNavigate();

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <PageHeader
                titulo="Cadastrar professor"
                descricao="Registre os dados de um novo professor no Aticurando."
                categoria="PAINEL ADMINISTRATIVO"
                icone={GraduationCap}
                acao={
                    <button
                        type="button"
                        onClick={() => navigate("/app/user")}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-blue-50"
                    >
                        <ArrowLeft size={18} />
                        Voltar aos usuários
                    </button>
                }
            />

            <FormCadastro tipo="professor" />
        </main>
    );
}
