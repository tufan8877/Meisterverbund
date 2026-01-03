import { useCompany } from "@/hooks/use-companies";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  CheckCircle2, 
  Calendar,
  Building2
} from "lucide-react";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function CompanyDetail() {
  const { id } = useParams();
  const companyId = Number(id);
  const { data: company, isLoading } = useCompany(companyId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(companyId);
  const { user } = useAuth();
  const createReview = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Laden...</div>;
  }

  if (!company) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Betrieb nicht gefunden.</div>;
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate(
      { companyId, stars: rating, comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-primary text-white py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-xl shadow-xl flex items-center justify-center shrink-0 border-4 border-white/20">
              {company.imageUrl ? (
                <img src={company.imageUrl} alt={company.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-16 h-16 text-primary" />
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider backdrop-blur-sm">
                  {company.category}
                </span>
                {company.isMasterVerified && (
                  <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> Meisterbetrieb
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-serif font-bold mb-4">{company.name}</h1>
              
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 opacity-70" />
                  {company.address}, {company.city}
                </div>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Globe className="w-5 h-5 opacity-70" />
                    Webseite besuchen
                  </a>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 opacity-70" />
                    {company.phone}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-[140px]">
              <div className="text-4xl font-bold font-serif mb-1">
                {company.averageRating ? Number(company.averageRating).toFixed(1) : "-"}
              </div>
              <div className="flex justify-center text-accent mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(company.averageRating || 0) ? "fill-current" : "text-white/20"}`} />
                ))}
              </div>
              <div className="text-xs text-white/70">
                {company.reviewCount} Bewertungen
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-8 max-w-7xl mx-auto py-12 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6 text-primary border-b border-border pb-2">Über Uns</h2>
            <div className="prose max-w-none text-muted-foreground leading-relaxed">
              <p>{company.description}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-8 text-primary border-b border-border pb-2 flex justify-between items-center">
              Bewertungen
              <span className="text-sm font-sans font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {company.reviewCount} gesamt
              </span>
            </h2>

            {/* Review Form */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="bg-muted/30 p-6 rounded-xl border border-border mb-10">
                <h3 className="font-bold mb-4">Ihre Erfahrung teilen</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} 
                      />
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="Wie war Ihre Erfahrung mit diesem Betrieb?" 
                  className="mb-4 bg-background min-h-[100px]"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <Button type="submit" disabled={createReview.isPending || rating === 0}>
                  {createReview.isPending ? "Wird gesendet..." : "Bewertung absenden"}
                </Button>
              </form>
            ) : (
              <div className="bg-muted/30 p-6 rounded-xl border border-border mb-10 text-center">
                <p className="text-muted-foreground mb-4">Bitte melden Sie sich an, um eine Bewertung abzugeben.</p>
                <Link href="/login"><Button variant="outline">Anmelden</Button></Link>
              </div>
            )}

            {/* Review List */}
            <div className="space-y-6">
              {reviewsLoading ? (
                <div>Laden...</div>
              ) : reviews?.length === 0 ? (
                <div className="text-muted-foreground italic">Noch keine Bewertungen vorhanden.</div>
              ) : (
                reviews?.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{review.user.email.split('@')[0]}</div>
                        <div className="flex text-yellow-500 my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.stars ? "fill-current" : "text-muted-foreground/30"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {review.createdAt ? format(new Date(review.createdAt), "dd. MMMM yyyy", { locale: de }) : "-"}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-4">Kontakt aufnehmen</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Telefon</div>
                  <div>{company.phone || "Nicht verfügbar"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Webseite</div>
                  {company.website ? (
                    <a href={company.website} target="_blank" className="text-primary hover:underline truncate block max-w-[200px]">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <div>Nicht verfügbar</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Adresse</div>
                  <div>{company.address}<br/>{company.city}, {company.state}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <Button className="w-full text-lg h-12">Kontaktanfrage senden</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
