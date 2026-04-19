import { Link } from "react-router-dom";
import { CheckCircle2, Droplets, BatteryCharging, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const services = [
  {
    title: "Aquaguard service",
    description: "Installation, filter change, leakage checks, and regular maintenance for clean drinking water.",
    icon: Droplets,
  },
  {
    title: "Inverter service",
    description: "Repair, backup issues, charging problems, and routine checks for home and shop power systems.",
    icon: BatteryCharging,
  },
  {
    title: "Battery support",
    description: "Battery replacement guidance, health checks, and dependable support when backup performance drops.",
    icon: ShieldCheck,
  },
];

export default function HomePageV2() {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-emerald-100">
              Trusted local service in Nashik
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Aquaguard, inverter, and battery service you can rely on.
              </h1>
              <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
                Renuka Enterprises helps homes, shops, and local businesses with product supply,
                service visits, and dependable after-sales support. We focus on clear communication,
                timely response, and honest service.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                <Link to="/contact">
                  Request Service
                  <PhoneCall className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Link to="/products">
                  View Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-slate-300">
              {user
                ? `Welcome back, ${user.name}. You can track your bookings and invoices from your dashboard.`
                : "Service booking, product enquiries, and customer login are all available from one place."}
            </p>
          </div>

          <Card className="border-white/10 bg-white/10 text-white shadow-xl backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Why customers choose us</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">Simple, dependable local support</h2>
              </div>
              <div className="space-y-3">
                {[
                  "Aquaguard servicing and filter support",
                  "Inverter and battery troubleshooting",
                  "Clear communication on visits and status",
                  "Quick help for homes, offices, and shops",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <p className="text-sm text-slate-100">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">Our services</p>
          <h2 className="font-serif text-3xl font-semibold text-slate-950">Solutions for everyday power and water needs</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            We supply products and provide trusted service support for essential systems used in homes and businesses.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
        {services.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-border/60 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/60 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">Need help quickly?</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-950">Book a service visit or browse our products</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Whether you need urgent support, routine maintenance, or a new product enquiry, we are ready to help.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/contact">Request Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
