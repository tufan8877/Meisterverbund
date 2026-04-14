import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useListComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  getListCommentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

interface CommentSectionProps {
  contentType: "blog" | "news" | "ad" | "business";
  contentId: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", {
    year: "numeric", month: "long", day: "numeric"
  });
}

export function CommentSection({ contentType, contentId }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const queryKey = getListCommentsQueryKey({ contentType, contentId });

  const { data, isLoading } = useListComments({ contentType, contentId }, {
    query: { queryKey },
  });

  const createMutation = useCreateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        setNewComment("");
      },
    },
  });

  const updateMutation = useUpdateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        setEditId(null);
      },
    },
  });

  const deleteMutation = useDeleteComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    createMutation.mutate({ data: { content: newComment, contentType, contentId } });
  }

  function handleEdit(id: number, currentContent: string) {
    setEditId(id);
    setEditText(currentContent);
  }

  function handleEditSubmit(id: number) {
    if (!editText.trim()) return;
    updateMutation.mutate({ id, data: { content: editText } });
  }

  function handleDelete(id: number) {
    if (!confirm("Kommentar wirklich loschen?")) return;
    deleteMutation.mutate({ id });
  }

  const comments = data?.comments ?? [];

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground mb-6 pb-3 border-b border-border">
        Kommentare {comments.length > 0 && `(${data?.total})`}
      </h2>

      {/* New comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Schreiben Sie einen Kommentar..."
            className="w-full border border-border rounded-lg p-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[100px] resize-y"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || createMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? "Senden..." : "Kommentar senden"}
            </button>
          </div>
          {createMutation.isError && (
            <p className="text-destructive text-sm mt-2">Fehler beim Senden des Kommentars.</p>
          )}
        </form>
      ) : (
        <div className="bg-muted rounded-lg p-4 mb-8 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary font-medium hover:underline">Anmelden</Link>
          {" "}oder{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">Registrieren</Link>
          {" "}um Kommentare zu schreiben.
        </div>
      )}

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">Noch keine Kommentare. Seien Sie der Erste!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-card border border-card-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-muted-foreground text-xs ml-2">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                {(user?.id === comment.userId || user?.role === "admin") && editId !== comment.id && (
                  <div className="flex gap-1">
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => handleEdit(comment.id, comment.content)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted"
                      >
                        Bearbeiten
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-muted"
                    >
                      Loschen
                    </button>
                  </div>
                )}
              </div>
              {editId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full border border-border rounded p-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-y"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSubmit(comment.id)}
                      disabled={updateMutation.isPending}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
