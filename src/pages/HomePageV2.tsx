import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PHONE = "+919823021804";

const homeImages = {
  purifierKitchen: "https://images.unsplash.com/photo-1662647343432-a8710bfd6162?auto=format&fit=crop&w=1400&q=80",
  purifierProduct: "https://images.unsplash.com/photo-1662460149330-dc1780e5f6bd?auto=format&fit=crop&w=1400&q=80",
  purifierClose: "https://images.unsplash.com/photo-1662460150087-541eed218e0b?auto=format&fit=crop&w=1400&q=80",
  serviceTechnician: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
  backupPower: "https://images.unsplash.com/photo-1595397210491-957770d2568a?auto=format&fit=crop&w=1400&q=80",
  batterySystem: "https://images.unsplash.com/photo-1742899273038-67ff67477663?auto=format&fit=crop&w=1400&q=80",
};

const heroSlides = [
  {
    src: homeImages.purifierKitchen,
    alt: "Modern water purifier setup in a clean kitchen",
    label: "Aquaguard Sales & Service",
  },
  {
    src: homeImages.serviceTechnician,
    alt: "Technician checking electrical service equipment",
    label: "Home Service Visits",
  },
  {
    src: homeImages.backupPower,
    alt: "Backup power equipment for reliable electricity",
    label: "Inverter Support",
  },
  {
    src: homeImages.batterySystem,
    alt: "Battery backup system for power storage",
    label: "Battery Replacement",
  },
];

const services = [
  {
    title: "Aquaguard service",
    description: "Installation, filter change, leakage repair, maintenance, and purifier support.",
    icon: Droplets,
    image: homeImages.purifierProduct,
  },
  {
    title: "Inverter service",
    description: "Repair, backup issues, charging problems, and routine checks for power systems.",
    icon: BatteryCharging,
    image: homeImages.backupPower,
  },
  {
    title: "Battery support",
    description: "Battery health checks, replacement guidance, and reliable backup support.",
    icon: ShieldCheck,
    image: homeImages.batterySystem,
  },
];

const trustPoints = [
  { label: "10+ years", detail: "Local service experience", icon: Star },
  { label: "Nashik", detail: "Homes, shops, and offices", icon: MapPin },
  { label: "Quick help", detail: "Call and WhatsApp support", icon: PhoneCall },
  { label: "AMC support", detail: "Regular maintenance plans", icon: Wrench },
];

function HomePhoto({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImageSrc("/placeholder.svg")}
    />
  );
}

export default function HomePageV2() {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%,#f1f8f6_100%)]">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
              <MapPin className="h-4 w-4" />
              Trusted Aquaguard, inverter and battery service in Nashik
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Renuka Enterprises
              </h1>
              <p className="max-w-2xl text-xl font-semibold text-slate-800 sm:text-2xl">
                Aquaguard, inverter and battery service you can rely on.
              </p>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                We help homes, shops, and local businesses with product supply, installation,
                repair, AMC visits, and after-sales support with clear communication.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`}>
                <Button size="lg" className="w-full gap-2 rounded-lg sm:w-auto">
                  <PhoneCall className="h-4 w-4" />
                  Call Now
                </Button>
              </a>
              <Button asChild size="lg" variant="outline" className="rounded-lg">
                <Link to="/contact">
                  Book Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Aquaguard", "Sales & service"],
                ["Inverter", "Repair & install"],
                ["Battery", "Health & replacement"],
              ].map(([label, detail]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-950">{label}</p>
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-600">
              {user
                ? `Welcome back, ${user.name}. Your bookings and invoices are available in your dashboard.`
                : "Login is available for customer bookings, invoice tracking, and admin management."}
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {heroSlides.map((slide) => (
                  <div key={slide.src} className="relative h-[320px] min-w-full sm:h-[420px] lg:h-[500px]">
                    <HomePhoto src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                        {slide.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-5 right-5 flex gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Show ${slide.label}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {trustPoints.map(({ label, detail, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xl font-bold text-slate-950">{label}</p>
              <p className="text-sm text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">Our services</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">Solutions for everyday power and water needs</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Product supply and dependable service support for essential systems used in homes and businesses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map(({ title, description, icon: Icon, image }) => (
            <article key={title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="h-44 bg-slate-100">
                <HomePhoto src={image} alt={title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-14 md:pb-20">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:grid-cols-[0.95fr_1.05fr] md:p-8 lg:p-10">
          <div className="overflow-hidden rounded-xl bg-white">
            <HomePhoto src={homeImages.purifierClose} alt="Water purifier product detail" className="h-full min-h-64 w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Need help quickly?</p>
            <h2 className="mt-3 text-3xl font-bold">Book a service visit or ask for product guidance</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Whether it is urgent repair, routine maintenance, filter replacement, or a new product enquiry,
              we can guide you on the right next step.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              {["Same-day call response", "Service across Nashik", "Product and AMC guidance", "Clear visit communication"].map((point) => (
                <p key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {point}
                </p>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${PHONE}`}>
                <Button size="lg" className="w-full gap-2 rounded-lg bg-emerald-400 text-slate-950 hover:bg-emerald-300 sm:w-auto">
                  <PhoneCall className="h-4 w-4" />
                  Call +91 98230 21804
                </Button>
              </a>
              <Button asChild size="lg" variant="outline" className="rounded-lg border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link to="/products">View Products</Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              Mon-Sat, 9 AM to 7 PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
