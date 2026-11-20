import { FaArrowLeft } from "react-icons/fa6";
import logo from "../../assets/logo2.png";
import { FormCadastro } from "../../components/FormCadastro";
import { Link } from "react-router-dom";

export function RegistroPage() {


  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0F172A] px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full min-w-0 max-w-xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline">
          <FaArrowLeft aria-hidden="true" />
          Voltar
        </Link>

        <img
          src={logo}
          alt="Logo"
          className="mx-auto h-12 w-auto object-contain sm:h-16"
        />

        <h1 className="mb-2 text-center text-xl font-bold text-gray-800 sm:text-2xl">
          Aticurando
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Faça seu cadastro
        </p>

        <div className="w-full min-w-0">
          <FormCadastro />
        </div>

      </section>
    </main>
  );
}