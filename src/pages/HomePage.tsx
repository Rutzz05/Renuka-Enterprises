import { Link } from "react-router-dom";
import { Phone, Droplets, Zap, ShieldCheck, Star, Clock, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const PHONE = "+919823021804";

const highlights = [
  { icon: Clock, title: "10+ Years", desc: "Of trusted service in Nashik" },
  { icon: ShieldCheck, title: "Certified Experts", desc: "Factory-trained technicians" },
  { icon: Star, title: "5000+ Customers", desc: "Satisfied families & businesses" },
  { icon: Wrench, title: "Same-Day Service", desc: "Quick response, reliable repairs" },
];

const services = [
  {
    icon: Droplets,
    title: "Aquaguard Services",
    desc: "Sales, installation, servicing & repair of water purifiers. Pure water for your family.",
    link: "/services",
  },
  {
    icon: Zap,
    title: "Inverter & Battery",
    desc: "Inverter sales, installation, repair & battery replacement. Never lose power.",
    link: "/services",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ background: "var(--hero-gradient)" }}>
        <div className="container relative z-10 text-center text-primary-foreground max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 opacity-80">
            Nashik's Trusted Service Partner
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Renuka Enterprises
          </h1>
          <p className="max-w-xl mx-auto text-lg opacity-90 mb-8 font-body">
            10+ years of reliable Aquaguard & Inverter services — sales, installation, repair & maintenance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={`tel:${PHONE}`}>
              <Button size="lg" className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-lg">
                <Phone className="w-5 h-5" /> Call for Service
              </Button>
            </a>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                >
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
      </section>

      {/* Highlights */}
      <section className="container section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="card-elevated rounded-lg bg-card p-6 text-center transition-smooth animate-fade-in"
            >
              <h.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-bold">{h.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-muted/50 section">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">Our Core Services</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {services.map((s) => (
              <Link
                key={s.title}
                to={s.link}
                className="group card-elevated rounded-lg bg-card p-6 transition-smooth hover:-translate-y-[4px]"
              >
                <s.icon className="w-10 h-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container section text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Immediate Assistance?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Our technicians are just a call away. We serve all areas across Nashik.
        </p>
        <a href={`tel:${PHONE}`}>
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Phone className="w-5 h-5" /> +91 98230 21804
          </Button>
        </a>
      </section>
    </>
  );
}
