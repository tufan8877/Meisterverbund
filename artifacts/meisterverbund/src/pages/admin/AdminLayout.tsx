import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

const adminNavLinks = [
  { href: "/admin", label: "Übersicht", exact: true },
  { href: "/admin/benutzer", label: "Benutzer" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/angebote", label: "Angebote" },
  { href: "/admin/betriebe", label: "Betriebe" },
  { href: "/admin/kommentare", label: "Kommentare" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin header */}
      <header className="bg-sidebar text-sidebar-foreground shadow-md border-b border-sidebar-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-lg hover:opacity-80 transition-opacity">
              <span className="text-sidebar-primary">M</span>eisterverbund
            </Link>
            <span className="text-sidebar-foreground/40">|</span>
            <span className="text-sm font-medium text-sidebar-foreground/70">Admin-Bereich</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-sidebar-foreground/60">{user?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 hidden md:block">
          <nav className="p-3 space-y-0.5">
            {adminNavLinks.map(link => {
              const isActive = link.exact ? location === link.href : location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-border bg-card px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {adminNavLinks.map(link => {
              const isActive = link.exact ? location === link.href : location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto max-w-[1200px]">
          {children}
        </main>
      </div>
    </div>
  );
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    setLocation("/");
    return null;
  }

  return <>{children}</>;
}
