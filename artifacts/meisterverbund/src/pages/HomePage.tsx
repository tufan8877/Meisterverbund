import { Link } from "wouter";
import {
  useListBlogPosts,
  useListBusinesses,
  useListFeaturedBusinesses,
} from "@workspace/api-client-react";

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

  const fallbackFeaturedBusinesses = [
    {
      id: "1",
      slug: "tischlerei-huber-gmbh",
      name: "Tischlerei Huber GmbH",
      branche: "Tischlerei",
      stadt: "Wien",
      bundesland: "Wien",
      description:
        "Traditionelle Tischlerei in Wien seit 1978. Maßmöbel, Einbauküchen und historische Restaurierungen.",
    },
    {
      id: "2",
      slug: "malerei-kirchner-kg",
      name: "Malerei Kirchner KG",
      branche: "Malerei & Anstrich",
      stadt: "Graz",
      bundesland: "Steiermark",
      description:
        "Malerei und Anstricharbeiten auf höchstem Niveau seit über 20 Jahren in Graz und der Steiermark.",
    },
    {
      id: "3",
      slug: "baeckerei-meister-gruber",
      name: "Bäckerei Meister Gruber",
      branche: "Bäckerei",
      stadt: "Salzburg",
      bundesland: "Salzburg",
      description:
        "Traditionelle Bäckerei im Herzen von Salzburg. Täglich frisches Brot und Gebäck nach Meisterhand.",
    },
  ];

  const monthBusinesses =
    featuredBusinesses.length > 0
      ? featuredBusinesses.slice(0, 3)
      : fallbackFeaturedBusinesses;

  return (
    <div>
      <section className="bg-primary text-primary-foreground px-4 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-[1.2] sm:text-4xl md:text-5xl lg:text-6xl">
            Finden Sie qualifizierte Meisterbetriebe in Ihrer Nähe.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-primary-foreground/85 sm:text-lg md:text-xl">
            Lesen Sie Fachbeiträge, aktuelle News und entdecken Sie Angebote aus der Branche.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              href="/betriebe"
              className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 sm:w-auto"
            >
              Betriebe finden
            </Link>

            <Link
              href="/kontakt"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white/12 px-6 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-white/20 sm:w-auto"
            >
              Jetzt kontaktieren
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            <div
              key={feature.title}
              className="rounded-2xl border border-card-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 text-2xl text-accent">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
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

          <Link
            href="/betriebe"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Alle Betriebe
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {monthBusinesses.map((biz, index) => (
            <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="block">
              <div className="rounded-2xl border border-[#e7e7e7] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e7efea] text-[28px] font-bold text-[#527061]">
                    {biz.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold leading-tight text-foreground sm:text-xl">
                          {biz.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{biz.branche}</p>
                        <p className="text-sm text-muted-foreground">
                          {biz.stadt}, {biz.bundesland}
                        </p>
                      </div>

                      {index === 0 && (
                        <span className="inline-flex shrink-0 items-center rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                          Nr. 1
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {biz.description && biz.description.length > 110
                        ? `${biz.description.slice(0, 110)}...`
                        : biz.description}
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Aktuelle Blog-Beiträge</h2>
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
              Alle Beiträge
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogData?.posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="overflow-hidden rounded-xl border border-card-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <div className="p-5">
                    <span className="mb-3 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {post.category}
                    </span>

                    <h3 className="mb-2 text-base font-bold leading-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>

                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </Link>
            )) ??
              Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-card-border bg-card p-5"
                >
                  <div className="mb-3 h-4 w-1/3 rounded bg-muted"></div>
                  <div className="mb-2 h-5 rounded bg-muted"></div>
                  <div className="h-4 w-4/5 rounded bg-muted"></div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Alle Meisterbetriebe</h2>
          <Link href="/betriebe" className="text-sm font-medium text-primary hover:underline">
            Alle Betriebe
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bizData?.businesses?.map((biz) => (
            <Link key={biz.id} href={`/betriebe/${biz.slug}`} className="block">
              <div className="rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e7efea] text-[24px] font-bold text-[#527061]">
                    {biz.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold leading-tight text-foreground">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{biz.branche}</p>
                    <p className="text-sm text-muted-foreground">
                      {biz.stadt}, {biz.bundesland}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )) ?? null}
        </div>
      </section>

      <section className="bg-accent px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-accent-foreground sm:text-4xl">
            Sind Sie ein Meisterbetrieb?
          </h2>

          <p className="mb-8 text-lg leading-relaxed text-accent-foreground/90 sm:text-xl">
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

      <footer className="bg-primary px-4 pb-8 pt-14 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 text-3xl font-extrabold">
              <span className="text-accent">M</span>eisterverbund
            </div>
            <p className="leading-7 text-primary-foreground/80">
              Qualität, Vertrauen und
              Gemeinschaft seit der Gründung.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">Inhalte</h3>
            <div className="space-y-2">
              <Link href="/blog" className="block text-primary-foreground/80 hover:text-white">
                Blog
              </Link>
              <Link href="/news" className="block text-primary-foreground/80 hover:text-white">
                News
              </Link>
              <Link
                href="/angebote"
                className="block text-primary-foreground/80 hover:text-white"
              >
                Angebote
              </Link>
              <Link
                href="/betriebe"
                className="block text-primary-foreground/80 hover:text-white"
              >
                Betriebe
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">Rechtliches</h3>
            <div className="space-y-2">
              <Link
                href="/ueber-uns"
                className="block text-primary-foreground/80 hover:text-white"
              >
                Über uns
              </Link>
              <Link href="/kontakt" className="block text-primary-foreground/80 hover:text-white">
                Kontakt
              </Link>
              <Link
                href="/impressum"
                className="block text-primary-foreground/80 hover:text-white"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="block text-primary-foreground/80 hover:text-white"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-primary-foreground/70">
          © 2026 Meisterverbund. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
