import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" });
}

export function ProfilePage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Mein Profil</h1>

      <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-accent/15 text-accent-foreground text-xs rounded font-medium">
                Administrator
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Rolle</p>
            <p className="text-sm font-medium capitalize">{user?.role === "admin" ? "Administrator" : "Benutzer"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Mitglied seit</p>
            <p className="text-sm font-medium">{user?.createdAt ? formatDate(user.createdAt) : "—"}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-border">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Admin-Bereich
            </Link>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-border">
          <button
            onClick={() => { logout(); setLocation("/"); }}
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}
