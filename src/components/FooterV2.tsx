import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";

export default function FooterV2() {
  return (
    <footer className="home-footer">
      <div className="container grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-[1.3fr_.7fr_1fr]">
        <div>
          <p className="home-footer-brand">Renuka Enterprises</p>
          <p className="mt-3 max-w-sm text-sm leading-7">
            Water purifiers, inverters and home service support in Nashik, Maharashtra.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/products">Products</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3>Get in touch</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <a href="tel:+919823021804" className="inline-flex items-center gap-3"><Phone className="h-4 w-4" /> +91 98230 21804</a>
            <p className="inline-flex items-center gap-3"><MapPin className="h-4 w-4" /> Nashik, Maharashtra</p>
            <p className="inline-flex items-center gap-3"><Clock3 className="h-4 w-4" /> Mon–Sat, 9 AM–7 PM</p>
            <Link to="/contact" className="mt-1 inline-flex items-center gap-2 font-semibold">Send an enquiry <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
      <div className="home-footer-bottom border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} Renuka Enterprises
      </div>
    </footer>
  );
}
