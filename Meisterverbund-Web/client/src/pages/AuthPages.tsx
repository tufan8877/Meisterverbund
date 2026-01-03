import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Willkommen zurück</h1>
          <p className="text-muted-foreground">Melden Sie sich an, um fortzufahren</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Adresse</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="animate-spin mr-2" /> : null}
            Anmelden
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Noch kein Konto? <Link href="/register" className="text-primary font-bold hover:underline">Jetzt registrieren</Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isRegistering } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, password, username: email, role: 'user' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Konto erstellen</h1>
          <p className="text-muted-foreground">Werden Sie Teil des Meisterverbunds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Adresse</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Mindestens 6 Zeichen</p>
          </div>
          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? <Loader2 className="animate-spin mr-2" /> : null}
            Registrieren
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Bereits ein Konto? <Link href="/login" className="text-primary font-bold hover:underline">Anmelden</Link>
        </div>
      </div>
    </div>
  );
}
