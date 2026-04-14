import { useState } from "react";
import { useListAllComments, useDeleteComment, getListAllCommentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const contentTypeLabels: Record<string, string> = {
  blog: "Blog",
  news: "News",
  ad: "Anzeige",
  business: "Betrieb",
};

export function AdminComments() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListAllCommentsQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListAllComments({ limit, offset: page * limit }, {
    query: { queryKey },
  });

  const deleteMutation = useDeleteComment({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) },
  });

  function handleDelete(id: number) {
    if (!confirm("Kommentar wirklich löschen?")) return;
    deleteMutation.mutate({ id });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kommentare</h1>

      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Benutzer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inhalt</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Typ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Datum</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 5 }, (_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.comments?.map(comment => (
                <tr key={comment.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{comment.userName}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">
                    <span className="line-clamp-2">{comment.content}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 bg-muted rounded text-xs font-medium">
                      {contentTypeLabels[comment.contentType] ?? comment.contentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(comment.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteMutation.isPending}
                      className="px-2 py-1 text-xs border border-destructive/30 text-destructive rounded hover:bg-destructive/10 transition-colors"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.total > limit && (
          <div className="flex justify-center gap-2 p-4 border-t border-border">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Zurück</button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground">Seite {page + 1} von {Math.ceil(data.total / limit)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= data.total} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Weiter</button>
          </div>
        )}
      </div>
    </div>
  );
}
