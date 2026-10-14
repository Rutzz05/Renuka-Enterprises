import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Wrench } from 'lucide-react';
import ServiceBookingFormV3 from '@/components/ServiceBookingFormV3';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="booking-page">
      <section className="hero route-hero">
        <div className="container booking-hero-copy py-12">
          <Link to="/dashboard" className="booking-back-link inline-flex items-center gap-2 text-sm transition">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="home-eyebrow">Customer support desk</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Schedule service without the back-and-forth.
              </h1>
              <p className="booking-intro mt-4 max-w-2xl text-base md:text-lg">
                Pick the product type, issue, and preferred slot. We will confirm the visit and send the technician with the right parts.
              </p>
            </div>
            <div className="booking-points grid gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="booking-point-icon flex h-12 w-12 items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fast scheduling</p>
                  <p className="text-sm">Book installation, maintenance, or urgent repair.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="booking-point-icon flex h-12 w-12 items-center justify-center">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Flexible slots</p>
                  <p className="text-sm">Morning and afternoon visits available across Nashik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14">
        <ServiceBookingFormV3
          source="dashboard"
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
          }}
          title="Create a new service booking"
          subtitle="Your details are prefilled from your account. Update them only if this booking is for someone else."
          onSuccess={() => {
            setTimeout(() => navigate('/dashboard'), 1400);
          }}
        />
      </section>
    </div>
  );
};

export default BookingPage;
