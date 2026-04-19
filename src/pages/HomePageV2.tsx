import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const highlights = [
  {
    title: "Trusted local service",
    description: "Reliable support for fabrication, supply, maintenance, and field requests.",
    icon: ShieldCheck,
  },
  {
    title: "Fast request handling",
    description: "Bookings flow directly into the dashboard so follow-up is quick and visible.",
    icon: Sparkles,
  },
  {
    title: "Built for operations",
    description: "Products, bookings, and invoices stay organized in one connected system.",
    icon: Wrench,
  },
];

export default function HomePageV2() {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-amber-100">
              Renuka Enterprises
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Professional industrial service requests, products, and billing in one place.
              </h1>
              <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
                A polished client-ready platform for customers to browse products, submit service
                requests, and track progress while your team manages bookings and invoices with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
                <Link to="/products">
                  Explore products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Link to="/contact">Request a service</Link>
              </Button>
            </div>
            <p className="text-sm text-slate-300">
              {user
                ? `Welcome back, ${user.name}. Your dashboard is ready.`
                : "Customer and admin access with secure role-based login."}
            </p>
          </div>

          <Card className="border-white/10 bg-white/10 text-white shadow-xl backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Why it works</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">Designed for day-to-day business operations</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-sm text-slate-300">Customer flow</p>
                  <p className="mt-1 text-lg font-medium">Browse products, book service, track updates, download invoices.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-sm text-slate-300">Admin flow</p>
                  <p className="mt-1 text-lg font-medium">Manage inventory, assign booking status, and issue invoices quickly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-border/60 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
