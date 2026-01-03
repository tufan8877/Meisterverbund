import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertReview } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useReviews(companyId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, companyId],
    queryFn: async () => {
      const url = new URL(api.reviews.list.path, window.location.origin);
      url.searchParams.set("companyId", String(companyId));
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!companyId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertReview, "userId">) => {
      const res = await fetch(api.reviews.create.path, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Please login to leave a review");
        throw new Error("Failed to post review");
      }
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, variables.companyId] });
      queryClient.invalidateQueries({ queryKey: [api.companies.get.path, variables.companyId] });
      toast({ title: "Review posted", description: "Thank you for your feedback!" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
