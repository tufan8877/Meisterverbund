import { Link } from "wouter";
import { useGetAdPost } from "@workspace/api-client-react";
import { StarRating } from "@/components/StarRating";
import { CommentSection } from "@/components/CommentSection";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

export function AdDetailPage({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useGetAdPost(slug);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => <div key={i} className="h-4 bg-muted rounded"></div>)}
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl font-bold mb-3">Anzeige nicht gefunden</h1>
        <Link href="/angebote" className="text-primary hover:underline">Zuruck zu Angeboten</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/angebote" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
        <span>←</span> Alle Angebote
      </Link>

      <article className="bg-card border border-card-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded font-medium">
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3 leading-tight">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-4">{formatDate(post.createdAt)}</p>

        <div className="mb-6 pb-6 border-b border-border">
          <StarRating contentType="ad" contentId={post.id} />
        </div>

        <p className="text-base text-muted-foreground leading-relaxed mb-6 italic">{post.excerpt}</p>

        <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
          {post.content.split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <CommentSection contentType="ad" contentId={post.id} />
    </div>
  );
}
