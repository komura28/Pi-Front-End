import { FormCadastro } from "../../components/FormCadastro";

export function RegisterProfessorPage() {
  return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
          <FormCadastro tipo="professor"
          />
      </main>
    );
}