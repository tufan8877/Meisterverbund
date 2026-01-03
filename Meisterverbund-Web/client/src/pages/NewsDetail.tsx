import { usePost } from "@/hooks/use-posts";
import { Navigation } from "@/components/Navigation";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const { slug } = useParams();
  const { data: post, isLoading } = usePost(slug!);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Laden...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Beitrag nicht gefunden.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="container px-4 sm:px-8 max-w-4xl mx-auto py-12 lg:py-20">
        <Link href="/news">
          <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
          </Button>
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-block px-3 py-1 text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-6">
            {post.type}
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-foreground">
            {post.title}
          </h1>
          <div className="text-muted-foreground">
            {post.createdAt && new Date(post.createdAt).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary max-w-none">
          {/* In a real app, use a proper markdown renderer library like react-markdown */}
          {post.contentMarkdown.split('\n').map((paragraph, idx) => (
             <p key={idx} className="mb-4 text-muted-foreground leading-relaxed">
               {paragraph}
             </p>
          ))}
        </div>
      </article>
    </div>
  );
}
