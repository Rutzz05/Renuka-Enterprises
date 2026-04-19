import { Link } from "react-router-dom";
import { Phone, Droplets, Zap, Clock, Shield, Wrench, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";

const PHONE = "+919823021804";

// Service cards with features
const services = [
  {
    icon: Droplets,
    title: "Aquaguard Services",
    description: "Complete water purification solutions - sales, installation, servicing, and repair. Pure water for your family.",
    features: ["Installation", "Servicing", "Repair", "Maintenance"],
  },
  {
    icon: Zap,
    title: "Inverter Solutions",
    description: "Backup power systems - sales, installation, repair, and battery replacement. Never lose power again.",
    features: ["Sales", "Installation", "Repairs", "Battery Replacement"],
  },
  {
    icon: Wrench,
    title: "AMC & Support",
    description: "Annual maintenance contracts and 24/7 customer support. We keep your systems running smoothly.",
    features: ["24/7 Support", "Maintenance", "Warranty", "Quick Response"],
  },
];

// Why choose us
const whyChooseUs = [
  { icon: Clock, title: "10+ Years Experience", description: "Trusted by thousands of customers" },
  { icon: Shield, title: "Certified Technicians", description: "Factory-trained & certified experts" },
  { icon: Phone, title: "24/7 Support", description: "Always available when you need us" },
  { icon: CheckCircle, title: "Quality Guaranteed", description: "We stand behind our work" },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="hero relative overflow-hidden" 
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="absolute inset-0 space-y-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        </div>

        <div className="container relative z-10 text-center text-primary-foreground max-w-4xl mx-auto py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 opacity-80">
            Nashik's Trusted Service Partner
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Renuka Enterprises
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90 mb-10 font-body leading-relaxed">
            10+ years of reliable Aquaguard & Inverter services — sales, installation, repair & maintenance for residential and commercial needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${PHONE}`}>
              <Button 
                size="lg" 
                className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-lg"
              >
                <Phone className="w-5 h-5" /> Call for Service
              </Button>
            </a>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button
                  size="lg"
                  className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                >
                  Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                >
                  Login / Register
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-bold">What We Offer</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Comprehensive solutions for water purification and backup power systems tailored to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold">Why Renuka Enterprises</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Trusted by over 5000 satisfied customers across Nashik with quality service you can rely on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title}
                  className="bg-background rounded-xl p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 md:p-16 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our technicians are ready to help. We serve all areas across Nashik with fast, reliable service.
          </p>
          <a href={`tel:${PHONE}`}>
            <Button 
              size="lg"
              className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-lg"
            >
              <Phone className="w-5 h-5" /> Call +91 98230 21804
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
