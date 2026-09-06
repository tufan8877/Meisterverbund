import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowDownRight, ArrowRight, Award, Building2, Check, ChevronDown, CircleDashed, Compass, Hammer, Landmark, MapPin, Search, ShieldCheck, Sparkles, Users, Wrench, Zap } from 'lucide-react';
import { PageHero, SectionHeading, Seal } from '../components/site-shell';

function SEO({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} · Meisterverbund Österreich`;
    const tag = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    tag.setAttribute('name', 'description');
    tag.setAttribute('content', description);
    document.head.appendChild(tag);
  }, [title, description]);
  return null;
}

const industries = [
  { slug: 'installation-gebaeudetechnik', name: 'Installations- & Gebäudetechnik', text: 'Wärme, Wasser und Energie – fachgerecht geplant.', icon: Wrench },
  { slug: 'elektrotechnik', name: 'Elektrotechnik', text: 'Sichere Lösungen für Gebäude und Betrieb.', icon: Zap },
  { slug: 'bau-baunebengewerbe', name: 'Bau & Baunebengewerbe', text: 'Substanz, Präzision und Verlässlichkeit.', icon: Hammer },
  { slug: 'tischlerei', name: 'Tischlerei', text: 'Holzarbeiten mit Sinn für Material und Raum.', icon: Building2 },
  { slug: 'metalltechnik', name: 'Metalltechnik', text: 'Konstruktionen, die dauerhaft funktionieren.', icon: CircleDashed },
  { slug: 'kfz-technik', name: 'KFZ-Technik', text: 'Mobilität in erfahrenen Händen.', icon: Compass },
  { slug: 'dachdeckerei-spenglerei', name: 'Dachdeckerei & Spenglerei', text: 'Schutz und Charakter für jedes Dach.', icon: Landmark },
  { slug: 'maler-beschichtung', name: 'Maler & Beschichtung', text: 'Oberflächen, die Räume prägen.', icon: Sparkles },
  { slug: 'friseur-kosmetik', name: 'Friseur & Kosmetik', text: 'Persönlichkeit, Pflege und Handwerk.', icon: Users },
  { slug: 'gastronomie', name: 'Gastronomie', text: 'Gastlichkeit mit Können und Haltung.', icon: Award },
  { slug: 'lebensmittelhandwerk', name: 'Lebensmittelhandwerk', text: 'Guter Geschmack aus besten Zutaten.', icon: ShieldCheck },
  { slug: 'it-kommunikation', name: 'IT & Kommunikation', text: 'Digitale Lösungen für morgen.', icon: ArrowDownRight },
  { slug: 'garten-landschaftsbau', name: 'Garten- & Landschaftsbau', text: 'Freiräume, die mitwachsen.', icon: CircleDashed },
  { slug: 'reinigung-gebaeudeservice', name: 'Reinigung & Gebäudeservice', text: 'Sorgfalt, die man jeden Tag spürt.', icon: Check },
  { slug: 'weitere-meisterberufe', name: 'Weitere Meisterberufe', text: 'Die Vielfalt des österreichischen Könnens.', icon: ArrowRight },
];

const demoProfiles = [
  { name: 'Beispiel Meisterbetrieb', branch: 'Tischlerei', place: 'Wien', text: 'Eine zukünftige Profilseite für einen qualifizierten österreichischen Meisterbetrieb.' },
  { name: 'Musterbetrieb Salzburg', branch: 'Elektrotechnik', place: 'Salzburg', text: 'Demo-Profil als Vorschau für die gemeinsame Präsenz im Meisterverbund.' },
  { name: 'Werkstatt Beispiel', branch: 'Metalltechnik', place: 'Oberösterreich', text: 'Strukturierte Informationen, klare Leistungen und direkter Kontakt.' },
];

function IndustryCard({ industry }: { industry: typeof industries[number] }) {
  const Icon = industry.icon;
  return <Link href={`/branchen/${industry.slug}`} className="branch-card" data-testid={`card-industry-${industry.slug}`}>
    <div className="branch-top"><Icon size={19} strokeWidth={1.5} /><ArrowRight className="arrow" size={17} /></div>
    <div><h3>{industry.name}</h3><p>{industry.text}</p></div>
  </Link>;
}

export function HomePage() {
  return <>
    <SEO title="Plattform für österreichische Meisterbetriebe" description="Meisterverbund Österreich verbindet Kunden mit qualifizierten Meisterbetrieben und gibt Meisterhandwerk eine starke gemeinsame Präsenz." />
    <section className="home-page-title">
      <div className="container reveal">
        <div className="eyebrow">Startseite</div>
        <h1 className="display">Meisterverbund Österreich</h1>
        <p>Orientierung für Kunden. Sichtbarkeit für qualifizierte Meisterbetriebe.</p>
      </div>
    </section>
    <section className="hero">
      <div className="container hero-grid reveal">
        <div>
          <div className="eyebrow">Meisterverbund Österreich</div>
          <h1 className="display">Qualität, die <span style={{ color: 'hsl(var(--accent))' }}>bleibt.</span></h1>
          <p className="lead">Die Plattform für österreichische Meisterbetriebe. Kompetenz sichtbar machen, Vertrauen schaffen und gute Arbeit zusammenbringen.</p>
          <div className="hero-actions">
            <Link href="/meisterbetriebe" className="button-primary" data-testid="link-hero-discover">Meisterbetriebe entdecken <ArrowRight size={16} /></Link>
            <Link href="/fuer-betriebe" className="button-secondary" data-testid="link-hero-businesses">Für Betriebe</Link>
          </div>
          <div className="hero-note">Ein gemeinsamer Auftritt für das, was Österreich stark macht: Können, Verantwortung und Erfahrung.</div>
        </div>
        <div className="hero-visual">
          <div className="portal-preview" aria-label="Vorschau der Meisterverbund-Plattform">
            <div className="portal-preview-top"><span className="demo-tag">Meisterverbund Österreich</span><span>01 / 03</span></div>
            <div className="portal-preview-title">Meisterbetriebe<br /><strong>in Ihrer Nähe</strong></div>
            <div className="portal-preview-row"><span><MapPin size={14} /> Wien · Tischlerei</span><ArrowRight size={15} /></div>
            <div className="portal-preview-row"><span><ShieldCheck size={14} /> Meisterqualität</span><ArrowRight size={15} /></div>
            <div className="portal-preview-footer"><span>Orientierung für Kunden</span><span className="portal-dot" /></div>
          </div>
          <div className="hero-code">AT / HANDWERK / 01</div>
        </div>
      </div>
    </section>
    <section className="signal-bar"><div className="container signal-grid">
      {['01', '02', '03', '04'].map((n, i) => <div className="signal" key={n}><span className="signal-number">{n}</span><strong>{['Meisterbetriebe aus Österreich', 'Geprüfte Unternehmensprofile', 'Verschiedene Branchen', 'Direkter Kontakt'][i]}</strong><span>{['Regional verwurzelt, gemeinsam sichtbar.', 'Qualifikation im Mittelpunkt.', 'Vielfalt mit einem Anspruch.', 'Ohne Umwege zum richtigen Betrieb.'][i]}</span></div>)}
    </div></section>
    <section className="service-strip"><div className="container service-strip-inner"><div><h2>Sie suchen einen qualifizierten Meisterbetrieb?</h2><p>Starten Sie mit Branche und Region – die Verzeichnissuche ist als Vorschau geöffnet.</p></div><Link href="/meisterbetriebe" className="button-primary" data-testid="link-service-directory">Meisterbetriebe suchen <ArrowRight size={15} /></Link></div></section>
    <section className="section"><div className="container">
      <SectionHeading eyebrow="Der Anspruch" title="Mehr als ein Verzeichnis. Eine gemeinsame Haltung.">Meisterverbund schafft Orientierung für Kunden und eine professionelle Bühne für Betriebe, die ihr Handwerk beherrschen.</SectionHeading>
      <div className="feature-grid">
        {[['01', Award, 'Qualität', 'Meisterbetriebe stehen für fundierte Ausbildung, Fachwissen und professionelle Arbeit.'], ['02', ShieldCheck, 'Vertrauen', 'Kunden sollen Betriebe übersichtlich kennenlernen und sicher ansprechen können.'], ['03', Sparkles, 'Sichtbarkeit', 'Eine professionelle Präsenz gibt echter Leistung den Raum, den sie verdient.'], ['04', Users, 'Gemeinschaft', 'Unterschiedliche Branchen, verbunden durch den Anspruch an Meisterqualität.']].map(([num, Icon, title, text]) => { const I = Icon as typeof Award; return <article className="feature" key={num as string}><div className="feature-icon"><I size={24} strokeWidth={1.5} /></div><div className="signal-number">{num as string}</div><h3>{title as string}</h3><p>{text as string}</p></article>; })}
      </div>
    </div></section>
    <section className="section offset-section"><div className="container">
      <SectionHeading eyebrow="Handwerk in Österreich" title="Viele Gewerke. Ein Qualitätsverständnis.">Entdecken Sie die Branchen, in denen österreichische Meister täglich Verantwortung übernehmen.</SectionHeading>
      <div className="branch-grid">{industries.slice(0, 9).map(i => <IndustryCard key={i.slug} industry={i} />)}</div>
      <div style={{ marginTop: 26 }}><Link href="/branchen" className="text-link" data-testid="link-all-industries">Alle Branchen ansehen <ArrowRight size={16} /></Link></div>
    </div></section>
    <section className="section"><div className="container">
      <div className="feature-panel"><div className="panel-placeholder"><Seal small /></div><div className="panel-copy"><div className="eyebrow">Meisterbetrieb des Monats</div><h2 className="display">Gute Arbeit<br />bekommt Raum.</h2><p>Demnächst stellen wir hier einen ausgewählten österreichischen Meisterbetrieb vor. Persönlich, fundiert und mit dem Blick für das, was ihn besonders macht.</p><span className="demo-tag">Auswahl in Vorbereitung</span></div></div>
    </div></section>
    <section className="section" style={{ paddingTop: 20 }}><div className="container"><SectionHeading eyebrow="Für Kundinnen und Kunden" title="Den passenden Meisterbetrieb finden."><span>Wenn eine Arbeit zählt, sollte auch die Wahl des Betriebs zählen.</span></SectionHeading><div className="steps">{[['01', 'Branche auswählen', 'Finden Sie das passende Gewerk für Ihr Vorhaben.'], ['02', 'Meisterbetrieb entdecken', 'Erhalten Sie einen klaren Eindruck von Leistungen und Profil.'], ['03', 'Direkt Kontakt aufnehmen', 'Nehmen Sie unkompliziert Verbindung auf.']].map(([num, title, text]) => <div className="step" key={num}><div className="step-num">{num}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section-sm"><div className="container"><div className="feature-panel"><div className="panel-copy"><div className="eyebrow">Für Meisterbetriebe</div><h2 className="display">Mehr Sichtbarkeit für echte Meisterqualität.</h2><p>Die Aufnahme neuer Meisterbetriebe startet in Kürze. Bekunden Sie jetzt unverbindlich Ihr Interesse.</p><Link href="/kontakt" className="button-primary" data-testid="link-home-contact">Interesse bekunden <ArrowRight size={16} /></Link></div><div className="panel-placeholder"><Seal small /></div></div></div></section>
  </>;
}

export function DirectoryPage() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('Alle Branchen');
  const filtered = useMemo(() => demoProfiles.filter(p => `${p.name} ${p.branch} ${p.place}`.toLowerCase().includes(query.toLowerCase()) && (branch === 'Alle Branchen' || p.branch === branch)), [query, branch]);
  return <>
    <SEO title="Meisterbetriebe entdecken" description="Entdecken Sie die Vorschau des Meisterverbund-Verzeichnisses für österreichische Meisterbetriebe." />
    <PageHero eyebrow="Das Verzeichnis" title="Meisterbetriebe entdecken"><p>Eine kuratierte Plattform für qualifizierte Betriebe aus ganz Österreich. Die ersten Profile sind als Demo-Profil gekennzeichnet.</p></PageHero>
    <section className="section"><div className="container">
      <div className="directory-tools"><label><span className="sr-only">Suche</span><div style={{ position: 'relative' }}><Search size={17} style={{ position: 'absolute', left: 13, top: 14, color: 'hsl(var(--muted-foreground))' }} /><input className="field" style={{ paddingLeft: 40 }} placeholder="Betrieb, Branche oder Ort suchen" value={query} onChange={e => setQuery(e.target.value)} data-testid="input-search-profiles" /></div></label><select className="select" value={branch} onChange={e => setBranch(e.target.value)} aria-label="Branche filtern" data-testid="select-branch-filter"><option>Alle Branchen</option><option>Tischlerei</option><option>Elektrotechnik</option><option>Metalltechnik</option></select><select className="select" aria-label="Bundesland filtern" data-testid="select-state-filter"><option>Alle Bundesländer</option><option>Wien</option><option>Salzburg</option><option>Oberösterreich</option></select></div>
      <div className="section-heading" style={{ marginBottom: 25 }}><div><div className="eyebrow">Demo-Vorschau</div><h2 className="display" style={{ fontSize: '2rem' }}>Profile mit Substanz.</h2></div><p>{filtered.length} von {demoProfiles.length} Demo-Profilen sichtbar</p></div>
      <div className="profile-grid">{filtered.length ? filtered.map((profile, index) => <article className="profile-card" key={profile.name}><div className="profile-logo">M{index + 1}</div><div className="demo-tag">Demo-Profil</div><h2>{profile.name}</h2><div className="profile-meta">{profile.branch} · {profile.place}</div><p>{profile.text}</p><Link className="text-link" href="/meisterbetriebe/demo" data-testid={`link-profile-${index}`}>Profil ansehen <ArrowRight size={15} /></Link></article>) : <div className="side-note" style={{ gridColumn: '1 / -1' }}><h3>Kein Demo-Profil gefunden.</h3><p>Versuchen Sie einen anderen Suchbegriff.</p></div>}</div>
    </div></section>
  </>;
}

export function DemoProfilePage() {
  return <>
    <SEO title="Demo-Profil eines Meisterbetriebs" description="Demo-Profil als Vorlage für zukünftige Profile im Meisterverbund Österreich." />
    <PageHero eyebrow="Profilvorlage · Demo" title="Beispiel Meisterbetrieb"><p>Diese Seite zeigt, wie ein zukünftiges Betriebsprofil im Meisterverbund aufgebaut sein kann.</p></PageHero>
    <section className="section"><div className="container">
      <div className="detail-hero"><div><div className="eyebrow">Demo-Profil</div><h2 className="display" style={{ fontSize: 'clamp(2.3rem, 5vw, 4.5rem)', margin: '18px 0' }}>Beispiel<br />Meisterbetrieb</h2><div className="tag-row"><span className="tag">Tischlerei</span><span className="tag">Wien</span><span className="tag">Meisterbetrieb</span></div><p className="muted">Ein Platzhalter für einen Betrieb, der sein Handwerk mit Erfahrung, Präzision und persönlicher Beratung ausübt.</p><Link href="/kontakt" className="button-primary" style={{ marginTop: 20 }} data-testid="link-demo-contact">Kontaktieren <ArrowRight size={16} /></Link></div><div style={{ display: 'flex', justifyContent: 'center' }}><div className="detail-logo">M.</div></div></div>
      <div className="content-grid" style={{ marginTop: 100 }}><div className="prose"><div className="eyebrow">Über den Betrieb</div><h2 className="display">Handwerk mit<br />klarer Linie.</h2><p>Hier findet künftig die Geschichte des Betriebs Platz: Was ihn antreibt, worauf er spezialisiert ist und wie aus Erfahrung gute Lösungen entstehen.</p><h3>Leistungen</h3><ul><li>Individuelle Planung und Beratung</li><li>Meisterliche Fertigung und Umsetzung</li><li>Verlässliche Betreuung vom Erstgespräch bis zur Übergabe</li></ul></div><aside className="side-note"><div className="demo-tag">Profilbereich</div><h3>Kontakt & Standort</h3><p>Alle Kontaktdaten, Öffnungszeiten und der Standort werden hier übersichtlich gebündelt.</p><strong style={{ fontFamily: 'var(--app-font-display)' }}>Beispiel Meisterbetrieb</strong><p style={{ marginTop: 4 }}>Wien, Österreich</p></aside></div>
      <div style={{ marginTop: 80 }}><div className="eyebrow" style={{ marginBottom: 18 }}>Einblicke · Demo</div><div className="gallery-grid"><div className="gallery-tile">BILDPLATZHALTER</div><div className="gallery-tile">WERKSTATT</div><div className="gallery-tile">DETAIL</div><div className="gallery-tile">PROJEKT</div><div className="gallery-tile">MATERIAL</div></div></div>
    </div></section>
  </>;
}

export function IndustriesPage() {
  return <><SEO title="Branchen" description="Die Branchenvielfalt österreichischer Meisterbetriebe im Überblick." /><PageHero eyebrow="Die Vielfalt des Könnens" title="Branchen"><p>Von Bau bis Kommunikation: Meisterverbund verbindet unterschiedliche Gewerke durch einen gemeinsamen Qualitätsanspruch.</p></PageHero><section className="section"><div className="container"><div className="industry-list">{industries.map(i => { const Icon = i.icon; return <div className="industry-row" key={i.slug}><div className="feature-icon"><Icon size={23} strokeWidth={1.5} /></div><div><h2>{i.name}</h2><p>{i.text}</p><Link href={`/branchen/${i.slug}`} className="text-link" data-testid={`link-industry-${i.slug}`}>Branche ansehen <ArrowRight size={14} /></Link></div></div>; })}</div></div></section></>;
}

export function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const industry = industries.find(i => i.slug === slug) ?? industries[0];
  return <><SEO title={industry.name} description={`${industry.name} im Meisterverbund Österreich. Informationen und Branchenprofil.`} /><PageHero eyebrow="Branche · Demo-Inhalt" title={industry.name}><p>{industry.text} Diese statische Detailseite zeigt die spätere Struktur eines Branchenbereichs.</p></PageHero><section className="section"><div className="container content-grid"><div className="prose"><div className="eyebrow">Orientierung</div><h2 className="display">Kompetenz beginnt<br />mit dem richtigen Gewerk.</h2><p>Im Meisterverbund finden Kundinnen und Kunden künftig qualifizierte Betriebe dieser Branche. Die Profile machen Leistungen, Spezialisierungen und regionale Nähe transparent.</p><h3>Was Sie erwartet</h3><ul><li>Übersichtliche Betriebsprofile mit klaren Leistungen</li><li>Einordnung nach Region und Schwerpunkt</li><li>Direkte Kontaktmöglichkeiten zu den Betrieben</li></ul></div><aside className="side-note"><div style={{ color: 'hsl(var(--accent))', marginBottom: 18 }}><Award size={28} strokeWidth={1.5} /></div><h3>Branchenbereich im Aufbau</h3><p>Die Aufnahme von Meisterbetrieben startet in Kürze. Schauen Sie bald wieder vorbei oder nehmen Sie direkt Kontakt mit uns auf.</p><Link href="/kontakt" className="text-link" data-testid="link-industry-contact">Kontakt aufnehmen <ArrowRight size={15} /></Link></aside></div></section></>;
}

export function AboutPage() {
  return <><SEO title="Über uns" description="Meisterverbund Österreich macht Meisterhandwerk sichtbar und verbindet Qualität mit Orientierung." /><PageHero eyebrow="Die Idee dahinter" title="Meisterhandwerk sichtbar machen"><p>Eine gemeinsame Plattform für österreichische Meisterbetriebe – klar, glaubwürdig und mit Blick auf die Qualität, die hinter guter Arbeit steht.</p></PageHero><section className="section"><div className="container content-grid"><div className="prose"><div className="eyebrow">Unsere Aufgabe</div><h2 className="display">Eine starke Bühne<br />für gutes Handwerk.</h2><p>Meisterverbund Österreich wurde mit dem Ziel entwickelt, österreichischen Meisterbetrieben eine moderne gemeinsame Plattform zu bieten. Kunden sollen qualifizierte Betriebe unkompliziert entdecken und Betriebe ihre Qualität professionell präsentieren können.</p><p>Wir glauben an einen öffentlichen Auftritt, der nicht lauter, sondern klarer wird: durch verlässliche Informationen, eine präzise Sprache und Respekt vor dem Können, das jedes Gewerk verlangt.</p></div><aside className="side-note"><div className="demo-tag">Unsere Vision</div><h3>Qualität sichtbar machen.</h3><p>Eine Plattform, auf der Vertrauen nicht behauptet, sondern durch Klarheit und Kompetenz aufgebaut wird.</p></aside></div></section><section className="section offset-section"><div className="container"><SectionHeading eyebrow="Wofür wir stehen" title="Fünf Werte. Ein Anspruch." /><div className="feature-grid">{[['01', 'Qualität'], ['02', 'Vertrauen'], ['03', 'Kompetenz'], ['04', 'Sichtbarkeit'], ['05', 'Gemeinschaft']].map(([n, t]) => <div className="feature" key={n} style={{ minHeight: 170 }}><div className="signal-number">{n}</div><h3>{t}</h3><p>Verlässlich, nachvollziehbar und auf Augenhöhe.</p></div>)}</div></div></section></>;
}

export function ForBusinessesPage() {
  return <><SEO title="Für Betriebe" description="Mehr Sichtbarkeit für österreichische Meisterbetriebe mit dem Meisterverbund." /><PageHero eyebrow="Für Meisterbetriebe" title="Mehr Sichtbarkeit für echte Meisterqualität"><p>Ein professionelles digitales Zuhause für Betriebe, die ihr Handwerk ernst nehmen und gemeinsam sichtbar werden möchten.</p></PageHero><section className="section"><div className="container"><SectionHeading eyebrow="Der Mehrwert" title="Ihr Betrieb. Klar präsentiert." /><div className="feature-grid">{[['01', 'Professionelle Betriebspräsentation', 'Ihr Profil zeigt, was Sie auszeichnet – präzise und aufgeräumt.'], ['02', 'Digitale Sichtbarkeit', 'Wer nach Qualität sucht, soll qualifizierte Betriebe leichter finden.'], ['03', 'Meisterverbund-Siegel', 'Ein sichtbares Zeichen für Zugehörigkeit und gemeinsamen Anspruch.'], ['04', 'Branchenpräsenz', 'Ihre Leistungen werden dort sichtbar, wo Kunden Orientierung suchen.']].map(([n, t, p]) => <div className="feature" key={n}><div className="signal-number">{n}</div><h3>{t}</h3><p>{p}</p></div>)}</div></div></section><section className="section" style={{ paddingTop: 25 }}><div className="container feature-panel"><div className="panel-placeholder"><Seal small /></div><div className="panel-copy"><div className="eyebrow">Der nächste Schritt</div><h2 className="display">Die Aufnahme neuer Meisterbetriebe startet in Kürze.</h2><p>Sie möchten informiert werden oder haben Fragen zum gemeinsamen Auftritt? Bekunden Sie unverbindlich Ihr Interesse.</p><Link href="/kontakt" className="button-primary" data-testid="link-business-interest">Interesse bekunden <ArrowRight size={16} /></Link></div></div></section></>;
}

const faqs = [['Was ist Meisterverbund?', 'Meisterverbund Österreich ist eine geplante Plattform, die qualifizierte Meisterbetriebe aus verschiedenen Branchen sichtbar macht und Kunden Orientierung bietet.'], ['Wer kann bei Meisterverbund teilnehmen?', 'Die Plattform richtet sich an österreichische Meisterbetriebe und qualifizierte Unternehmen aus meisterlichen Gewerken. Details zur Aufnahme werden zum Start bekannt gegeben.'], ['Ist Meisterverbund nur für Handwerksbetriebe?', 'Der Schwerpunkt liegt auf Meisterhandwerk und meisterlich geprägten Branchen. Die Vielfalt österreichischer Fachbetriebe soll sichtbar werden.'], ['Wie werden Meisterbetriebe präsentiert?', 'Jeder Betrieb erhält ein strukturiertes Profil mit Leistungen, Branche, Standort und Kontaktmöglichkeiten – klar und professionell aufbereitet.'], ['Was kostet eine Mitgliedschaft?', 'Konkrete Preise und Modelle stehen derzeit noch nicht fest. Wir informieren, sobald die Aufnahme startet.'], ['Wann startet die Aufnahme?', 'Die Aufnahme neuer Meisterbetriebe startet in Kürze. Hinterlassen Sie uns gerne Ihr unverbindliches Interesse.'], ['Wie kann ich Interesse bekunden?', 'Über die Kontaktseite können Sie uns eine Nachricht vorbereiten. Das Formular versendet derzeit noch nichts.']];
export function FAQPage() {
  const [active, setActive] = useState<number | null>(0);
  return <><SEO title="Häufige Fragen" description="Antworten zu Meisterverbund Österreich, Teilnahme, Profilen und Aufnahme." /><PageHero eyebrow="Orientierung" title="Häufige Fragen"><p>Was Sie über die Plattform, zukünftige Profile und die Aufnahme von Meisterbetrieben wissen sollten.</p></PageHero><section className="section"><div className="narrow"><div className="faq-list">{faqs.map(([q, a], i) => <div className="faq-item" key={q}><button className="faq-question" type="button" aria-expanded={active === i} onClick={() => setActive(active === i ? null : i)} data-testid={`button-faq-${i}`}><span>{q}</span><ChevronDown size={18} className={active === i ? 'rotate' : ''} /></button><div className="faq-answer" hidden={active !== i}>{a}</div></div>)}</div></div></section></>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return <><SEO title="Kontakt" description="Nehmen Sie Kontakt mit Meisterverbund Österreich auf." /><PageHero eyebrow="Direkter Draht" title="Kontakt aufnehmen"><p>Sie möchten mehr erfahren, Interesse bekunden oder haben eine Frage? Schreiben Sie uns – das Kontaktformular wird derzeit vorbereitet.</p></PageHero><section className="section"><div className="container contact-grid"><div><div className="eyebrow">Wir hören zu</div><h2 className="display" style={{ fontSize: '3rem', margin: '18px 0' }}>Sprechen wir<br />über Qualität.</h2><p className="muted">Für Fragen zur Plattform, zu zukünftigen Profilen oder zur Aufnahme als Meisterbetrieb.</p><div className="contact-lines"><div className="contact-line"><span>E-Mail</span><strong>kontakt@meisterverbund.at</strong></div><div className="contact-line"><span>Telefon</span><strong>In Vorbereitung</strong></div></div></div><form className="form-card" onSubmit={e => { e.preventDefault(); setSent(true); }} data-testid="form-contact">{sent && <div className="form-message" role="status">Das Kontaktformular wird derzeit vorbereitet.</div>}<div className="form-row"><div className="form-field"><label htmlFor="name">Name</label><input id="name" className="field" required data-testid="input-name" /></div><div className="form-field"><label htmlFor="email">E-Mail</label><input id="email" className="field" type="email" required data-testid="input-email" /></div></div><div className="form-row"><div className="form-field"><label htmlFor="company">Unternehmen</label><input id="company" className="field" data-testid="input-company" /></div><div className="form-field"><label htmlFor="subject">Betreff</label><input id="subject" className="field" required data-testid="input-subject" /></div></div><div className="form-field"><label htmlFor="message">Nachricht</label><textarea id="message" className="field textarea" required data-testid="input-message" /></div><button type="submit" className="button-primary" data-testid="button-submit-contact">Nachricht senden <ArrowRight size={16} /></button></form></div></section></>;
}

export function LegalPage({ kind }: { kind: 'impressum' | 'datenschutz' }) {
  const isImprint = kind === 'impressum';
  return <><SEO title={isImprint ? 'Impressum' : 'Datenschutz'} description={`${isImprint ? 'Impressum' : 'Datenschutzerklärung'} von Meisterverbund Österreich.`} /><PageHero eyebrow="Rechtliches" title={isImprint ? 'Impressum' : 'Datenschutz'}><p>{isImprint ? 'Rechtliche Angaben werden vor Veröffentlichung ergänzt.' : 'Die vollständige Datenschutzerklärung wird vor Veröffentlichung ergänzt.'}</p></PageHero><section className="section"><div className="narrow legal-copy"><div className="eyebrow">Platzhalterseite</div><h2>{isImprint ? 'Rechtliche Angaben' : 'Datenschutzhinweise'}</h2><p>{isImprint ? 'Die rechtlichen Angaben zu Meisterverbund Österreich werden vor Veröffentlichung vollständig ergänzt. Diese statische Vorschau enthält bewusst keine erfundenen Firmen-, Adress-, Register- oder Steuerdaten.' : 'Die vollständige Datenschutzerklärung wird vor Veröffentlichung ergänzt. Bis dahin werden an dieser Stelle keine personenbezogenen Daten verarbeitet oder übermittelt.'}</p><h2>Stand der Information</h2><p>Diese Seite ist Teil der Frontend-Vorschau von Meisterverbund Österreich und dient ausschließlich der Darstellung des geplanten Aufbaus.</p><Link href="/kontakt" className="text-link">Fragen zu dieser Seite? <ArrowRight size={15} /></Link></div></section></>;
}
