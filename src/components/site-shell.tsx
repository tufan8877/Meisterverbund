import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Menu, X } from 'lucide-react';

const navItems = [
  ['/', 'Startseite'],
  ['/meisterbetriebe', 'Meisterbetriebe'],
  ['/branchen', 'Branchen'],
  ['/ueber-uns', 'Über uns'],
  ['/fuer-betriebe', 'Für Betriebe'],
  ['/faq', 'FAQ'],
  ['/kontakt', 'Kontakt'],
];

export function Brand() {
  return (
    <Link href="/" className="brand" data-testid="link-brand">
      <span className="brand-mark" aria-hidden="true">M.</span>
      <span>Meisterverbund<small>Österreich</small></span>
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <div className="site-shell">
      <div className="topbar">
        <div className="container topbar-inner">
          <Brand />
          <nav className="utility-links" aria-label="Service-Navigation">
            <Link href="/kontakt" data-testid="link-utility-contact">Kontakt</Link>
            <Link href="/meisterbetriebe" data-testid="link-utility-search">Suche</Link>
            <span aria-label="Land">Österreich</span>
          </nav>
        </div>
      </div>
      <header className="header">
        <div className="container nav-inner">
          <nav className="nav-links" aria-label="Hauptnavigation">
            {navItems.map(([href, label]) => (
              <Link key={href} href={href} aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/kontakt" className="nav-cta" data-testid="link-header-contact">Kontaktieren <ArrowRight size={15} /></Link>
          <button className="mobile-toggle" type="button" aria-label={open ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
        {open && (
          <nav className="mobile-menu" aria-label="Mobile Navigation">
            <div className="container">
              {navItems.map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>
              ))}
              <Link href="/kontakt" className="button-primary" onClick={() => setOpen(false)} data-testid="link-mobile-contact">Kontaktieren <ArrowRight size={15} /></Link>
            </div>
          </nav>
        )}
      </header>
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p className="footer-copy">Plattform für österreichische Meisterbetriebe. Für Qualität, die bleibt.</p>
        </div>
        <div>
          <h3>Entdecken</h3>
          <div className="footer-links">
            <Link href="/meisterbetriebe">Meisterbetriebe</Link>
            <Link href="/branchen">Branchen</Link>
            <Link href="/ueber-uns">Über uns</Link>
            <Link href="/fuer-betriebe">Für Betriebe</Link>
          </div>
        </div>
        <div>
          <h3>Service</h3>
          <div className="footer-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/kontakt">Kontakt</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Meisterverbund Österreich</span>
        <span>Ein gemeinsamer Auftritt für echte Meisterqualität.</span>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container reveal">
        <div className="breadcrumbs"><Link href="/">Startseite</Link> <span>/</span> {title}</div>
        <div className="eyebrow" style={{ marginTop: 30 }}>{eyebrow}</div>
        <h1 className="display">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="section-heading">
      <div><div className="eyebrow">{eyebrow}</div><h2 className="display">{title}</h2></div>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Seal({ small = false }: { small?: boolean }) {
  return (
    <div className="seal" style={small ? { width: 180, height: 180 } : undefined} aria-label="Meisterverbund Qualitätssiegel Platzhalter">
      <div className="seal-core"><strong>MV</strong><span>Meisterqualität<br />Österreich</span></div>
    </div>
  );
}
