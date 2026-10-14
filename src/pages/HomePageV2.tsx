import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  Droplets,
  MapPin,
  PhoneCall,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PHONE = "+919823021804";

const categories = [
  {
    eyebrow: "WATER PURIFICATION",
    title: "Aquaguard purifiers",
    description: "Explore water purifiers, installation, filter changes and ongoing care.",
    image: "/photos/3.jpeg",
    alt: "Aquaguard water purifier range",
    icon: Droplets,
    to: "/products",
  },
  {
    eyebrow: "HOME POWER",
    title: "Inverters & UPS",
    description: "Find backup power products and support for home and business use.",
    image: "/photos/5.jpg",
    alt: "Home inverter and battery products",
    icon: BatteryCharging,
    to: "/products",
  },
  {
    eyebrow: "SERVICE & CARE",
    title: "Repairs & maintenance",
    description: "Get help with installation, troubleshooting and routine servicing.",
    image: "/photos/2.jpeg",
    alt: "Technician supporting a family with a water purifier",
    icon: Wrench,
    to: "/services",
  },
];

export default function HomePageV2() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow"><MapPin aria-hidden="true" /> Serving Nashik, Maharashtra</p>
            <h1>Everyday essentials.<br /><span>Expertly looked after.</span></h1>
            <p className="home-hero-intro">
              Water purifier and power backup products, with practical advice and service support from Renuka Enterprises.
            </p>
            <div className="home-hero-actions">
              <Button asChild size="lg" className="home-primary-button">
                <Link to="/products">Explore products <ArrowRight aria-hidden="true" /></Link>
              </Button>
              <a className="home-call-link" href={`tel:${PHONE}`} aria-label="Call Renuka Enterprises">
                <PhoneCall aria-hidden="true" /> <span>Call <strong>+91 98230 21804</strong></span>
              </a>
            </div>
            <div className="home-offerings" aria-label="Products and services">
              <span><Check aria-hidden="true" /> Aquaguard</span>
              <span><Check aria-hidden="true" /> Inverters</span>
              <span><Check aria-hidden="true" /> Batteries</span>
            </div>
          </div>
          <div className="home-hero-visual">
            <img
              src="/photos/1.jpg"
              alt="Aquaguard purifier in a bright home kitchen"
              fetchPriority="high"
            />
            <div className="home-image-note">
              <span className="home-image-note-mark"><Droplets aria-hidden="true" /></span>
              <span><strong>Care for the things</strong><small>your home relies on</small></span>
            </div>
            <span className="home-image-caption">WATER · POWER · HOME</span>
          </div>
        </div>
      </section>

      <section className="home-categories container" aria-labelledby="categories-heading">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2 id="categories-heading">Solutions for a more comfortable home.</h2>
          </div>
          <Link className="home-text-link" to="/services">View all services <ArrowRight aria-hidden="true" /></Link>
        </div>

        <div className="home-category-grid">
          {categories.map(({ eyebrow, title, description, image, alt, icon: Icon, to }) => (
            <Link to={to} className="home-category-card" key={title}>
              <div className="home-category-image">
                <img src={image} alt={alt} loading="lazy" />
                <span className="home-category-icon"><Icon aria-hidden="true" /></span>
              </div>
              <div className="home-category-copy">
                <p className="eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="home-card-link">Learn more <ArrowRight aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-service-band">
        <div className="container home-service-inner">
          <div>
            <p className="eyebrow">HERE WHEN YOU NEED US</p>
            <h2>From choosing a product to keeping it running.</h2>
            <p>Talk with our team about a new purchase, a service visit or the right next step for an existing appliance.</p>
          </div>
          <div className="home-service-actions">
            <Button asChild size="lg" className="home-light-button">
              <Link to="/contact">Request a callback <ArrowRight aria-hidden="true" /></Link>
            </Button>
            {user && <Link className="home-account-link" to={user.role === "admin" ? "/admin" : "/dashboard"}>Go to your {user.role === "admin" ? "admin" : "customer"} dashboard</Link>}
            {!user && <Link className="home-account-link" to="/login">Customer login <ArrowRight aria-hidden="true" /></Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
