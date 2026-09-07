import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';

const navItems = [
  ['/', 'Startseite'],
  ['/meisterbetriebe', 'Meisterbetriebe'],
  ['/branchen', 'Branchen'],
  ['/ueber-uns', 'Über uns'],
  ['/fuer-betriebe', 'Für Betriebe'],
  ['/news', 'News'],
];

export function Brand({ footer = false }: { footer?: boolean }) {
  if (footer) {
    return (
      <Link href="/" className="brand" data-testid="link-brand" style={{ gap: 12 }}>
        <img src="/favicon.svg" alt="" aria-hidden="true" style={{ width: 38, height: 44, display: 'block' }} />
        <span style={{ color: '#fff', lineHeight: 1.05 }}>
          Meisterverbund
          <small style={{ color: '#b8bcc3' }}>Österreich</small>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="brand" data-testid="link-brand" aria-label="Meisterverbund Österreich – Startseite">
      <img
        src="/meisterverbund-logo.svg"
        alt="Meisterverbund Österreich"
        style={{ width: 228, maxWidth: '42vw', height: 'auto', display: 'block' }}
      />
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const [session, setSession] = useState<{name:string;email:string}|null>(null);
  useEffect(() => {
    const read = () => { try { setSession(JSON.parse(localStorage.getItem('meisterverbund_session') || 'null')); } catch { setSession(null); } };
    read(); window.addEventListener('meisterverbund-auth', read); return () => window.removeEventListener('meisterverbund-auth', read);
  }, []);
  const logout = () => { localStorage.removeItem('meisterverbund_session'); setSession(null); };
  return <div className="site-shell">
    <div className="topbar"><div className="container topbar-inner"><Brand /><nav className="utility-links" aria-label="Service-Navigation"><Link href="/meisterbetriebe">Suche</Link><span aria-label="Land">Österreich</span></nav></div></div>
    <header className="header"><div className="container nav-inner">
      <nav className="nav-links" aria-label="Hauptnavigation">{navItems.map(([href,label]) => <Link key={href} href={href} aria-current={location===href?'page':undefined}>{label}</Link>)}</nav>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {session ? <><span className="muted" style={{fontSize:'.78rem',fontWeight:700}}>{session.name}</span><button type="button" className="button-secondary" onClick={logout}>Abmelden</button></> : <><Link href="/anmelden" className="button-secondary"><LogIn size={15}/> Anmelden</Link><Link href="/registrieren" className="nav-cta"><UserPlus size={15}/> Registrieren</Link></>}
      </div>
      <button className="mobile-toggle" type="button" aria-label={open?'Menü schließen':'Menü öffnen'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={25}/>:<Menu size={25}/>}</button>
    </div>
    {open && <nav className="mobile-menu" aria-label="Mobile Navigation"><div className="container">{navItems.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}{session?<button type="button" className="button-secondary" onClick={()=>{logout();setOpen(false)}}>Abmelden</button>:<><Link href="/anmelden" className="button-secondary" onClick={()=>setOpen(false)}>Anmelden</Link><Link href="/registrieren" className="button-primary" onClick={()=>setOpen(false)}>Registrieren</Link></>}</div></nav>}
    </header>
    <main className="site-main">{children}</main><Footer />
  </div>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-grid"><div><Brand footer /><p className="footer-copy">Plattform für österreichische Meisterbetriebe. Für Qualität, die bleibt.</p></div><div><h3>Entdecken</h3><div className="footer-links"><Link href="/meisterbetriebe">Meisterbetriebe</Link><Link href="/branchen">Branchen</Link><Link href="/ueber-uns">Über uns</Link><Link href="/fuer-betriebe">Für Betriebe</Link><Link href="/news">News</Link></div></div><div><h3>Service</h3><div className="footer-links"><Link href="/faq">FAQ</Link><Link href="/kontakt">Kontakt</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Meisterverbund Österreich</span><span>Ein gemeinsamer Auftritt für echte Meisterqualität.</span></div></footer>;
}

export function PageHero({ eyebrow, title, children }: { eyebrow:string; title:string; children?:ReactNode }) { return <section className="page-hero"><div className="container reveal"><div className="breadcrumbs"><Link href="/">Startseite</Link> <span>/</span> {title}</div><div className="eyebrow" style={{marginTop:30}}>{eyebrow}</div><h1 className="display">{title}</h1>{children}</div></section>; }
export function SectionHeading({ eyebrow, title, children }: { eyebrow:string; title:string; children?:ReactNode }) { return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2 className="display">{title}</h2></div>{children&&<p>{children}</p>}</div>; }
export function Seal({ small=false }: { small?:boolean }) { return <div className="seal" style={small?{width:180,height:180}:undefined} aria-label="Meisterverbund Qualitätssiegel Platzhalter"><div className="seal-core"><strong>MV</strong><span>Meisterqualität<br/>Österreich</span></div></div>; }
