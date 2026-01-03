import { useCompanies } from "@/hooks/use-companies";
import { usePosts } from "@/hooks/use-posts";
import { Navigation } from "@/components/Navigation";
import { CompanyCard } from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Search, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: posts, isLoading: postsLoading } = usePosts(true);

  // Filter top rated companies for the showcase
  const topCompanies = companies
    ?.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 3);

  const latestPosts = posts?.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative py-24 lg:py-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary/90"></div>
        
        <div className="container relative z-10 px-4 sm:px-8 max-w-7xl mx-auto text-center lg:text-left">
          <div className="lg:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 mb-6 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium uppercase tracking-wider">Geprüfte Qualität</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                Handwerk mit <span className="text-accent italic">Tradition</span> und Vertrauen.
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                Finden Sie erstklassige Meisterbetriebe in Ihrer Region. 
                Geprüfte Qualität, echte Bewertungen und direkte Kontakte.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/firmen">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-accent font-semibold text-lg px-8 py-6 shadow-xl">
                    <Search className="mr-2 h-5 w-5" />
                    Meister finden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent text-lg px-8 py-6">
                    Betrieb eintragen
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Featured Companies */}
      <section className="py-20 bg-background">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-3">Ausgezeichnete Betriebe</h2>
              <p className="text-muted-foreground text-lg">Die am besten bewerteten Meisterbetriebe des Monats.</p>
            </div>
            <Link href="/firmen" className="hidden sm:inline-flex text-primary font-medium hover:underline items-center gap-1">
              Alle ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {companiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topCompanies?.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/firmen">
              <Button variant="outline" className="w-full">Alle ansehen</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000')] bg-fixed bg-cover opacity-10 mix-blend-multiply"></div>
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Geprüfte Meister</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Jeder als "Meisterbetrieb" gekennzeichnete Eintrag wurde von uns manuell auf den Meisterbrief geprüft.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Echte Bewertungen</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Transparente Kundenbewertungen helfen Ihnen, den richtigen Partner für Ihr Projekt zu finden.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                <Search className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Einfache Suche</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Filtern Sie gezielt nach Gewerk, Standort und Verfügbarkeit in Ihrer direkten Umgebung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3">Aktuelles aus dem Handwerk</h2>
              <p className="text-muted-foreground text-lg">Neuigkeiten, Berichte und Informationen.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {postsLoading ? (
              [1, 2].map((i) => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)
            ) : (
              latestPosts?.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group">
                  <article className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
                        {post.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
                      {/* Naive markdown strip for preview */}
                      {post.contentMarkdown.replace(/[#*`]/g, '')}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary">
                      Mehr lesen <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-16">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-serif text-2xl font-bold">Meisterverbund</span>
            </div>
            <p className="text-background/60 max-w-md leading-relaxed">
              Die führende Plattform für qualifizierte Handwerksbetriebe. 
              Wir verbinden Qualität mit Tradition und schaffen Vertrauen durch Transparenz.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Navigation</h4>
            <ul className="space-y-4 text-background/60">
              <li><Link href="/" className="hover:text-white transition-colors">Startseite</Link></li>
              <li><Link href="/firmen" className="hover:text-white transition-colors">Meister finden</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Magazin</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Für Betriebe</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Rechtliches</h4>
            <ul className="space-y-4 text-background/60">
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-background/40 text-sm">
          © {new Date().getFullYear()} Meisterverbund. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
