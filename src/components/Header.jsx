import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, LogIn, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import logo from "../components/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Header({ userRole = "student" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, loading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
    navigate("/entrar");
  }

  const isActive = (path) => location.pathname === path;

  const linkBase = "relative text-sm font-medium transition-colors duration-200";
  const linkIdle = "text-slate-600 hover:text-blue-700";
  const linkActive = "text-blue-700";
  const linkUnderline =
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-200 hover:after:scale-x-100";
  const linkUnderlineActive =
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-blue-600 after:scale-x-100";

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-r from-blue-400/20 via-sky-400/10 to-purple-400/20 blur-2xl" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
       
        <Link to="/" className="group flex items-center gap-2" onClick={closeMobile}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/20 blur opacity-0 transition duration-300 group-hover:opacity-100" />
            <img
              src={logo}
              alt="Logo do site AprendeLocal"
              className="relative h-10 w-10 rounded-xl shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>

          <div className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900">
              AprendeLocal
            </span>
            <span className="block text-[11px] text-slate-500 -mt-1">
              Aprenda. Evolua. Conquiste.
            </span>
          </div>
        </Link>

        
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/20 bg-white/60 px-2 py-1 shadow-sm ring-1 ring-black/5">
          {user && (
            <Link
              to="/cursos"
              className={[
                linkBase,
                isActive("/cursos") ? linkActive : linkIdle,
                "px-3 py-2 rounded-full hover:bg-white/70",
                isActive("/cursos") ? linkUnderlineActive : linkUnderline,
              ].join(" ")}
            >
              Cursos
            </Link>
          )}

          <Link
            to="/makerspaces"
            className={[
              linkBase,
              isActive("/makerspaces") ? linkActive : linkIdle,
              "px-3 py-2 rounded-full hover:bg-white/70",
              isActive("/makerspaces") ? linkUnderlineActive : linkUnderline,
            ].join(" ")}
          >
            Makerspaces
          </Link>

          {user && (
            <Link
              to="/perfil"
              className={[
                linkBase,
                isActive("/perfil") ? linkActive : linkIdle,
                "px-3 py-2 rounded-full hover:bg-white/70",
                isActive("/perfil") ? linkUnderlineActive : linkUnderline,
              ].join(" ")}
            >
              Perfil
            </Link>
          )}
        </nav>

        
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-full border border-white/20 bg-white/60 p-2 shadow-sm ring-1 ring-black/5"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

         
          {loading ? (
            <div className="text-sm text-slate-500 rounded-full border border-white/20 bg-white/60 px-3 py-1.5 shadow-sm ring-1 ring-black/5">
              Carregando...
            </div>
          ) : user ? (
           
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/60 px-3 py-2 shadow-sm ring-1 ring-black/5 transition hover:bg-white/80 active:scale-[0.98]"
                  aria-label="Abrir menu do usuário"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-sm">
                    <User className="h-5 w-5" />
                  </span>

                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-slate-900">
                      {user?.user_metadata?.full_name ||
                        user?.user_metadata?.nome ||
                        user?.email?.split("@")?.[0] ||
                        "Minha conta"}
                    </span>
                    <span className="text-[11px] text-slate-500 -mt-0.5">
                      {userRole === "admin" ? "Admin" : "Aluno"}
                    </span>
                  </div>

                  <ChevronDown className="hidden sm:block h-4 w-4 text-slate-500 transition group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={10}
                  className="z-50 min-w-[220px] overflow-hidden rounded-2xl border border-white/30 bg-white/80 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.user_metadata?.full_name ||
                        user?.user_metadata?.name ||
                        "Conta"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>

                  <div className="my-2 h-px bg-slate-200/70" />

                  <DropdownMenu.Item
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition hover:bg-white/70 cursor-pointer"
                    onClick={() => navigate("/perfil")}
                  >
                    Meu Perfil
                    <span className="text-xs text-slate-400">⌘P</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition hover:bg-white/70 cursor-pointer"
                    onClick={() => navigate("/comunidades")}
                  >
                    Comunidades
                    <span className="text-xs text-slate-400">⌘C</span>
                  </DropdownMenu.Item>

                  <div className="my-2 h-px bg-slate-200/70" />

                  <DropdownMenu.Item
                    className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 outline-none transition hover:bg-red-50 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sair
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            
            <button
              onClick={() => navigate("/entrar")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </button>
          )}
        </div>
      </div>

     
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-xl">
          <nav className="flex flex-col gap-1 p-4">
            {user && (
              <Link
                to="/cursos"
                onClick={closeMobile}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive("/cursos")
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-white",
                ].join(" ")}
              >
                Cursos
              </Link>
            )}

            <Link
              to="/makerspaces"
              onClick={closeMobile}
              className={[
                "rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive("/makerspaces")
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-white",
              ].join(" ")}
            >
              Makerspaces
            </Link>

            {user && (
              <Link
                to="/perfil"
                onClick={closeMobile}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive("/perfil")
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-white",
                ].join(" ")}
              >
                Perfil
              </Link>
            )}

            {!user && (
              <button
                onClick={() => {
                  closeMobile();
                  navigate("/entrar");
                }}
                className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow"
              >
                Entrar
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
