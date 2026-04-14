import { useState } from "react";
import { Link } from "wouter";
import {
  useListBlogPosts, useDeleteBlogPost, useCreateBlogPost, useUpdateBlogPost, getListBlogPostsQueryKey,
  useListNewsPosts, useDeleteNewsPost, useCreateNewsPost, useUpdateNewsPost, getListNewsPostsQueryKey,
  useListAdPosts, useDeleteAdPost, useCreateAdPost, useUpdateAdPost, getListAdPostsQueryKey,
  useListBusinesses, useDeleteBusiness, useCreateBusiness, useUpdateBusiness, getListBusinessesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface ContentTableProps {
  title: string;
  items: Array<{ id: number; title: string; slug: string; category: string; published: boolean; createdAt: string }> | undefined;
  isLoading: boolean;
  total: number;
  limit: number;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  onDelete: (id: number, title: string) => void;
  onEdit: (item: any) => void;
  createHref: string;
}

function ContentTable({ title, items, isLoading, total, limit, page, setPage, onDelete, onEdit, createHref }: ContentTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link href={createHref} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Neu erstellen
        </Link>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Titel</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Erstellt</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktionen</th>
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
              ) : items?.map(item => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs">
                    <span className="line-clamp-1">{item.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      item.published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                    }`}>
                      {item.published ? "Veröffentlicht" : "Entwurf"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => onDelete(item.id, item.title)}
                        className="px-2 py-1 text-xs border border-destructive/30 text-destructive rounded hover:bg-destructive/10 transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > limit && (
          <div className="flex justify-center gap-2 p-4 border-t border-border">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Zurück</button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground">Seite {page + 1} von {Math.ceil(total / limit)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= total} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Weiter</button>
          </div>
        )}
      </div>
    </div>
  );
}

interface PostFormProps {
  initial?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isPending: boolean;
  type: "blog" | "news" | "ad";
}

function PostForm({ initial, onSubmit, onCancel, isPending, type }: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, excerpt, content, category, published });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Titel</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Kategorie</label>
        <input value={category} onChange={e => setCategory(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Zusammenfassung</label>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} required rows={2} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Inhalt</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded border-border" />
        <label htmlFor="published" className="text-sm font-medium">Veröffentlicht</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {isPending ? "Speichern..." : "Speichern"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

// ---- Blog Admin ----
export function AdminBlog({ isNew = false }: { isNew?: boolean }) {
  const [page, setPage] = useState(0);
  const [editItem, setEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(isNew);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListBlogPostsQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListBlogPosts({ limit, offset: page * limit }, { query: { queryKey } });
  const deleteMutation = useDeleteBlogPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) } });
  const createMutation = useCreateBlogPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setShowForm(false); } } });
  const updateMutation = useUpdateBlogPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setEditItem(null); } } });

  if (showForm || editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{editItem ? "Beitrag bearbeiten" : "Neuer Blog-Beitrag"}</h1>
        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <PostForm
            initial={editItem}
            type="blog"
            isPending={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            onSubmit={(data) => {
              if (editItem) {
                updateMutation.mutate({ id: editItem.id, data });
              } else {
                createMutation.mutate({ data });
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ContentTable
      title="Blog-Beiträge"
      items={data?.posts}
      isLoading={isLoading}
      total={data?.total ?? 0}
      limit={limit}
      page={page}
      setPage={setPage}
      createHref="/admin/blog/neu"
      onDelete={(id, title) => {
        if (!confirm(`"${title}" wirklich löschen?`)) return;
        deleteMutation.mutate({ id });
      }}
      onEdit={(item) => setEditItem(item)}
    />
  );
}

// ---- News Admin ----
export function AdminNews({ isNew = false }: { isNew?: boolean }) {
  const [page, setPage] = useState(0);
  const [editItem, setEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(isNew);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListNewsPostsQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListNewsPosts({ limit, offset: page * limit }, { query: { queryKey } });
  const deleteMutation = useDeleteNewsPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) } });
  const createMutation = useCreateNewsPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setShowForm(false); } } });
  const updateMutation = useUpdateNewsPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setEditItem(null); } } });

  if (showForm || editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{editItem ? "News bearbeiten" : "Neue News"}</h1>
        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <PostForm
            initial={editItem}
            type="news"
            isPending={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            onSubmit={(data) => {
              if (editItem) updateMutation.mutate({ id: editItem.id, data });
              else createMutation.mutate({ data });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ContentTable
      title="News"
      items={data?.posts}
      isLoading={isLoading}
      total={data?.total ?? 0}
      limit={limit}
      page={page}
      setPage={setPage}
      createHref="/admin/news/neu"
      onDelete={(id, title) => {
        if (!confirm(`"${title}" wirklich löschen?`)) return;
        deleteMutation.mutate({ id });
      }}
      onEdit={(item) => setEditItem(item)}
    />
  );
}

// ---- Ads Admin ----
export function AdminAds({ isNew = false }: { isNew?: boolean }) {
  const [page, setPage] = useState(0);
  const [editItem, setEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(isNew);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListAdPostsQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListAdPosts({ limit, offset: page * limit }, { query: { queryKey } });
  const deleteMutation = useDeleteAdPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) } });
  const createMutation = useCreateAdPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setShowForm(false); } } });
  const updateMutation = useUpdateAdPost({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setEditItem(null); } } });

  if (showForm || editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{editItem ? "Anzeige bearbeiten" : "Neue Anzeige"}</h1>
        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <PostForm
            initial={editItem}
            type="ad"
            isPending={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            onSubmit={(data) => {
              if (editItem) updateMutation.mutate({ id: editItem.id, data });
              else createMutation.mutate({ data });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ContentTable
      title="Angebote & Anzeigen"
      items={data?.posts}
      isLoading={isLoading}
      total={data?.total ?? 0}
      limit={limit}
      page={page}
      setPage={setPage}
      createHref="/admin/angebote/neu"
      onDelete={(id, title) => {
        if (!confirm(`"${title}" wirklich löschen?`)) return;
        deleteMutation.mutate({ id });
      }}
      onEdit={(item) => setEditItem(item)}
    />
  );
}

// ---- Business Admin Form ----
interface BizFormProps {
  initial?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isPending: boolean;
}

const BUNDESLAENDER = ["Wien", "Niederösterreich", "Oberösterreich", "Steiermark", "Tirol", "Kärnten", "Salzburg", "Vorarlberg", "Burgenland"];

function BusinessForm({ initial, onSubmit, onCancel, isPending }: BizFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [bundesland, setBundesland] = useState(initial?.bundesland ?? "Wien");
  const [stadt, setStadt] = useState(initial?.stadt ?? "");
  const [branche, setBranche] = useState(initial?.branche ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [telefon, setTelefon] = useState(initial?.telefon ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, bundesland, stadt, branche, description: description || undefined, telefon: telefon || undefined, email: email || undefined, website: website || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Branche</label>
          <input value={branche} onChange={e => setBranche(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Bundesland</label>
          <select value={bundesland} onChange={e => setBundesland(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
            {BUNDESLAENDER.map(bl => <option key={bl} value={bl}>{bl}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Stadt</label>
          <input value={stadt} onChange={e => setStadt(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Telefon</label>
          <input value={telefon} onChange={e => setTelefon(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">E-Mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Website</label>
        <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Beschreibung</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {isPending ? "Speichern..." : "Speichern"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">
          Abbrechen
        </button>
      </div>
    </form>
  );
}

// ---- Businesses Admin ----
export function AdminBusinesses({ isNew = false }: { isNew?: boolean }) {
  const [page, setPage] = useState(0);
  const [editItem, setEditItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(isNew);
  const limit = 20;
  const queryClient = useQueryClient();
  const queryKey = getListBusinessesQueryKey({ limit, offset: page * limit });

  const { data, isLoading } = useListBusinesses({ limit, offset: page * limit }, { query: { queryKey } });
  const deleteMutation = useDeleteBusiness({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) } });
  const createMutation = useCreateBusiness({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey }); setShowForm(false); } } });
  const updateMutation = useUpdateBusiness({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey }) } });

  if (showForm || editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{editItem ? "Betrieb bearbeiten" : "Neuer Betrieb"}</h1>
        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <BusinessForm
            initial={editItem}
            isPending={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            onSubmit={(formData) => {
              if (editItem) updateMutation.mutate({ slug: editItem.slug, data: formData }, { onSuccess: () => setEditItem(null) });
              else createMutation.mutate({ data: formData });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Betriebe</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Neu erstellen
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Branche</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bundesland</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stadt</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Monats-Betrieb</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                    ))}
                  </tr>
                ))
              ) : data?.businesses?.map(biz => (
                <tr key={biz.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{biz.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{biz.branche}</td>
                  <td className="px-4 py-3 text-muted-foreground">{biz.bundesland}</td>
                  <td className="px-4 py-3 text-muted-foreground">{biz.stadt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateMutation.mutate({ slug: biz.slug, data: { isFeatured: !biz.isFeatured } })}
                      disabled={updateMutation.isPending}
                      className={`px-2 py-1 text-xs rounded font-medium border transition-colors disabled:opacity-50 ${
                        biz.isFeatured
                          ? "bg-accent/15 text-accent-foreground border-accent/40 hover:bg-accent/25"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {biz.isFeatured ? "Aktiv" : "Inaktiv"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditItem(biz)} className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors">Bearbeiten</button>
                      <button
                        onClick={() => { if (!confirm(`"${biz.name}" wirklich löschen?`)) return; deleteMutation.mutate({ id: biz.id }); }}
                        className="px-2 py-1 text-xs border border-destructive/30 text-destructive rounded hover:bg-destructive/10 transition-colors"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(data?.total ?? 0) > limit && (
          <div className="flex justify-center gap-2 p-4 border-t border-border">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Zurück</button>
            <span className="px-3 py-1.5 text-sm text-muted-foreground">Seite {page + 1} von {Math.ceil((data?.total ?? 0) / limit)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= (data?.total ?? 0)} className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted disabled:opacity-50">Weiter</button>
          </div>
        )}
      </div>
    </div>
  );
}
