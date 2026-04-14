import { useState } from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" });
}

export function BlogListPage() {
  const [page, setPage] = useState(0);
  const limit = 9;
  const { data, isLoading } = useListBlogPosts({ limit, offset: page * limit });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">Fachbeiträge rund um das österreichische Handwerk</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
              <div className="h-5 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/5 mb-1"></div>
              <div className="h-4 bg-muted rounded w-3/5"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.posts?.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow h-full">
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium mb-3">
                    {post.category}
                  </span>
                  <h2 className="font-bold text-base mb-2 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>

          {data && data.total > limit && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Zurück
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Seite {page + 1} von {Math.ceil(data.total / limit)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * limit >= data.total}
                className="px-4 py-2 border border-border rounded-md text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
