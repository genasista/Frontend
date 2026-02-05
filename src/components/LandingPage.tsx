import { Button } from './ui/button';
import { BookOpen, Users, Award } from 'lucide-react';
import Navbar from "@/components/Navbar";

interface LandingPageProps { onNavigate: (page: string) => void; }

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="app-screen">
      {/* Shared Navbar (translucent) */}
      <Navbar
        brand="GenEd"
        showAuthButtons
        onLogin={() => onNavigate('login')}
        onRegister={() => onNavigate('register')}
        variant="default"
      />

      {/* Hero */}
      <section className="hero container-page">
        <h1 className="mb-6 text-5xl text-foreground">Digitalt lärande för moderna skolor</h1>
        <p className="mb-8 max-w-2xl mx-auto text-xl text-muted-foreground">
          En komplett plattform för lärare, elever och föräldrar. Samla allt på ett ställe och fokusera på det viktiga - lärandet.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => onNavigate('demo')} className="btn secondary-btn">Testa demo</Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate('register')} className="btn secondary-btn">Skapa konto</Button>
        </div>
      </section>

      {/* Features */}
      <section className="section container-page">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card frosted p-6">
            <BookOpen className="w-12 h-12 text-[--brand] mb-4" />
            <h3 className="text-xl mb-2">För lärare</h3>
            <p className="card-muted">Skapa och hantera kurser, rätta uppgifter och sätt betyg - allt på ett ställe.</p>
          </div>
          <div className="card frosted p-6">
            <Users className="w-12 h-12 text-[--brand] mb-4" />
            <h3 className="text-xl mb-2">För elever</h3>
            <p className="card-muted">Få tillgång till kursinnehåll, lämna in uppgifter och följ dina framsteg.</p>
          </div>
          <div className="card frosted p-6">
            <Award className="w-12 h-12 text-[--brand] mb-4" />
            <h3 className="text-xl mb-2">För föräldrar</h3>
            <p className="card-muted">Håll koll på ditt barns utveckling och kommunicera med lärare.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container-page center">
        <div className="cta">
          <h2 className="heading-2 mb-2">Redo att komma igång?</h2>
          <p className="lead mb-6">Prova plattformen kostnadsfritt i vår demo</p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('demo')} className="btn primary-btn">Starta demo nu</Button>
        </div>
      </section>
    </div>
  );
}
