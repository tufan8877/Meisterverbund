import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@workspace/api-client-react";

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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
        <div className="flex min-h-[84px] items-center justify-between py-3">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <div className="flex flex-col leading-none">
              <span className="text-[30px] font-extrabold tracking-tight sm:text-[36px] lg:text-[40px]">
                <span className="text-accent">M</span>eisterverbund
              </span>
              <span className="mt-1 text-[10px] font-medium text-primary-foreground/80 sm:text-[11px] lg:text-xs">
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
                  {user?.name ?? "Profil"}
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
                  href="/login"
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  Anmelden
                </Link>

                <Link
                  href="/register"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10 lg:hidden"
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

            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
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
                    {user?.name ? `Profil (${user.name})` : "Profil"}
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
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    Anmelden
                  </Link>

                  <Link
                    href="/register"
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

export function Footer() {
  return (
    <footer className="mt-16 bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 text-2xl font-extrabold sm:text-3xl">
              <span className="text-accent">M</span>eisterverbund
            </div>
            <p className="mb-2 text-sm font-medium text-primary-foreground/85">
              Plattform für österreichische Meisterbetriebe 🇦🇹
            </p>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Die Plattform für österreichische Meisterbetriebe. Qualität, Vertrauen und Gemeinschaft.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Inhalte
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/blog" className="transition-colors hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition-colors hover:text-accent">
                  News
                </Link>
              </li>
              <li>
                <Link href="/angebote" className="transition-colors hover:text-accent">
                  Angebote
                </Link>
              </li>
              <li>
                <Link href="/betriebe" className="transition-colors hover:text-accent">
                  Betriebe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Rechtliches
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/ueber-uns" className="transition-colors hover:text-accent">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="transition-colors hover:text-accent">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="transition-colors hover:text-accent">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="transition-colors hover:text-accent">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Meisterverbund. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
