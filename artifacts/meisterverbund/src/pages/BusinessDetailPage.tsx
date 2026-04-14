import { Link } from "wouter";
import { useGetBusiness } from "@workspace/api-client-react";
import { StarRating } from "@/components/StarRating";
import { CommentSection } from "@/components/CommentSection";

export function BusinessDetailPage({ slug }: { slug: string }) {
  const { data: biz, isLoading, isError } = useGetBusiness(slug);

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

  if (isError || !biz) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl font-bold mb-3">Betrieb nicht gefunden</h1>
        <Link href="/betriebe" className="text-primary hover:underline">Zurück zu Betrieben</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/betriebe" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
        <span>←</span> Alle Betriebe
      </Link>

      <div className="bg-card border border-card-border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
            {biz.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight mb-1">{biz.name}</h1>
            <p className="text-muted-foreground">{biz.branche}</p>
            <p className="text-sm text-muted-foreground">{biz.stadt}, {biz.bundesland}</p>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-border">
          <StarRating contentType="business" contentId={biz.id} />
        </div>

        {biz.description && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Über uns</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{biz.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
          {biz.telefon && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Telefon</p>
              <a href={`tel:${biz.telefon}`} className="text-primary hover:underline text-sm font-medium">{biz.telefon}</a>
            </div>
          )}
          {biz.email && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">E-Mail</p>
              <a href={`mailto:${biz.email}`} className="text-primary hover:underline text-sm font-medium">{biz.email}</a>
            </div>
          )}
          {biz.website && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Website</p>
              <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                {biz.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Bundesland</p>
            <p className="text-sm font-medium">{biz.bundesland}</p>
          </div>
        </div>
      </div>

      <CommentSection contentType="business" contentId={biz.id} />
    </div>
  );
}
