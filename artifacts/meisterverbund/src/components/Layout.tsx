import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@workspace/api-client-react";

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const logoutMutation = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  function handleLogout() {
    logoutMutation.mutate({});
    logout();
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/news", label: "News" },
    { href: "/angebote", label: "Angebote" },
    { href: "/betriebe", label: "Betriebe" },
    { href: "/ueber-uns", label: "Über uns" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[82px] items-center justify-between py-3">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <div className="flex flex-col leading-none">
              <span className="text-[28px] font-extrabold tracking-tight sm:text-[34px] lg:text-[38px]">
                <span className="text-accent">M</span>eisterverbund
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-primary-foreground/80 sm:text-[11px] lg:text-xs">
                Plattform für österreichische Meisterbetriebe 🇦🇹
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location === link.href || location.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                    active ? "bg-white/15" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Admin
                  </Link>
                )}

                <Link
                  href="/profil"
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  Profil
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/anmelden"
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  Anmelden
                </Link>

                <Link
                  href="/registrieren"
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Menü öffnen"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-primary lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = location === link.href || location.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10 ${
                      active ? "bg-white/15" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      Admin
                    </Link>
                  )}

                  <Link
                    href="/profil"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    Profil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/anmelden"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    Anmelden
                  </Link>

                  <Link
                    href="/registrieren"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
    </div>
  );
}
