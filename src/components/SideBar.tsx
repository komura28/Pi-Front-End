import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import logo from "../assets/logo.png";

export interface NavigationItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  iconContador?: ReactNode;

  options?: {
    label: string;
    href: string;
    iconF?: ReactNode;
  }[];
}

interface SideBarProps {
  navigationItems: NavigationItem[];
  link: string;
  matriculasPendentes: number;
  abertaMobile?: boolean;
  aoFecharMobile?: () => void;
}

export function SideBar({
  navigationItems,
  link,
  matriculasPendentes,
  abertaMobile = false,
  aoFecharMobile,
}: Readonly<SideBarProps>) {
  const { pathname } = useLocation();

  const [menusAbertos, setMenusAbertos] = useState<Record<string, boolean>>({});

  function rotaAtiva(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function finalizarNavegacao() {
    setMenusAbertos({});
    aoFecharMobile?.();
  }

  return (
    <>
      {abertaMobile && (
        <button
          type="button"
          aria-label="Fechar menu lateral"
          onClick={aoFecharMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0F172A] text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          abertaMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            to={link}
            onClick={finalizarNavegacao}
            aria-label="Ir para o início"
          >
            <img
              src={logo}
              alt="Aticurando"
              className="h-12 w-auto max-w-44 object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={aoFecharMobile}
            aria-label="Fechar menu"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          aria-label="Navegação principal"
          className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-5"
        >
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Navegação
          </p>

          {navigationItems.map((item) => {
            if (item.options?.length) {
              const grupoAtivo = item.options.some((opcao) =>
                rotaAtiva(opcao.href),
              );

              const aberto = menusAbertos[item.label] ?? grupoAtivo;

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setMenusAbertos((atual) => ({
                        ...atual,
                        [item.label]: !aberto,
                      }))
                    }
                    aria-expanded={aberto}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      grupoAtivo
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>

                    <span className="flex-1">{item.label}</span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        aberto ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {aberto && (
                    <div className="mb-2 ml-5 mt-1 space-y-1 border-l border-slate-700 pl-3">
                      {item.options.map((opcao) => (
                        <NavLink
                          key={opcao.href}
                          to={opcao.href}
                          onClick={finalizarNavegacao}
                          className={({ isActive }) =>
                            `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                              isActive
                                ? "bg-blue-600 font-semibold text-white"
                                : "text-slate-400 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          {opcao.iconF && (
                            <span className="shrink-0">{opcao.iconF}</span>
                          )}

                          <span className="min-w-0 flex-1">{opcao.label}</span>

                          {opcao.href === "/app/matricula" &&
                            matriculasPendentes > 0 && (
                              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                                {matriculasPendentes}
                              </span>
                            )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (!item.href) return null;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                onClick={finalizarNavegacao}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <a
            href="https://wa.me/5511962865972"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <MessageCircle size={18} />
            Central de suporte
          </a>
        </div>
      </aside>
    </>
  );
}
