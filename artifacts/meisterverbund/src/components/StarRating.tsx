import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGetRating, useCreateOrUpdateRating, getGetRatingQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

interface StarRatingProps {
  contentType: "blog" | "news" | "ad" | "business";
  contentId: number;
}

export function StarRating({ contentType, contentId }: StarRatingProps) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState<number | null>(null);

  const { data: ratingData } = useGetRating({ contentType, contentId }, {
    query: { queryKey: getGetRatingQueryKey({ contentType, contentId }) },
  });

  const mutation = useCreateOrUpdateRating({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetRatingQueryKey({ contentType, contentId }) });
      },
    },
  });

  const averageRating = ratingData?.averageRating ?? null;
  const ratingCount = ratingData?.ratingCount ?? 0;
  const userRating = ratingData?.userRating ?? null;

  function handleStarClick(stars: number) {
    if (!isAuthenticated) return;
    mutation.mutate({ data: { stars, contentType, contentId } });
  }

  const displayStars = hovered ?? userRating ?? Math.round(averageRating ?? 0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => isAuthenticated ? setHovered(star) : undefined}
            onMouseLeave={() => setHovered(null)}
            className={`text-xl transition-colors ${isAuthenticated ? "cursor-pointer" : "cursor-default"} ${
              star <= displayStars ? "text-accent" : "text-border"
            }`}
            disabled={!isAuthenticated || mutation.isPending}
          >
            ★
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">
        {averageRating !== null
          ? <span><strong className="text-foreground">{averageRating.toFixed(1)}</strong> ({ratingCount} {ratingCount === 1 ? "Bewertung" : "Bewertungen"})</span>
          : <span>Noch keine Bewertungen</span>
        }
        {userRating && <span className="text-primary ml-1">(Ihre: {userRating}★)</span>}
      </div>
      {!isAuthenticated && (
        <Link href="/login" className="text-xs text-primary hover:underline">Anmelden zum Bewerten</Link>
      )}
    </div>
  );
}
