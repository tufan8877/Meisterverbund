import { useState } from "react";
import { useCompanies } from "@/hooks/use-companies";
import { Navigation } from "@/components/Navigation";
import { CompanyCard } from "@/components/CompanyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Hammer } from "lucide-react";

export default function CompanyList() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("all");
  const [category, setCategory] = useState("all");

  const { data: companies, isLoading } = useCompanies({
    search: search || undefined,
    state: state === "all" ? undefined : state,
    category: category === "all" ? undefined : category,
  });

  const states = [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
    "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
    "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
  ];

  const categories = [
    "Dachdecker", "Elektriker", "Fliesenleger", "Heizung & Sanitär",
    "Maler & Lackierer", "Schreiner", "Zimmerer", "Maurer"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="bg-primary py-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Meister finden</h1>
          <p className="text-white/80 text-lg">
            Suchen Sie gezielt nach qualifizierten Fachbetrieben in Ihrer Umgebung.
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-8 max-w-7xl mx-auto -mt-8 relative z-20 mb-12">
        <div className="bg-card rounded-xl p-6 shadow-xl border border-border grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Name suchen..." 
              className="pl-9 bg-background h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="pl-9 h-11 bg-background">
                <SelectValue placeholder="Bundesland" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Bundesländer</SelectItem>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Hammer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="pl-9 h-11 bg-background">
                <SelectValue placeholder="Gewerk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Gewerke</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-8 max-w-7xl mx-auto pb-20 flex-grow">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[350px] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : companies?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Keine Ergebnisse gefunden</h3>
            <p className="text-muted-foreground">Bitte passen Sie Ihre Suchfilter an.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies?.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>

      <footer className="bg-foreground text-background/60 py-8 text-center text-sm">
        © {new Date().getFullYear()} Meisterverbund
      </footer>
    </div>
  );
}
