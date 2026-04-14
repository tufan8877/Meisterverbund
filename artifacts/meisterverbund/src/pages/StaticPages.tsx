export function UeberUnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Über uns</h1>
      <div className="prose prose-sm max-w-none space-y-4 text-foreground/90 leading-relaxed">
        <p>
          Meisterverbund ist die führende Plattform für österreichische Handwerksmeister. 
          Wir verbinden qualifizierte Meisterbetriebe mit Kunden, die auf der Suche nach 
          hochwertigem Handwerk sind.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3">Unsere Mission</h2>
        <p>
          Unser Ziel ist es, das österreichische Handwerk zu stärken und sichtbarer zu machen. 
          Der Meistertitel steht für jahrelange Ausbildung, Qualität und Verlässlichkeit – 
          Werte, die wir auf unserer Plattform in den Mittelpunkt stellen.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3">Was wir bieten</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Verzeichnis verifizierter Meisterbetriebe aus allen österreichischen Bundesländern</li>
          <li>Fachbeiträge und News rund ums Handwerk</li>
          <li>Branchenrelevante Angebote und Anzeigen</li>
          <li>Echte Kundenbewertungen und -kommentare</li>
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-3">Österreichische Bundesländer</h2>
        <p>
          Wir decken alle neun Bundesländer Österreichs ab: Wien, Niederösterreich, 
          Oberösterreich, Steiermark, Tirol, Kärnten, Salzburg, Vorarlberg und Burgenland.
        </p>
      </div>
    </div>
  );
}

export function KontaktPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Kontakt</h1>
      <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">E-Mail</p>
            <a href="mailto:info@meisterverbund.at" className="text-primary hover:underline">info@meisterverbund.at</a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Adresse</p>
            <p className="text-sm">Meisterverbund GmbH<br />Handwerksgasse 1<br />1010 Wien, Österreich</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-4">Nachricht senden</h2>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input type="text" placeholder="Ihr Name" className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">E-Mail</label>
            <input type="email" placeholder="ihre@email.at" className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nachricht</label>
            <textarea rows={4} placeholder="Ihre Nachricht..." className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Senden
          </button>
        </form>
      </div>
    </div>
  );
}

export function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>
      <div className="prose prose-sm max-w-none text-foreground/90 space-y-3 leading-relaxed">
        <p><strong>Meisterverbund GmbH</strong></p>
        <p>Handwerksgasse 1, 1010 Wien, Österreich</p>
        <p>Registergericht: Handelsgericht Wien</p>
        <p>Firmenbuchnummer: FN 123456 x</p>
        <p>UID: ATU12345678</p>
        <p>Geschäftsführer: Max Mustermann</p>
        <p>E-Mail: <a href="mailto:info@meisterverbund.at" className="text-primary">info@meisterverbund.at</a></p>
      </div>
    </div>
  );
}

export function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>
      <div className="prose prose-sm max-w-none text-foreground/90 space-y-4 leading-relaxed">
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten 
          Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen 
          (DSGVO, TKG 2003).
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3">Erhobene Daten</h2>
        <p>
          Beim Besuch unserer Website werden folgende Daten erhoben: Name, E-Mail-Adresse 
          (bei Registrierung), Kommentare und Bewertungen.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3">Verwendung der Daten</h2>
        <p>
          Die erhobenen Daten werden ausschließlich zur Bereitstellung der Plattformfunktionen 
          verwendet und nicht an Dritte weitergegeben.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3">Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz wenden Sie sich bitte an: 
          <a href="mailto:datenschutz@meisterverbund.at" className="text-primary ml-1">datenschutz@meisterverbund.at</a>
        </p>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary/30 mb-4">404</h1>
        <h2 className="text-xl font-bold mb-3">Seite nicht gefunden</h2>
        <p className="text-muted-foreground text-sm mb-6">Die gesuchte Seite existiert nicht oder wurde verschoben.</p>
        <a href="/" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Zur Startseite
        </a>
      </div>
    </div>
  );
}
