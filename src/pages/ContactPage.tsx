import { Phone, MapPin, MessageCircle } from "lucide-react";
import ServiceBookingFormV3 from "@/components/ServiceBookingFormV3";

const PHONE = "+919823021804";

export default function ContactPage() {
  const handleCall = () => {
    window.location.href = `tel:${PHONE}`;
  };

  return (
    <>
      <section className="hero relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/5" />
        <div className="container relative text-center text-primary-foreground z-10 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Contact Us</h1>
          <p className="opacity-95 max-w-lg mx-auto text-lg">
            Reach out for service requests, queries, or product enquiries.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Booking form (reusable component) */}
          <div className="lg:col-span-2">
            <ServiceBookingFormV3
              source="contact"
              title="Request a callback or technician visit"
              subtitle="Share your service need here and our team will call to confirm pricing, timing, and the visit slot."
            />
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-5">
            <div className="card-elevated rounded-lg bg-card p-6">
              <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href={`tel:${PHONE}`} onClick={handleCall} className="text-primary hover:underline">+91 98230 21804</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-whatsapp mt-0.5" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a
                      href={`https://wa.me/919823021804`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-whatsapp hover:underline"
                    >
                      Chat with us
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Nashik, Maharashtra, India</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <a href="#service-booking-form">
                  <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md transition-smooth">Book Service</button>
                </a>
              </div>
            </div>
            <div className="card-elevated rounded-lg bg-muted p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Working Hours</p>
              <p className="font-bold">Mon – Sat: 9 AM – 7 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
