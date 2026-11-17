import logo from "../../assets/logo2.png";
import { FormCadastro } from "../../components/FormCadastro";
import { Link } from "react-router-dom";

export function RegistroPage() {


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <Link to="/login" className="text-blue-500 hover:underline">
          ← Voltar
        </Link>

        <img
          src={logo}
          alt="Logo"
          className="mx-auto h-16 w-auto object-contain"
        />

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Aticurando
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Faça seu cadastro
        </p>

        <FormCadastro />

      </section>
    </main>
  );
}