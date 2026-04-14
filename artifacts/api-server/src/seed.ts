import { db, usersTable, blogPostsTable, newsPostsTable, adPostsTable, businessesTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting seed...");

  // Create admin user
  const adminEmail = process.env["ADMIN_EMAIL"] || "admin@meisterverbund.at";
  const adminPassword = process.env["ADMIN_PASSWORD"] || "admin123";
  const adminName = process.env["ADMIN_NAME"] || "Administrator";

  const existingAdmin = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail));
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(usersTable).values({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      isBlocked: false,
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping...");
  }

  // Seed blog posts
  const existingBlog = await db.select({ id: blogPostsTable.id }).from(blogPostsTable).limit(1);
  if (existingBlog.length === 0) {
    await db.insert(blogPostsTable).values([
      {
        title: "Handwerk hat goldenen Boden – Warum Meisterbetriebe die Zukunft sind",
        slug: "handwerk-goldener-boden",
        excerpt: "Entdecken Sie, warum Meisterbetriebe in Österreich eine Renaissance erleben und wie sie die lokale Wirtschaft stärken.",
        content: `In einer Zeit, in der Digitalisierung und Automatisierung viele Branchen verändern, erleben traditionelle Meisterbetriebe in Österreich eine bemerkenswerte Renaissance. Immer mehr junge Menschen entscheiden sich für eine Lehre und den Meistertitel – und das aus gutem Grund.

**Qualität, die man anfassen kann**

Meisterbetriebe stehen für handwerkliche Exzellenz. Ein Meistertitel ist keine leere Auszeichnung – er bedeutet jahrelange Ausbildung, bestandene Prüfungen und nachgewiesene Fachkompetenz. Kunden, die sich an einen Meisterbetrieb wenden, wissen: Hier stimmt die Qualität.

**Lokale Wirtschaft stärken**

Wenn Sie einen lokalen Meisterbetrieb beauftragen, bleibt das Geld in der Region. Meisterbetriebe beschäftigen lokale Mitarbeiter, kaufen bei regionalen Lieferanten ein und zahlen Steuern, die die lokale Infrastruktur finanzieren.

**Vertrauen durch Zertifizierung**

Die Meisterprüfung ist ein staatlich anerkanntes Qualitätsmerkmal. Sie garantiert, dass der Betrieb über das notwendige Fachwissen verfügt, um seine Kunden kompetent zu bedienen. Das schafft Vertrauen – und Vertrauen ist die Grundlage jeder guten Geschäftsbeziehung.`,
        category: "Handwerk",
        published: true,
      },
      {
        title: "Die 5 wichtigsten Fragen bei der Auswahl eines Meisterbetriebs",
        slug: "fuenf-fragen-meisterbetrieb-auswahl",
        excerpt: "Worauf sollten Sie achten, wenn Sie einen qualifizierten Handwerksbetrieb für Ihre Bedürfnisse suchen?",
        content: `Die Wahl des richtigen Meisterbetriebs kann den Unterschied zwischen einem erfolgreichen Projekt und einem teuren Desaster ausmachen. Mit diesen fünf Fragen treffen Sie die richtige Entscheidung.

**1. Ist der Meistertitel aktuell und gültig?**
Fragen Sie nach dem Meisterbrief und prüfen Sie, ob er im entsprechenden Gewerk ausgestellt wurde. In Österreich ist die Gewerbebehörde die zuständige Stelle für Auskünfte.

**2. Welche Referenzen kann der Betrieb vorweisen?**
Seriöse Meisterbetriebe haben zufriedene Kunden, die bereit sind, über ihre Erfahrungen zu sprechen. Fragen Sie nach Referenzen und besuchen Sie abgeschlossene Projekte, wenn möglich.

**3. Wie ist die Erreichbarkeit und Reaktionszeit?**
Ein guter Betrieb antwortet zeitnah auf Anfragen. Schlechte Kommunikation vor dem Auftrag deutet oft auf schlechte Kommunikation während des Projekts hin.

**4. Sind Versicherungen vorhanden?**
Betriebshaftpflicht und Unfallversicherung sind Pflicht. Fragen Sie explizit danach und lassen Sie sich die Nachweise zeigen.

**5. Stimmt das Preis-Leistungs-Verhältnis?**
Der billigste Anbieter ist selten der beste. Holen Sie mindestens drei Angebote ein und vergleichen Sie nicht nur den Preis, sondern auch den Leistungsumfang.`,
        category: "Ratgeber",
        published: true,
      },
      {
        title: "Nachhaltigkeit im Handwerk: Wie Meisterbetriebe die Umwelt schonen",
        slug: "nachhaltigkeit-handwerk",
        excerpt: "Viele österreichische Meisterbetriebe setzen auf nachhaltige Materialien und Methoden – ein Trend mit Zukunft.",
        content: `Nachhaltigkeit ist kein Trend mehr – es ist eine Notwendigkeit. Und Meisterbetriebe in ganz Österreich nehmen diese Verantwortung ernst.

**Regionale Materialien bevorzugen**

Viele Tischler, Zimmerer und Baumeister setzen bewusst auf Holz aus heimischen Wäldern. Kurze Transportwege reduzieren den CO₂-Ausstoß, und regionale Lieferanten stärken die lokale Wirtschaft.

**Handwerk verlängert Lebenszyklen**

Ein gut gemachtes Möbelstück aus einer Tischlerei hält Jahrzehnte. Im Gegensatz zu Billigprodukten aus dem Ausland wird nicht alle paar Jahre Ersatz benötigt. Das ist nachhaltig im besten Sinne.

**Energieeffiziente Lösungen**

Elektriker und Heizungstechniker mit Meistertitel beraten ihre Kunden kompetent zu erneuerbaren Energien, Wärmepumpen und Solaranlagen. Qualifizierte Installation spart langfristig Energie und Kosten.`,
        category: "Nachhaltigkeit",
        published: true,
      },
    ]);
    console.log("Blog posts seeded");
  }

  // Seed news posts
  const existingNews = await db.select({ id: newsPostsTable.id }).from(newsPostsTable).limit(1);
  if (existingNews.length === 0) {
    await db.insert(newsPostsTable).values([
      {
        title: "Meisterverbund startet neue Plattform für österreichische Handwerksbetriebe",
        slug: "meisterverbund-plattform-launch",
        excerpt: "Ab sofort können sich Meisterbetriebe aus ganz Österreich auf der neuen Meisterverbund-Plattform registrieren und präsentieren.",
        content: `Die neue Meisterverbund-Plattform ist online! Ab sofort können Meisterbetriebe aus ganz Österreich ihr Unternehmen kostenlos präsentieren und von der wachsenden Community profitieren.

**Was bietet die Plattform?**

- Professionelle Betriebspräsentation mit allen wichtigen Kontaktinformationen
- Bewertungssystem für mehr Vertrauen bei Neukunden
- Aktuelle Branchennews und Fachbeiträge
- Community-Bereich für Austausch und Vernetzung

**Wie können Betriebe teilnehmen?**

Die Aufnahme in das Meisterverbund-Verzeichnis erfolgt über den Administrator. Interessierte Betriebe können über die Kontaktseite Kontakt aufnehmen.

Wir freuen uns auf eine starke Gemeinschaft österreichischer Meisterbetriebe!`,
        category: "Plattform",
        published: true,
      },
      {
        title: "Neue Förderungen für Handwerksbetriebe in Österreich ab 2026",
        slug: "neue-foerderungen-handwerk-2026",
        excerpt: "Das Wirtschaftsministerium hat neue Förderprogramme für kleine und mittlere Handwerksbetriebe angekündigt.",
        content: `Das österreichische Wirtschaftsministerium hat ein umfassendes Förderprogramm für kleine und mittlere Handwerksbetriebe angekündigt. Die Förderungen sollen die Digitalisierung und Modernisierung der Betriebe unterstützen.

**Förderschwerpunkte:**

1. **Digitalisierungsförderung**: Bis zu 15.000 Euro für die Einführung digitaler Werkzeuge und Software
2. **Energieeffizienz**: Förderung von bis zu 30% für energiesparende Maschinen und Anlagen
3. **Ausbildungsförderung**: Erhöhte Unterstützung für Betriebe, die Lehrlinge ausbilden
4. **Meisterprüfungsbeihilfe**: Zuschüsse zu den Prüfungsgebühren

**Antragsstellung**

Anträge können ab 1. März 2026 über das Online-Portal des Wirtschaftsministeriums gestellt werden. Die genauen Konditionen werden noch bekannt gegeben.`,
        category: "Förderungen",
        published: true,
      },
    ]);
    console.log("News posts seeded");
  }

  // Seed ad posts
  const existingAds = await db.select({ id: adPostsTable.id }).from(adPostsTable).limit(1);
  if (existingAds.length === 0) {
    await db.insert(adPostsTable).values([
      {
        title: "Tischlermeister sucht erfahrenen Gesellen – Wien",
        slug: "tischlermeister-geselle-wien",
        excerpt: "Etablierter Tischlerbetrieb in Wien sucht einen erfahrenen Tischlergesellen für spannende Möbelprojekte.",
        content: `Wir sind ein traditionsreicher Tischlerbetrieb im 7. Wiener Gemeindebezirk und suchen zur Verstärkung unseres Teams einen erfahrenen Tischlergesellen.

**Ihre Aufgaben:**
- Anfertigung von Maßmöbeln nach Kundenwunsch
- Restaurierung historischer Möbelstücke
- Eigenverantwortliche Projektarbeit

**Ihr Profil:**
- Abgeschlossene Tischlerlehre
- Mindestens 3 Jahre Berufserfahrung
- Leidenschaft für qualitatives Handwerk
- Teamfähigkeit

**Wir bieten:**
- Überkollektivvertragliche Entlohnung
- Modern ausgestattete Werkstatt
- Familiäres Betriebsklima
- Möglichkeit zur Weiterentwicklung

Interessiert? Kontaktieren Sie uns direkt über das Kontaktformular!`,
        category: "Stellenangebote",
        published: true,
      },
      {
        title: "Meisterbetrieb zu verkaufen – Elektriker Niederösterreich",
        slug: "elektriker-betrieb-verkauf-niederoesterreich",
        excerpt: "Gut eingeführter Elektrikerbetrieb in Niederösterreich wegen Pensionierung zu verkaufen. Alle Unterlagen vorhanden.",
        content: `Nach über 30 Jahren erfolgreicher Tätigkeit möchte ich meinen Elektriker-Meisterbetrieb in Niederösterreich wegen Pensionierung übergeben.

**Der Betrieb:**
- Seit 1994 am Markt
- Fester Kundenstamm aus Industrie und Privatkunden
- 4 Mitarbeiter (alle Übernahme bereit)
- Vollständige Büroausstattung und Werkzeuge inklusive

**Zahlen:**
- Jahresumsatz: stabil im guten sechsstelligen Bereich
- Gute Ertragssituation
- Alle Buchführungsunterlagen vorhanden

**Standort:**
Zentrales Niederösterreich, gute Verkehrsanbindung

Seriöse Interessenten können sich vertrauensvoll melden. Diskretion wird zugesichert.`,
        category: "Betriebsübergabe",
        published: true,
      },
    ]);
    console.log("Ad posts seeded");
  }

  // Seed businesses
  const existingBusinesses = await db.select({ id: businessesTable.id }).from(businessesTable).limit(1);
  if (existingBusinesses.length === 0) {
    await db.insert(businessesTable).values([
      {
        name: "Tischlerei Huber GmbH",
        slug: "tischlerei-huber",
        bundesland: "Wien",
        stadt: "Wien",
        branche: "Tischlerei",
        description: "Traditionelle Tischlerei in Wien seit 1978. Wir fertigen Maßmöbel, Einbauküchen und historische Restaurierungen mit höchster handwerklicher Sorgfalt.",
        telefon: "+43 1 234 5678",
        email: "office@tischlerei-huber.at",
        website: "https://www.tischlerei-huber.at",
        logo: null,
      },
      {
        name: "Elektro Maier e.U.",
        slug: "elektro-maier",
        bundesland: "Niederösterreich",
        stadt: "St. Pölten",
        branche: "Elektrotechnik",
        description: "Ihr verlässlicher Elektrikermeister in St. Pölten und Umgebung. Wir übernehmen alle Elektroinstallationen, von der Neuinstallation bis zur Reparatur.",
        telefon: "+43 2742 345678",
        email: "elektro@maier-stpoelten.at",
        website: null,
        logo: null,
      },
      {
        name: "Malerei Kirchner KG",
        slug: "malerei-kirchner",
        bundesland: "Steiermark",
        stadt: "Graz",
        branche: "Malerei & Anstrich",
        description: "Malerei und Anstricharbeiten auf höchstem Niveau. Seit über 20 Jahren der Ansprechpartner für Privatkunden und Betriebe in Graz und der Steiermark.",
        telefon: "+43 316 567890",
        email: "info@malerei-kirchner.at",
        website: "https://www.malerei-kirchner.at",
        logo: null,
      },
      {
        name: "Schlosserei & Schmiede Berger",
        slug: "schlosserei-berger",
        bundesland: "Oberösterreich",
        stadt: "Linz",
        branche: "Schlosserei",
        description: "Kunsthandwerkliche Schlosserei und Schmiede in Linz. Wir fertigen individuelle Gitter, Geländer, Tore und kunstschmiedeeiserne Objekte nach Maß.",
        telefon: "+43 732 456789",
        email: "schmiede@berger-linz.at",
        website: null,
        logo: null,
      },
      {
        name: "Dachdeckerei Winkler OG",
        slug: "dachdeckerei-winkler",
        bundesland: "Tirol",
        stadt: "Innsbruck",
        branche: "Dachdeckerei",
        description: "Professionelle Dachdeckerei und Spenglerei in Innsbruck. Neueindeckungen, Reparaturen und Dachsanierungen – wir sind Ihr Meisterbetrieb für alles rund ums Dach.",
        telefon: "+43 512 234567",
        email: "dach@winkler-innsbruck.at",
        website: "https://www.dachdeckerei-winkler.at",
        logo: null,
      },
      {
        name: "Bäckerei Meister Gruber",
        slug: "baeckerei-meister-gruber",
        bundesland: "Salzburg",
        stadt: "Salzburg",
        branche: "Bäckerei",
        description: "Traditionelle Bäckerei im Herzen von Salzburg. Täglich frisches Brot und Gebäck nach überlieferten Rezepten – Qualität, die man schmeckt.",
        telefon: "+43 662 345678",
        email: "info@baeckerei-gruber.at",
        website: "https://www.baeckerei-gruber.at",
        logo: null,
      },
    ]);
    console.log("Businesses seeded");
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
