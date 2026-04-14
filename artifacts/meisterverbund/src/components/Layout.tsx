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
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-accent">M</span>eisterverbund
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 ${location.startsWith(link.href) ? "bg-white/15" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/profil" className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors">
                  Anmelden
                </Link>
                <Link href="/register" className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                  Registrieren
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 space-y-1">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="block px-3 py-2 rounded-md text-sm font-medium bg-accent/20" onClick={() => setMenuOpen(false)}>
                      Admin-Bereich
                    </Link>
                  )}
                  <Link href="/profil" className="block px-3 py-2 rounded-md text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>
                    Mein Profil ({user?.name})
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10">
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded-md text-sm hover:bg-white/10" onClick={() => setMenuOpen(false)}>Anmelden</Link>
                  <Link href="/register" className="block px-3 py-2 rounded-md text-sm bg-accent/20" onClick={() => setMenuOpen(false)}>Registrieren</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-extrabold text-xl mb-3">
              <span className="text-accent">M</span>eisterverbund
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Die Plattform für österreichische Meisterbetriebe. Qualität, Vertrauen und Gemeinschaft seit der Gründung.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground/60">Inhalte</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/news" className="hover:text-accent transition-colors">News</Link></li>
              <li><Link href="/angebote" className="hover:text-accent transition-colors">Angebote</Link></li>
              <li><Link href="/betriebe" className="hover:text-accent transition-colors">Betriebe</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground/60">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/ueber-uns" className="hover:text-accent transition-colors">Über uns</Link></li>
              <li><Link href="/kontakt" className="hover:text-accent transition-colors">Kontakt</Link></li>
              <li><Link href="/impressum" className="hover:text-accent transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-accent transition-colors">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-primary-foreground/40">
          &copy; {new Date().getFullYear()} Meisterverbund. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
