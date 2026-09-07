import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, CalendarDays, LogIn, UserPlus } from 'lucide-react';
import { PageHero } from '../components/site-shell';

type StoredUser = { name: string; email: string; password: string };

function setSEO(title: string, description: string) {
  document.title = `${title} · Meisterverbund Österreich`;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', 'description'); document.head.appendChild(tag); }
  tag.setAttribute('content', description);
}

export function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => setSEO('Anmelden', 'Beim Meisterverbund Österreich anmelden.'), []);
  function submit(e: FormEvent) {
    e.preventDefault();
    const users: StoredUser[] = JSON.parse(localStorage.getItem('meisterverbund_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) { setMessage('E-Mail-Adresse oder Passwort ist nicht korrekt.'); return; }
    localStorage.setItem('meisterverbund_session', JSON.stringify({ name: user.name, email: user.email }));
    window.dispatchEvent(new Event('meisterverbund-auth'));
    navigate('/');
  }
  return <>
    <PageHero eyebrow="Mitgliederbereich" title="Anmelden"><p>Melden Sie sich mit Ihrem Meisterverbund-Konto an.</p></PageHero>
    <section className="section"><div className="narrow"><form className="form-card" onSubmit={submit}>
      {message && <div className="form-message">{message}</div>}
      <div className="form-field"><label htmlFor="login-email">E-Mail</label><input id="login-email" className="field" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="form-field"><label htmlFor="login-password">Passwort</label><input id="login-password" className="field" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button className="button-primary" type="submit"><LogIn size={16}/> Anmelden</button>
      <p className="muted">Noch kein Konto? <Link className="text-link" href="/registrieren">Jetzt registrieren <ArrowRight size={14}/></Link></p>
    </form></div></section>
  </>;
}

export function RegisterPage() {
  const [, navigate] = useLocation();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState('');
  useEffect(() => setSEO('Registrieren', 'Konto beim Meisterverbund Österreich erstellen.'), []);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setMessage('Das Passwort muss mindestens 8 Zeichen lang sein.'); return; }
    if (password !== confirm) { setMessage('Die Passwörter stimmen nicht überein.'); return; }
    const users: StoredUser[] = JSON.parse(localStorage.getItem('meisterverbund_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) { setMessage('Für diese E-Mail-Adresse besteht bereits ein Konto.'); return; }
    users.push({ name: name.trim(), email: email.trim(), password });
    localStorage.setItem('meisterverbund_users', JSON.stringify(users));
    localStorage.setItem('meisterverbund_session', JSON.stringify({ name: name.trim(), email: email.trim() }));
    window.dispatchEvent(new Event('meisterverbund-auth'));
    navigate('/');
  }
  return <>
    <PageHero eyebrow="Mitglied werden" title="Registrieren"><p>Erstellen Sie Ihr Meisterverbund-Konto. Die Registrierung wird später mit dem Meisterbetrieb-Profil verbunden.</p></PageHero>
    <section className="section"><div className="narrow"><form className="form-card" onSubmit={submit}>
      {message && <div className="form-message">{message}</div>}
      <div className="form-field"><label htmlFor="reg-name">Name / Ansprechpartner</label><input id="reg-name" className="field" required value={name} onChange={e=>setName(e.target.value)} /></div>
      <div className="form-field"><label htmlFor="reg-email">E-Mail</label><input id="reg-email" className="field" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="form-row"><div className="form-field"><label htmlFor="reg-password">Passwort</label><input id="reg-password" className="field" type="password" autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)} /></div><div className="form-field"><label htmlFor="reg-confirm">Passwort wiederholen</label><input id="reg-confirm" className="field" type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)} /></div></div>
      <button className="button-primary" type="submit"><UserPlus size={16}/> Registrieren</button>
      <p className="muted">Bereits registriert? <Link className="text-link" href="/anmelden">Zur Anmeldung <ArrowRight size={14}/></Link></p>
    </form></div></section>
  </>;
}

const news = [
  { date: '07. September 2026', title: 'Meisterverbund Österreich entsteht', text: 'Wir bauen die Plattform für österreichische Meisterbetriebe Schritt für Schritt auf. Hier informieren wir künftig über Neuigkeiten, Entwicklungen und wichtige Meldungen.' },
  { date: '07. September 2026', title: 'News-Bereich gestartet', text: 'Auf dieser Seite erscheinen künftig Nachrichten aus dem Meisterverbund, Informationen für Betriebe und Neuigkeiten rund um österreichische Meisterqualität.' }
];

export function NewsPage() {
  useEffect(() => setSEO('News', 'Nachrichten und Neuigkeiten aus dem Meisterverbund Österreich.'), []);
  return <>
    <PageHero eyebrow="Aktuelles" title="News"><p>Nachrichten, Neuigkeiten und Entwicklungen aus dem Meisterverbund Österreich.</p></PageHero>
    <section className="section"><div className="container"><div className="profile-grid">
      {news.map(item => <article className="profile-card" key={item.title}><div className="eyebrow"><CalendarDays size={13} style={{verticalAlign:'middle',marginRight:7}}/>{item.date}</div><h2>{item.title}</h2><p>{item.text}</p><span className="text-link">Meisterverbund Österreich</span></article>)}
    </div></div></section>
  </>;
}
