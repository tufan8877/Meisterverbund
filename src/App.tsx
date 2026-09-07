import { Route, Switch, Router as WouterRouter } from 'wouter';
import { SiteShell } from './components/site-shell';
import { LoginPage, NewsPage, RegisterPage } from './pages/auth-news';
import { AboutPage, ContactPage, DemoProfilePage, DirectoryPage, FAQPage, ForBusinessesPage, HomePage, IndustriesPage, IndustryDetailPage, LegalPage } from './pages/site-pages';

function NotFound() {
  return <section className="page-hero"><div className="container reveal"><div className="eyebrow">404</div><h1 className="display">Seite nicht gefunden</h1><p>Die angeforderte Seite ist nicht verfügbar.</p></div></section>;
}

function AppRoutes() {
  return <SiteShell><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/meisterbetriebe" component={DirectoryPage} />
    <Route path="/meisterbetriebe/demo" component={DemoProfilePage} />
    <Route path="/branchen" component={IndustriesPage} />
    <Route path="/branchen/:slug" component={IndustryDetailPage} />
    <Route path="/ueber-uns" component={AboutPage} />
    <Route path="/fuer-betriebe" component={ForBusinessesPage} />
    <Route path="/news" component={NewsPage} />
    <Route path="/anmelden" component={LoginPage} />
    <Route path="/registrieren" component={RegisterPage} />
    <Route path="/faq" component={FAQPage} />
    <Route path="/kontakt" component={ContactPage} />
    <Route path="/impressum" component={() => <LegalPage kind="impressum" />} />
    <Route path="/datenschutz" component={() => <LegalPage kind="datenschutz" />} />
    <Route component={NotFound} />
  </Switch></SiteShell>;
}

export default function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppRoutes /></WouterRouter>;
}
