import { Droplets, Zap, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE = "+919823021804";

const aquaguardServices = [
  "New Aquaguard Sales & Consultation",
  "Professional Installation",
  "Annual Maintenance & Servicing",
  "Filter Replacement",
  "Repair & Troubleshooting",
  "Water Quality Testing",
];

const inverterServices = [
  "Inverter & UPS Sales",
  "Home & Office Installation",
  "Battery Replacement",
  "Inverter Repair & Servicing",
  "Load Assessment & Recommendations",
  "Emergency Power Solutions",
];

export default function ServicesPage() {
  const handleCall = () => {
    window.location.href = `tel:${PHONE}`;
  };

  return (
    <>
      <section className="hero" style={{ background: "var(--hero-gradient)" }}>
        <div className="container text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Services</h1>
          <p className="opacity-90 max-w-lg mx-auto">
            Comprehensive Aquaguard & Inverter solutions for your home and business.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Aquaguard */}
          <div className="card-elevated rounded-lg bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Aquaguard Services</h2>
            </div>
            <ul className="space-y-3 mb-8">
              {aquaguardServices.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <a href={`tel:${PHONE}`} onClick={handleCall} aria-label="Book Aquaguard service by phone">
                <Phone className="w-4 h-4" /> Book Aquaguard Service
              </a>
            </Button>
          </div>

          {/* Inverter */}
          <div className="card-elevated rounded-lg bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Inverter & Battery Services</h2>
            </div>
            <ul className="space-y-3 mb-8">
              {inverterServices.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full sm:w-auto">
              <a href={`tel:${PHONE}`} onClick={handleCall} aria-label="Book inverter service by phone">
                <Phone className="w-4 h-4" /> Book Inverter Service
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
