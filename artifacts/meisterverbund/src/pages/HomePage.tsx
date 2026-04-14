import { Link } from "wouter";
import { useListBlogPosts, useListBusinesses, useListFeaturedBusinesses } from "@workspace/api-client-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", { day: "2-digit", month: "short", year: "numeric" });
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full">
      Betrieb des Monats
    </span>
  );
}

export function HomePage() {
  const { data: blogData } = useListBlogPosts({ limit: 3, offset: 0 });
  const { data: bizData } = useListBusinesses({ limit: 6, offset: 0 });
  const { data: featuredData } = useListFeaturedBusinesses();

  const featuredBusinesses = featuredData?.businesses ?? [];
  const featuredLabel = featuredData?.label ?? null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Die Plattform für<br />
            <span className="text-accent">österreichische</span> Meisterbetriebe
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Finden Sie qualifizierte Handwerksmeister in Ihrer Nähe. Lesen Sie Fachbeiträge, 
            aktuelle News und entdecken Sie Angebote aus der Branche.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/betriebe" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Betriebe finden
            </Link>
            <Link href="/register" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">
              Jetzt registrieren
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "★", title: "Verifizierte Meister", desc: "Alle gelisteten Betriebe verfügen über einen anerkannten Meistertitel und jahrelange Erfahrung." },
            { icon: "◎", title: "Regionale Suche", desc: "Finden Sie Meisterbetriebe in allen neun österreichischen Bundesländern ganz einfach." },
            { icon: "✔", title: "Bewertungen & Kommentare", desc: "Lesen Sie echte Erfahrungen anderer Kunden und hinterlassen Sie Ihre eigene Bewertung." },
          ].map(feature => (
            <div key={feature.title} className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
              <div className="text-3xl text-accent mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meisterbetriebe des Monats */}
      {featuredBusinesses.length > 0 && (
        <section className="bg-primary/5 border-y border-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-extrabold">Meisterbetriebe des Monats</h2>
                  {featuredLabel && (
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">
                      {featuredLabel}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Unsere handverlesene Auswahl der besten Meisterbetriebe diesen Monat
                </p>
              </div>
              <Link href="/betriebe" className="text-primary text-sm font-medium hover:underline shrink-0">
                Alle Betriebe
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((biz, idx) => (
                <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="group">
                  <div className="bg-card border-2 border-accent/30 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/60 transition-all relative overflow-hidden">
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Nr. 1
                      </div>
                    )}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-extrabold text-2xl shrink-0 border border-primary/20">
                        {biz.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-tight mb-0.5 truncate">
                          {biz.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{biz.branche}</p>
                        <p className="text-xs text-muted-foreground">{biz.stadt}, {biz.bundesland}</p>
                      </div>
                    </div>

                    {biz.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{biz.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <FeaturedBadge />
                      {biz.averageRating !== null && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="text-accent font-bold">{biz.averageRating.toFixed(1)}</span>
                          <span className="text-accent">★</span>
                          <span>({biz.ratingCount})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest blog posts */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Aktuelle Blog-Beiträge</h2>
            <Link href="/blog" className="text-primary text-sm font-medium hover:underline">Alle Beiträge</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogData?.posts?.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-card border border-card-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </Link>
            )) ?? (
              Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
                  <div className="h-5 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* All businesses preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Alle Meisterbetriebe</h2>
          <Link href="/betriebe" className="text-primary text-sm font-medium hover:underline">Betriebsverzeichnis</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bizData?.businesses?.map(biz => (
            <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="group">
              <div className="bg-card border border-card-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {biz.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{biz.name}</h3>
                      {biz.isFeatured && <span className="shrink-0 w-2 h-2 rounded-full bg-accent" title="Betrieb des Monats" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{biz.branche}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{biz.stadt}, {biz.bundesland}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-accent-foreground mb-3">Sind Sie ein Meisterbetrieb?</h2>
          <p className="text-accent-foreground/80 mb-6">Registrieren Sie sich und präsentieren Sie Ihren Betrieb auf Meisterverbund.</p>
          <Link href="/register" className="inline-block px-6 py-3 bg-accent-foreground text-primary-foreground rounded-lg font-semibold hover:bg-accent-foreground/90 transition-colors">
            Kostenlos registrieren
          </Link>
        </div>
      </section>
    </div>
  );
}
