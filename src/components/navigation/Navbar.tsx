import { clsx } from "clsx";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Logo from "../../assets/TVFlowLogo.png";
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Filmes", to: "/movies" },
  { label: "Séries", to: "/tv" },
  { label: "Buscar", to: "/search" },
  { label: "Favoritos", to: "/favorites" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "text-sm font-medium transition-colors hover:text-text",
      isActive ? "text-text" : "text-text-muted",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          {/*TvFlow*/}
          <img src={Logo} alt="TVFlow" className="h-13 w-auto" />
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <NavLink
              to="/profile"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-sm font-semibold text-text"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name?.charAt(0).toUpperCase() ?? "?")
              )}
            </NavLink>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="text-sm font-medium text-text-muted hover:text-text"
              >
                Entrar
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Criar conta
              </NavLink>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-text md:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-text" />
            <span className="h-0.5 w-6 bg-text" />
            <span className="h-0.5 w-6 bg-text" />
          </div>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="animate-slide-in-down flex flex-col gap-1 border-t border-border bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {isAuthenticated ? (
              <NavLink
                to="/profile"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Meu perfil
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </NavLink>
                <NavLink
                  to="/register"
                  className={linkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Criar conta
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
