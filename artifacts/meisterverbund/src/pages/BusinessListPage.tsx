import { useState } from "react";
import { Link } from "wouter";
import { useListBusinesses } from "@workspace/api-client-react";

const BUNDESLAENDER = [
  "Alle",
  "Wien",
  "Niederösterreich",
  "Oberösterreich",
  "Steiermark",
  "Tirol",
  "Kärnten",
  "Salzburg",
  "Vorarlberg",
  "Burgenland",
];

export function BusinessListPage() {
  const [page, setPage] = useState(0);
  const [bundesland, setBundesland] = useState("");
  const [search, setSearch] = useState("");
  const limit = 12;

  const { data, isLoading } = useListBusinesses({
    limit,
    offset: page * limit,
    bundesland: bundesland || undefined,
    search: search || undefined,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meisterbetriebe</h1>
        <p className="text-muted-foreground">Qualifizierte Meisterbetriebe in ganz Österreich</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-card-border rounded-xl p-4 mb-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Betrieb suchen..."
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <select
            value={bundesland}
            onChange={e => { setBundesland(e.target.value); setPage(0); }}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {BUNDESLAENDER.map(bl => (
              <option key={bl} value={bl === "Alle" ? "" : bl}>{bl}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Suchen
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {data?.businesses?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Keine Betriebe gefunden.</p>
              <p className="text-sm mt-1">Versuchen Sie andere Suchbegriffe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.businesses?.map(biz => (
                <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="group">
                  <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {biz.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{biz.name}</h2>
                        <p className="text-xs text-muted-foreground">{biz.branche}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{biz.stadt}, {biz.bundesland}</p>
                      </div>
                    </div>
                    {biz.description && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{biz.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {data && data.total > limit && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted disabled:opacity-50"
              >
                Zurück
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">Seite {page + 1} von {Math.ceil(data.total / limit)}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * limit >= data.total}
                className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
