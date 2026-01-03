import { Link } from "wouter";
import { Star, MapPin, CheckCircle2 } from "lucide-react";
import { type CompanyWithRating } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: CompanyWithRating;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/firmen/${company.id}`} className="block h-full transition-transform hover:-translate-y-1">
      <Card className="h-full overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 bg-muted overflow-hidden">
          {company.imageUrl ? (
            <img 
              src={company.imageUrl} 
              alt={company.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
              <span className="font-serif text-4xl opacity-20">{company.name.charAt(0)}</span>
            </div>
          )}
          
          {company.isMasterVerified && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-primary/20">
              <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">Meisterbetrieb</span>
            </div>
          )}
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wider">{company.category}</p>
              <h3 className="font-serif text-xl font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {company.name}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow">
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= Math.round(company.averageRating || 0) ? "fill-current" : "text-muted-foreground/30"}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              ({company.reviewCount} {company.reviewCount === 1 ? 'Bewertung' : 'Bewertungen'})
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{company.city}, {company.state}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0">
          <div className="w-full pt-4 border-t border-border mt-auto">
             <span className="text-sm font-medium text-primary hover:underline underline-offset-4">
               Profil ansehen &rarr;
             </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
