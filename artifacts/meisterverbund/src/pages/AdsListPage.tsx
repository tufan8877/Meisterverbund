import { useState } from "react";
import { Link } from "wouter";
import { useListAdPosts } from "@workspace/api-client-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" });
}

export function AdsListPage() {
  const [page, setPage] = useState(0);
  const limit = 9;
  const { data, isLoading } = useListAdPosts({ limit, offset: page * limit });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Angebote &amp; Anzeigen</h1>
        <p className="text-muted-foreground">Stellenangebote, Betriebsübergaben und branchenrelevante Anzeigen</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
              <div className="h-5 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.posts?.map(post => (
              <Link key={post.id} href={`/angebote/${post.slug}`} className="group">
                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded font-medium mb-2">
                        {post.category}
                      </span>
                      <h2 className="font-bold text-base mb-2 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                    <div className="shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
