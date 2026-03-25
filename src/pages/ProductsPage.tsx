import { Droplets, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE = "+919876543210";

const products = [
  { name: "Aquaguard Aura", category: "Water Purifier", icon: Droplets, desc: "RO+UV+MTDS for pure drinking water at home." },
  { name: "Aquaguard Enhance", category: "Water Purifier", icon: Droplets, desc: "Advanced 7-stage purification with mineral guard." },
  { name: "Aquaguard Marvel", category: "Water Purifier", icon: Droplets, desc: "Compact wall-mount purifier ideal for small kitchens." },
  { name: "Aquaguard Reviva", category: "Water Purifier", icon: Droplets, desc: "Budget-friendly RO purifier with high storage." },
  { name: "Luminous Zelio 1100", category: "Inverter", icon: Zap, desc: "Pure sine wave inverter for 2-3 fan + lights load." },
  { name: "Luminous Cruze 2KVA", category: "Inverter", icon: Zap, desc: "Heavy-duty inverter for entire home backup." },
  { name: "Exide 150Ah Tall Tubular", category: "Battery", icon: Zap, desc: "Long-lasting tubular battery with 36-month warranty." },
  { name: "Amaron 200Ah", category: "Battery", icon: Zap, desc: "Premium inverter battery with fast charging technology." },
];

export default function ProductsPage() {
  return (
    <>
      <section className="hero" style={{ background: "var(--hero-gradient)" }}>
        <div className="container text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Products</h1>
          <p className="opacity-90 max-w-lg mx-auto">
            Quality water purifiers, inverters & batteries from trusted brands.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div
              key={p.name}
              className="card-elevated rounded-lg bg-card p-6 transition-smooth flex flex-col"
            >
              <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center mb-4">
                <p.icon className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wide">{p.category}</span>
              <h3 className="text-base font-bold mt-1 mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground flex-1">{p.desc}</p>
              <a href={`tel:${PHONE}`} className="mt-4">
                <Button variant="outline" size="sm" className="w-full text-primary border-primary/30 hover:bg-primary/5">
                  Enquire Now
                </Button>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
