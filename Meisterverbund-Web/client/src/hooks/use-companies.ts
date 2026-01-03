import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertCompany } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCompanies(filters?: { search?: string; state?: string; category?: string }) {
  const queryKey = [api.companies.list.path, filters];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = new URL(api.companies.list.path, window.location.origin);
      if (filters?.search) url.searchParams.set("search", filters.search);
      if (filters?.state) url.searchParams.set("state", filters.state);
      if (filters?.category) url.searchParams.set("category", filters.category);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch companies");
      return api.companies.list.responses[200].parse(await res.json());
    },
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: [api.companies.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.companies.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch company");
      return api.companies.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCompany) => {
      const res = await fetch(api.companies.create.path, {
        method: api.companies.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create company");
      return api.companies.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.companies.list.path] });
      toast({ title: "Success", description: "Company created successfully." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertCompany>) => {
      const url = buildUrl(api.companies.update.path, { id });
      const res = await fetch(url, {
        method: api.companies.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return api.companies.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.companies.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.companies.get.path, data.id] });
      toast({ title: "Success", description: "Company updated successfully." });
    },
  });
}
