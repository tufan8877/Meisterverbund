import { Link } from "wouter";
import { useListBlogPosts, useListBusinesses, useListFeaturedBusinesses } from "@workspace/api-client-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function HomePage() {
  const { data: blogData } = useListBlogPosts({ limit: 3, offset: 0 });
  const { data: bizData } = useListBusinesses({ limit: 6, offset: 0 });
  const { data: featuredData } = useListFeaturedBusinesses();

  const featuredBusinesses = featuredData?.businesses ?? [];
  const featuredLabel = featuredData?.label ?? "April 2026";

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Finden Sie qualifizierte Handwerksmeister in Ihrer Nähe. Lesen Sie
            <br />
            Fachbeiträge, aktuelle News und entdecken Sie Angebote aus der Branche.
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/betriebe"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Betriebe finden
            </Link>

            <Link
              href="/kontakt"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
            >
              Jetzt kontaktieren
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "★",
              title: "Verifizierte Meister",
              desc: "Alle gelisteten Betriebe verfügen über einen anerkannten Meistertitel und jahrelange Erfahrung.",
            },
            {
              icon: "◎",
              title: "Regionale Suche",
              desc: "Finden Sie Meisterbetriebe in allen neun österreichischen Bundesländern ganz einfach.",
            },
            {
              icon: "✔",
              title: "Bewertungen & Kommentare",
              desc: "Lesen Sie echte Erfahrungen anderer Kunden und hinterlassen Sie Ihre eigene Bewertung.",
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-card border border-card-border rounded-2xl p-6 shadow-sm">
              <div className="text-2xl text-accent mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[34px] leading-none font-extrabold tracking-tight text-foreground">
                Meisterbetriebe des Monats
              </h2>

              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                {featuredLabel}
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Unsere handverlesene Auswahl der besten Meisterbetriebe diesen Monat
            </p>
          </div>

          <Link href="/betriebe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Alle Betriebe
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(featuredBusinesses.length > 0 ? featuredBusinesses.slice(0, 3) : []).map((biz, index) => (
            <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="block">
              <div className="rounded-2xl border border-[#e7e7e7] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e7efea] text-[28px] font-bold text-[#527061]">
                    {biz.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[22px] font-bold leading-tight text-foreground">
                          {biz.name}
                        </h3>
                        <p className="text-[15px] text-muted-foreground">{biz.branche}</p>
                        <p className="text-[15px] text-muted-foreground">
                          {biz.stadt}, {biz.bundesland}
                        </p>
                      </div>

                      {index === 0 && (
                        <span className="inline-flex shrink-0 items-center rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                          Nr. 1
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-[15px] leading-6 text-muted-foreground">
                      {biz.description && biz.description.length > 95
                        ? `${biz.description.slice(0, 95)}...`
                        : biz.description || "Ausgezeichneter Meisterbetrieb mit Qualität, Erfahrung und regionaler Kompetenz."}
                    </p>

                    <div className="mt-5">
                      <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                        Betrieb des Monats
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {featuredBusinesses.length === 0 &&
            [
              {
                id: "1",
                slug: "tischlerei-huber-gmbh",
                name: "Tischlerei Huber GmbH",
                branche: "Tischlerei",
                stadt: "Wien",
                bundesland: "Wien",
                description: "Traditionelle Tischlerei in Wien seit 1978. Maßmöbel, Einbauküchen und historische Restaurierungen.",
              },
              {
                id: "2",
                slug: "malerei-kirchner-kg",
                name: "Malerei Kirchner KG",
                branche: "Malerei & Anstrich",
                stadt: "Graz",
                bundesland: "Steiermark",
                description: "Malerei und Anstricharbeiten auf höchstem Niveau seit über 20 Jahren in Graz und der Steiermark.",
              },
              {
                id: "3",
                slug: "baeckerei-meister-gruber",
                name: "Bäckerei Meister Gruber",
                branche: "Bäckerei",
                stadt: "Salzburg",
                bundesland: "Salzburg",
                description: "Traditionelle Bäckerei im Herzen von Salzburg. Täglich frisches Brot und Gebäck nach Meisterhand.",
              },
            ].map((biz, index) => (
              <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="block">
                <div className="rounded-2xl border border-[#e7e7e7] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e7efea] text-[28px] font-bold text-[#527061]">
                      {biz.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[22px] font-bold leading-tight text-foreground">
                            {biz.name}
                          </h3>
                          <p className="text-[15px] text-muted-foreground">{biz.branche}</p>
                          <p className="text-[15px] text-muted-foreground">
                            {biz.stadt}, {biz.bundesland}
                          </p>
                        </div>

                        {index === 0 && (
                          <span className="inline-flex shrink-0 items-center rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                            Nr. 1
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-[15px] leading-6 text-muted-foreground">
                        {biz.description}
                      </p>

                      <div className="mt-5">
                        <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                          Betrieb des Monats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Aktuelle Blog-Beiträge</h2>
            <Link href="/blog" className="text-primary text-sm font-medium hover:underline">
              Alle Beiträge
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogData?.posts?.map((post) => (
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Alle Meisterbetriebe</h2>
          <Link href="/betriebe" className="text-primary text-sm font-medium hover:underline">
            Alle Betriebe
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bizData?.businesses?.map((biz) => (
            <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="block">
              <div className="rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e7efea] text-[24px] font-bold text-[#527061]">
                    {biz.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-[20px] font-bold leading-tight text-foreground">{biz.name}</h3>
                    <p className="text-[15px] text-muted-foreground">{biz.branche}</p>
                    <p className="text-[15px] text-muted-foreground">
                      {biz.stadt}, {biz.bundesland}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )) ?? null}
        </div>
      </section>

      <section className="bg-accent py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[42px] leading-tight font-extrabold text-accent-foreground mb-4">
            Sind Sie ein Meisterbetrieb?
          </h2>

          <p className="text-[22px] leading-relaxed text-accent-foreground/90 mb-8">
            Melden Sie sich bei uns für einen Beitrag über Ihr Unternehmen.
          </p>

          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-xl bg-[#1d2b27] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:opacity-90"
          >
            Kontaktieren
          </Link>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground pt-14 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="text-3xl font-extrabold mb-4">
              <span className="text-accent">M</span>eisterverbund
            </div>
            <p className="text-primary-foreground/80 leading-7">
              Die Plattform für österreichische Meisterbetriebe. Qualität, Vertrauen und Gemeinschaft seit der Gründung.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 uppercase tracking-wide">Inhalte</h3>
            <div className="space-y-2">
              <Link href="/blog" className="block text-primary-foreground/80 hover:text-white">Blog</Link>
              <Link href="/news" className="block text-primary-foreground/80 hover:text-white">News</Link>
              <Link href="/angebote" className="block text-primary-foreground/80 hover:text-white">Angebote</Link>
              <Link href="/betriebe" className="block text-primary-foreground/80 hover:text-white">Betriebe</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 uppercase tracking-wide">Rechtliches</h3>
            <div className="space-y-2">
              <Link href="/ueber-uns" className="block text-primary-foreground/80 hover:text-white">Über uns</Link>
              <Link href="/kontakt" className="block text-primary-foreground/80 hover:text-white">Kontakt</Link>
              <Link href="/impressum" className="block text-primary-foreground/80 hover:text-white">Impressum</Link>
              <Link href="/datenschutz" className="block text-primary-foreground/80 hover:text-white">Datenschutz</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 border-t border-white/10 pt-6 text-center text-sm text-primary-foreground/70">
          © 2026 Meisterverbund. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
