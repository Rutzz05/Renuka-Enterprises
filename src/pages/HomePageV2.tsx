import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Droplets,
  MapPin,
  PhoneCall,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { productsAPI } from "@/services/apiClient";

const PHONE = "+919823021804";

const slides = [
  {
    eyebrow: "WATER, MADE PERSONAL",
    title: "A better glass of water starts at home.",
    description: "Explore Aquaguard purifiers and get help with choosing, installation and care.",
    image: "/homepage/aquaguard-kitchen.jpg",
    alt: "Aquaguard purifier in a naturally lit modern kitchen",
    fit: "cover",
    position: "left center",
    link: "/products",
    action: "Explore water purifiers",
    photoCredit: null,
  },
  {
    eyebrow: "POWER FOR THE EVERYDAY",
    title: "Keep the important things running.",
    description: "Find a backup power setup that suits your space, with inverter and battery support from our team.",
    image: "/homepage/inverter-home.jpg",
    alt: "Wall-mounted inverter and home energy equipment in a residential room",
    fit: "cover",
    position: "center center",
    link: "/products",
    action: "Explore inverters",
    photoCredit: "Photo by Sergio Martins on Unsplash",
    creditLink: "https://unsplash.com/photos/wall-mounted-solar-power-and-energy-storage-system-7WzD2mTRWK8",
  },
  {
    eyebrow: "CARE THAT FITS REAL LIFE",
    title: "A little help goes a long way.",
    description: "From a service question to a filter change, talk to a local team who can help you take the next step.",
    image: "/homepage/water-lifestyle.jpg",
    alt: "A woman filling a glass at her kitchen sink",
    fit: "cover",
    position: "center center",
    link: "/contact",
    action: "Talk to our team",
    photoCredit: "Photo by Centre for Ageing Better on Unsplash",
    creditLink: "https://unsplash.com/photos/woman-filling-a-glass-with-water-from-a-kitchen-faucet-EFr2VO8st2U",
  },
];

const categories = [
  {
    number: "01",
    label: "WATER PURIFICATION",
    name: "Aquaguard purifiers",
    description: "Choose a purifier, arrange installation or get advice about its ongoing care.",
    icon: Droplets,
    to: "/products",
  },
  {
    number: "02",
    label: "BACKUP POWER",
    name: "Inverters",
    description: "Find inverter options for the way your home or workplace uses power.",
    icon: BatteryCharging,
    to: "/products",
  },
  {
    number: "03",
    label: "BATTERY & SERVICE",
    name: "Batteries and care",
    description: "Ask about battery replacement, product support or a service visit.",
    icon: Wrench,
    to: "/services",
  },
];

const fallbackImages = ["/photos/4.jpeg", "/photos/5.jpg", "/photos/6.webp"];

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
};

function ProductImage({ product, fallback }: { product: Product; fallback: string }) {
  const [src, setSrc] = useState(product.image || fallback);
  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      onError={() => setSrc(fallback)}
    />
  );
}

export default function HomePageV2() {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const touchStart = useRef<number | null>(null);
  const slide = slides[activeSlide];

  useEffect(() => {
    let mounted = true;
    productsAPI.getAllProducts()
      .then(({ data }) => { if (mounted && Array.isArray(data)) setProducts(data.slice(0, 3)); })
      .catch(() => { if (mounted) setProducts([]); });
    return () => { mounted = false; };
  }, []);

  const showSlide = (offset: number) => {
    setActiveSlide((current) => (current + offset + slides.length) % slides.length);
  };

  return (
    <div className="home-page">
      <section
        className="home-hero"
        aria-roledescription="carousel"
        aria-label="Renuka Enterprises home solutions"
        onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 48) showSlide(distance < 0 ? 1 : -1);
          touchStart.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") showSlide(1);
          if (event.key === "ArrowLeft") showSlide(-1);
        }}
        tabIndex={0}
      >
        <div className="home-hero-copy-wrap">
          <div className="home-hero-copy" aria-live="polite" aria-atomic="true">
            <p className="home-eyebrow"><MapPin aria-hidden="true" /> NASHIK, MAHARASHTRA</p>
            <p className="home-slide-eyebrow">{slide.eyebrow}</p>
            <h1 key={slide.title}>{slide.title}</h1>
            <p className="home-hero-intro" key={slide.description}>{slide.description}</p>
            <div className="home-hero-actions">
              <Button asChild size="lg" className="home-primary-button">
                <Link to={slide.link}>{slide.action}<ArrowRight aria-hidden="true" /></Link>
              </Button>
              <a className="home-call-link" href={`tel:${PHONE}`}>
                <PhoneCall aria-hidden="true" /> <span>Call <strong>+91 98230 21804</strong></span>
              </a>
            </div>
            <div className="home-carousel-controls" aria-label="Slide controls">
              <button type="button" className="home-carousel-arrow" onClick={() => showSlide(-1)} aria-label="Previous slide">
                <ArrowLeft aria-hidden="true" />
              </button>
              <div className="home-carousel-dots">
                {slides.map((item, index) => (
                  <button
                    key={item.eyebrow}
                    type="button"
                    aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                    aria-current={activeSlide === index ? "true" : undefined}
                    className={activeSlide === index ? "is-active" : ""}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
              <span className="home-slide-count">0{activeSlide + 1} <i>/</i> 0{slides.length}</span>
              <button type="button" className="home-carousel-arrow" onClick={() => showSlide(1)} aria-label="Next slide">
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <figure className="home-hero-visual" key={slide.image}>
          <img
            src={slide.image}
            alt={slide.alt}
            fetchPriority={activeSlide === 0 ? "high" : "auto"}
            style={{ objectFit: slide.fit as "cover" | "contain", objectPosition: slide.position }}
          />
          {slide.photoCredit && slide.creditLink && (
            <figcaption><a href={slide.creditLink} target="_blank" rel="noreferrer">{slide.photoCredit}</a></figcaption>
          )}
        </figure>
      </section>

      <section className="home-categories" aria-labelledby="categories-heading">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">THE ESSENTIALS</p>
            <h2 id="categories-heading">Good choices for the way you live.</h2>
          </div>
          <p>Thoughtful product guidance and after-sales help, close to home in Nashik.</p>
        </div>
        <div className="home-category-list">
          {categories.map(({ number, label, name, description, icon: Icon, to }) => (
            <Link to={to} className="home-category-row" key={number}>
              <span className="home-category-number">{number}</span>
              <span className="home-category-icon"><Icon aria-hidden="true" /></span>
              <span className="home-category-content">
                <span className="home-category-label">{label}</span>
                <span className="home-category-name">{name}</span>
                <span className="home-category-description">{description}</span>
              </span>
              <ArrowDownRight className="home-category-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="home-products" aria-labelledby="products-heading">
          <div className="home-section-heading home-products-heading">
            <div>
              <p className="home-eyebrow">FROM OUR CATALOGUE</p>
              <h2 id="products-heading">Made for everyday use.</h2>
            </div>
            <Link className="home-text-link" to="/products">Browse all products <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="home-product-grid">
            {products.map((product, index) => (
              <article className="home-product" key={product._id}>
                <Link to="/products" className="home-product-image" aria-label={`View ${product.name}`}>
                  <ProductImage product={product} fallback={fallbackImages[index % fallbackImages.length]} />
                </Link>
                <div className="home-product-info">
                  <p className="home-category-label">{product.category}</p>
                  <h3><Link to="/products">{product.name}</Link></h3>
                  <p className="home-product-description">{product.description}</p>
                  <div className="home-product-bottom">
                    <span>{product.stock > 0 ? "Ask about availability" : "Check availability"}</span>
                    <a href={`tel:${PHONE}`} aria-label={`Call to enquire about ${product.name}`}><ArrowRight aria-hidden="true" /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="home-care" aria-labelledby="care-heading">
        <div className="home-care-photo">
          <img src="/homepage/home-lifestyle.jpg" alt="A woman enjoying a glass of water at home" loading="lazy" />
          <span>FOR THE RHYTHM OF HOME</span>
        </div>
        <div className="home-care-copy">
          <p className="home-eyebrow">PRODUCTS ARE ONLY THE BEGINNING</p>
          <h2 id="care-heading">A local team for the things you count on.</h2>
          <p>Get support with purifier installation and servicing, inverter repairs, battery replacements and product questions.</p>
          <ul>
            <li><Droplets aria-hidden="true" /> Aquaguard installation & service</li>
            <li><BatteryCharging aria-hidden="true" /> Inverter and battery support</li>
            <li><Wrench aria-hidden="true" /> Repairs and maintenance</li>
          </ul>
          <Link className="home-text-link" to="/services">See how we can help <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-contact" aria-labelledby="contact-heading">
        <div className="home-contact-inner">
          <div>
            <p className="home-eyebrow">LET’S TALK</p>
            <h2 id="contact-heading">Tell us what you need help with.</h2>
            <p>Call us directly or send a service request. We’ll help you find the right next step.</p>
          </div>
          <div className="home-contact-actions">
            <Button asChild size="lg" className="home-primary-button">
              <Link to="/contact">Request a service visit <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <a href={`tel:${PHONE}`} className="home-contact-phone"><PhoneCall aria-hidden="true" /> +91 98230 21804</a>
            <span className="home-contact-location"><MapPin aria-hidden="true" /> Nashik, Maharashtra</span>
            {user && <Link className="home-account-link" to={user.role === "admin" ? "/admin" : "/dashboard"}>Go to your {user.role === "admin" ? "admin" : "customer"} dashboard</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
