import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ChevronRight, LogOut, Menu, UserRound } from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { AvatarPerfil } from "./AvatarPerfil";

import type { NavigationItem } from "./SideBar";

import logo from "../assets/logo.png";

interface HeaderProps {
  navigationItems?: NavigationItem[] | null;
  link?: string;
  mode: "ALUNO" | "ADM" | "PROFESSOR";
  onAbrirMenu?: () => void;
}

export function Header({
  navigationItems,
  link,
  mode,
  onAbrirMenu,
}: Readonly<HeaderProps>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const menuPerfilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuPerfilAberto) return;

    function handleClickFora(event: PointerEvent) {
      if (
        menuPerfilRef.current &&
        !menuPerfilRef.current.contains(event.target as Node)
      ) {
        setMenuPerfilAberto(false);
      }
    }

    document.addEventListener("pointerdown", handleClickFora);

    return () => {
      document.removeEventListener("pointerdown", handleClickFora);
    };
  }, [menuPerfilAberto]);

  const secaoAtual = navigationItems?.find(
    (item) =>
      item.href === pathname ||
      item.options?.some((opcao) => opcao.href === pathname),
  );

  const paginaEspecial = pathname.endsWith("/perfil")
    ? "Meu perfil"
    : pathname.startsWith("/professor/aulas/")
      ? "Chamada"
      : pathname.includes("/frequencia")
        ? "Frequência da turma"
        : null;

  const paginaAtual =
    paginaEspecial ??
    secaoAtual?.options?.find((opcao) => opcao.href === pathname)?.label ??
    secaoAtual?.label ??
    "Painel";

  const nomeArea =
    mode === "ADM"
      ? "Painel administrativo"
      : mode === "PROFESSOR"
        ? "Área do professor"
        : "Área do aluno";

  function handlePerfil() {
    setMenuPerfilAberto(false);

    if (mode === "ADM") {
      navigate("/app/perfil");
    } else if (mode === "PROFESSOR") {
      navigate("/professor/perfil");
    } else {
      navigate("/api/perfil");
    }
  }

  function handleLogout() {
    setMenuPerfilAberto(false);
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-auto min-h-20 shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-2 border-b border-white/10 bg-[#0F172A] px-3 py-2 sm:relative sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0 sm:h-20">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {mode === "ALUNO" ? (
          <Link to={link ?? "/api/home"} className="shrink-0">
            <img
              src={logo}
              alt="Aticurando"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={onAbrirMenu}
              aria-label="Abrir menu lateral"
              className="rounded-xl p-2 text-slate-200 transition hover:bg-white/10 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium text-blue-200">{nomeArea}</p>

              <div className="mt-1 flex items-center gap-2">
                {secaoAtual?.options && (
                  <>
                    <span className="hidden text-sm text-slate-400 sm:inline">
                      {secaoAtual.label}
                    </span>

                    <ChevronRight
                      size={15}
                      className="hidden text-slate-500 sm:block"
                    />
                  </>
                )}

                <span className="truncate text-sm font-semibold text-white sm:text-base">
                  {paginaAtual}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {mode === "ALUNO" && (
        <nav
          aria-label="Navegação principal"
          className="order-3 flex w-full min-w-0 basis-full items-center justify-center gap-1 overflow-x-auto overscroll-x-contain pb-1 sm:absolute sm:left-1/2 sm:top-1/2 sm:order-none sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:basis-auto sm:flex-none sm:gap-3 sm:pb-0"
        >
          {navigationItems
            ?.filter((item) => Boolean(item.href))
            .map((item) => (
              <NavLink
                key={item.href}
                to={item.href!}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="hidden sm:inline">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </nav>
      )}

      <div
        ref={menuPerfilRef}
        className="relative flex shrink-0 items-center gap-3"
      >
        {mode !== "ALUNO" && (
          <div className="hidden text-right sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-white">
              {user?.name ?? "Usuário"}
            </p>

            <p className="text-xs text-slate-400">
              {mode === "ADM" ? "Administrador" : "Professor"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuPerfilAberto((atual) => !atual)}
          aria-label="Abrir menu da conta"
          aria-expanded={menuPerfilAberto}
          aria-haspopup="menu"
          className="rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue-400 cursor-pointer"
        >
          <AvatarPerfil foto={user?.photo} nome={user?.name} tamanho="sm" />
        </button>

        {menuPerfilAberto && (
          <>

            <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={handlePerfil}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                <UserRound size={18} />
                Meu perfil
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
