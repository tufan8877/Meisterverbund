import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanies, useCreateCompany, useUpdateCompany } from "@/hooks/use-companies";
import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type User } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Shield, ShieldAlert, Plus, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container px-4 sm:px-8 max-w-7xl mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="companies">Betriebe</TabsTrigger>
            <TabsTrigger value="news">Nachrichten</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
          </TabsList>

          <TabsContent value="companies">
            <CompaniesManager />
          </TabsContent>
          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// === SUB-COMPONENTS FOR TABS ===

function CompaniesManager() {
  const { data: companies } = useCompanies();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Verwaltete Betriebe</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Betrieb hinzufügen</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neuen Betrieb anlegen</DialogTitle>
            </DialogHeader>
            <CompanyForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted font-medium">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Gewerk</th>
              <th className="p-4">Stadt</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {companies?.map(company => (
              <tr key={company.id} className="border-t hover:bg-muted/50">
                <td className="p-4 font-medium">{company.name}</td>
                <td className="p-4">{company.category}</td>
                <td className="p-4">{company.city}</td>
                <td className="p-4">
                  {company.isMasterVerified ? (
                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                      <Shield className="w-3 h-3 mr-1" /> Meister
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Standard</span>
                  )}
                </td>
                <td className="p-4">
                  <EditCompanyButton company={company} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompanyForm({ company, onSuccess }: { company?: any, onSuccess: () => void }) {
  const create = useCreateCompany();
  const update = useUpdateCompany();
  const { register, handleSubmit } = useForm({ defaultValues: company || {} });

  const onSubmit = (data: any) => {
    // Transform boolean string to boolean
    const payload = {
      ...data,
      isMasterVerified: Boolean(data.isMasterVerified),
    };
    
    if (company) {
      update.mutate({ id: company.id, ...payload }, { onSuccess });
    } else {
      create.mutate(payload, { onSuccess });
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name des Betriebs</label>
          <Input {...register("name", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium">Gewerk</label>
          <Input {...register("category", { required: true })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Beschreibung</label>
        <Textarea {...register("description", { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Adresse</label>
          <Input {...register("address", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium">Stadt</label>
          <Input {...register("city", { required: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Bundesland</label>
          <Input {...register("state", { required: true })} />
        </div>
        <div>
          <label className="text-sm font-medium">Telefon</label>
          <Input {...register("phone")} />
        </div>
      </div>
      <div>
         <label className="text-sm font-medium">Webseite</label>
         <Input {...register("website")} />
      </div>
      <div>
         <label className="text-sm font-medium">Bild URL</label>
         <Input {...register("imageUrl")} placeholder="https://..." />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="master" {...register("isMasterVerified")} className="h-4 w-4" />
        <label htmlFor="master" className="text-sm font-medium">Meisterbetrieb verifiziert</label>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Speichern..." : "Speichern"}
      </Button>
    </form>
  );
}

function EditCompanyButton({ company }: { company: any }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
           <DialogTitle>Betrieb bearbeiten</DialogTitle>
        </DialogHeader>
        <CompanyForm company={company} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function NewsManager() {
  const { data: posts } = usePosts();
  const create = useCreatePost();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    create.mutate({ ...data, published: true, slug: data.title.toLowerCase().replace(/ /g, '-') }, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">News & Berichte</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Beitrag erstellen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Beitrag erstellen</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titel</label>
                <Input {...register("title", { required: true })} />
              </div>
              <div>
                <label className="text-sm font-medium">Typ</label>
                <select {...register("type")} className="w-full border rounded-md p-2 text-sm bg-background">
                  <option value="news">News</option>
                  <option value="bericht">Bericht</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Inhalt (Markdown)</label>
                <Textarea {...register("contentMarkdown", { required: true })} className="h-40 font-mono" />
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? "Erstellen..." : "Veröffentlichen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {posts?.map(post => (
          <div key={post.id} className="border p-4 rounded-md flex justify-between items-center bg-card">
            <div>
              <div className="font-bold">{post.title}</div>
              <div className="text-sm text-muted-foreground">{post.type} • {new Date(post.createdAt!).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {post.published ? 'Veröffentlicht' : 'Entwurf'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: users } = useQuery<User[]>({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path);
      if (!res.ok) throw new Error("Failed");
      return api.admin.users.responses[200].parse(await res.json());
    }
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ id, blocked }: { id: number; blocked: boolean }) => {
      const url = `api/admin/users/${id}/block`; // constructing manually as url builder logic is specific
      const res = await fetch(`/api/admin/users/${id}/block`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ blocked })
      });
      if(!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      toast({ title: "Updated", description: "User status updated" });
    }
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Benutzerverwaltung</h2>
      <div className="rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted font-medium">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Rolle</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  {user.blocked ? (
                    <span className="text-destructive font-bold flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Blockiert</span>
                  ) : (
                    <span className="text-green-600 flex items-center"><Check className="w-3 h-3 mr-1"/> Aktiv</span>
                  )}
                </td>
                <td className="p-4">
                  {user.role !== 'admin' && (
                    <Button 
                      variant={user.blocked ? "outline" : "destructive"} 
                      size="sm"
                      onClick={() => toggleBlock.mutate({ id: user.id, blocked: !user.blocked })}
                    >
                      {user.blocked ? "Freigeben" : "Blockieren"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
