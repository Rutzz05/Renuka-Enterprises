import { Link } from "react-router-dom";
import { Clock3, MapPin, Phone } from "lucide-react";

export default function FooterV2() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="container grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/80">Renuka Enterprises</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Sales, service, repairs, and support for Aquaguard water purifiers and inverter systems across Nashik.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Quick links</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/services" className="hover:text-white">Services</Link>
            <Link to="/products" className="hover:text-white">Products</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Contact</h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-400">
            <p className="inline-flex items-center gap-3"><Phone className="h-4 w-4" /> +91 98230 21804</p>
            <p className="inline-flex items-center gap-3"><MapPin className="h-4 w-4" /> Nashik, Maharashtra</p>
            <p className="inline-flex items-center gap-3"><Clock3 className="h-4 w-4" /> Mon-Sat, 9 AM to 7 PM</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Services covered</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <p>Aquaguard installation and repair</p>
            <p>Filter changes and AMC support</p>
            <p>Inverter installation and servicing</p>
            <p>Battery replacement and diagnostics</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Renuka Enterprises. All rights reserved.
      </div>
    </footer>
  );
}
