import { Link } from "react-router-dom";
import { Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container section grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg text-background mb-3">Renuka Enterprises</h3>
          <p className="text-sm leading-relaxed">
            Trusted Aquaguard & Inverter specialists in Nashik with over 10 years of dedicated service.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-background mb-3 uppercase tracking-wide">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-background transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-background transition-colors">Services</Link></li>
            <li><Link to="/products" className="hover:text-background transition-colors">Products</Link></li>
            <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-background mb-3 uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+919823021804" className="hover:underline transition-colors">
                +91 9823021804
              </a>
            </li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Nashik, Maharashtra</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mon–Sat, 9 AM – 7 PM</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-background mb-3 uppercase tracking-wide">We Service</h4>
          <ul className="space-y-2 text-sm">
            <li>Aquaguard Water Purifiers</li>
            <li>Inverters & UPS Systems</li>
            <li>Battery Replacement</li>
            <li>AMC & Maintenance</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Renuka Enterprises, Nashik. All rights reserved.
      </div>
    </footer>
  );
}
