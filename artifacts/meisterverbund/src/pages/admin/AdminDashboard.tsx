import { useGetAdminStats } from "@workspace/api-client-react";
import { Link } from "wouter";

function StatCard({ label, value, href, color }: { label: string; value: number | undefined; href: string; color: string }) {
  return (
    <Link href={href} className="group">
      <div className={`bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-3xl font-extrabold ${color}`}>
          {value !== undefined ? value.toLocaleString("de-AT") : "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">Details anzeigen →</p>
      </div>
    </Link>
  );
}

export function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Übersicht</h1>
      <p className="text-muted-foreground text-sm mb-8">Willkommen im Meisterverbund Admin-Bereich</p>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Benutzer" value={stats?.userCount} href="/admin/benutzer" color="text-primary" />
          <StatCard label="Blog-Beiträge" value={stats?.blogCount} href="/admin/blog" color="text-blue-600" />
          <StatCard label="News" value={stats?.newsCount} href="/admin/news" color="text-emerald-600" />
          <StatCard label="Angebote" value={stats?.adCount} href="/admin/angebote" color="text-amber-600" />
          <StatCard label="Betriebe" value={stats?.businessCount} href="/admin/betriebe" color="text-purple-600" />
          <StatCard label="Kommentare" value={stats?.commentCount} href="/admin/kommentare" color="text-rose-600" />
          <StatCard label="Bewertungen" value={stats?.ratingCount} href="/admin/kommentare" color="text-orange-600" />
          <StatCard label="Geblockte User" value={stats?.blockedUserCount} href="/admin/benutzer" color="text-destructive" />
        </div>
      )}

      <div className="bg-card border border-card-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/blog/neu", label: "Blog-Beitrag erstellen" },
            { href: "/admin/news/neu", label: "News erstellen" },
            { href: "/admin/angebote/neu", label: "Anzeige erstellen" },
            { href: "/admin/betriebe/neu", label: "Betrieb erstellen" },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="block p-3 border border-border rounded-lg text-sm font-medium text-center hover:bg-muted hover:border-primary/30 transition-colors"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
