import { usePosts } from "@/hooks/use-posts";
import { Navigation } from "@/components/Navigation";
import { Link } from "wouter";
import { ArrowRight, Newspaper } from "lucide-react";

export default function NewsList() {
  const { data: posts, isLoading } = usePosts(true);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-muted py-12 border-b border-border">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Aktuelles</h1>
          <p className="text-lg text-muted-foreground">Neuigkeiten aus dem Handwerk und unserem Verbund.</p>
        </div>
      </div>

      <div className="container px-4 sm:px-8 max-w-7xl mx-auto py-12">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : posts?.length === 0 ? (
           <div className="text-center py-20">
             <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
             <p className="text-muted-foreground">Aktuell keine Beiträge vorhanden.</p>
           </div>
        ) : (
          <div className="grid gap-8 max-w-3xl mx-auto">
            {posts?.map((post) => (
              <article key={post.id} className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
                      {post.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="prose max-w-none text-muted-foreground mb-6 line-clamp-3">
                    {post.contentMarkdown.replace(/[#*`]/g, '')}
                  </div>
                  <Link href={`/news/${post.slug}`}>
                    <Button variant="link" className="p-0 h-auto font-semibold text-primary">
                      Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
