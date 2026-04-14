import { useState } from "react";
import { useListUsers, useBlockUser, useUnblockUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function AdminUsers() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListUsersQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListUsers({ limit, offset: page * limit }, {
    query: { queryKey },
  });

  const blockMutation = useBlockUser({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) },
  });
  const unblockMutation = useUnblockUser({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Benutzer</h1>

      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">E-Mail</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rolle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Erstellt</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.users?.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === "admin" ? "bg-accent/15 text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {user.role === "admin" ? "Admin" : "Benutzer"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      user.isBlocked ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-800"
                    }`}>
                      {user.isBlocked ? "Gesperrt" : "Aktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {user.isBlocked ? (
                        <button
                          onClick={() => unblockMutation.mutate({ id: user.id })}
                          disabled={unblockMutation.isPending}
                          className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
                        >
                          Entsperren
                        </button>
                      ) : (
                        <button
                          onClick={() => blockMutation.mutate({ id: user.id })}
                          disabled={blockMutation.isPending || user.role === "admin"}
                          className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          Sperren
                        </button>
                      )}
                    </div>
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
